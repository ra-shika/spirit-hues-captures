import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, RotateCcw, ArrowRight, Loader2, Upload, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuraOverlay } from "@/components/AuraOverlay";
import { analyzeAura, AuraAnalysis } from "@/lib/auraAnalysis";
import { compressImage, generateId, saveToGallery, AuraPhoto } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

type CaptureState = "camera" | "preview" | "processing" | "result";

const Capture = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<CaptureState>("camera");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [auraAnalysis, setAuraAnalysis] = useState<AuraAnalysis | null>(null);
  const [auraPhoto, setAuraPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Camera functions
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Stop any existing stream first
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to access camera";
      if (message.includes("Permission denied") || message.includes("NotAllowedError")) {
        setError("Camera permission denied. Please allow camera access.");
      } else if (message.includes("NotFoundError")) {
        setError("No camera found on this device.");
      } else {
        setError("Unable to access camera. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.9);
  }, []);

  // Start camera when entering camera state
  useEffect(() => {
    if (state === "camera") {
      startCamera();
    }
    return () => {
      if (state === "camera") {
        stopCamera();
      }
    };
  }, [state, startCamera, stopCamera]);

  // Countdown: 3 → 2 → 1 → capture
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      const photo = capturePhoto();
      if (photo) {
        setCapturedPhoto(photo);
        setState("preview");
      }
      return;
    }

    const t = window.setTimeout(() => {
      setCountdown((c) => (c === null ? null : c - 1));
    }, 1000);

    return () => window.clearTimeout(t);
  }, [countdown, capturePhoto]);

  const handleCapture = useCallback(() => {
    if (isLoading || !!error || countdown !== null) return;
    setCountdown(3);
  }, [isLoading, error, countdown]);

  const handleRetake = useCallback(() => {
    setCountdown(null);
    setCapturedPhoto(null);
    setAuraAnalysis(null);
    setAuraPhoto(null);
    setState("camera");
  }, []);

  const handleContinue = useCallback(async () => {
    if (!capturedPhoto) return;

    setState("processing");

    try {
      const analysis = await analyzeAura(capturedPhoto);
      setAuraAnalysis(analysis);
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
      handleRetake();
    }
  }, [capturedPhoto, toast, handleRetake]);

  const handleAuraComplete = useCallback((photo: string) => {
    setAuraPhoto(photo);
    setState("result");
  }, []);

  const handleSave = useCallback(async () => {
    if (!capturedPhoto || !auraPhoto || !auraAnalysis) return;
    
    try {
      const compressed = await compressImage(auraPhoto);
      
      const photoData: AuraPhoto = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        photo: capturedPhoto,
        auraPhoto: compressed,
        dominantColors: auraAnalysis.dominantColors,
        reading: auraAnalysis.reading,
      };
      
      const result = saveToGallery(photoData);
      
      if (result.success) {
        toast({
          title: "Saved to gallery",
          description: result.warning || "Your aura has been preserved",
        });
      } else {
        toast({
          title: "Gallery full",
          description: result.warning,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [capturedPhoto, auraPhoto, auraAnalysis, toast]);

  const handleClose = () => {
    stopCamera();
    navigate("/");
  };

  const handleUploadImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Read and process the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize/process image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size (max 1080x1080)
        const maxSize = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(photoData);
        stopCamera();
        setState('preview');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [stopCamera, toast]);

  return (
    <div className="min-h-screen bg-[#0a0118] flex flex-col relative overflow-hidden">
      {/* Galaxy Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, #1a0b2e 0%, #0a0118 50%, #000000 100%)'
          }}
        />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.5)'
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)'
          }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      {/* Camera View */}
      <AnimatePresence mode="wait">
        {state === "camera" && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-6 left-6 z-20 text-card hover:bg-card/20"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Video preview */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Face guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-card/30" />
            </div>

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]">
                <div className="flex flex-col items-center">
                  <div className="font-display text-7xl text-card drop-shadow-lg">
                    {countdown}
                  </div>
                  <div className="mt-2 text-card/80 text-sm">Hold still</div>
                </div>
              </div>
            )}

            {/* Loading/Error states */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                <Loader2 className="w-8 h-8 text-card animate-spin" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground p-8">
                <div className="text-center text-card">
                  <p className="text-lg mb-4">{error}</p>
                  <Button variant="outline" onClick={handleClose}>
                    Go Back
                  </Button>
                </div>
              </div>
            )}

            {/* Capture and Upload buttons */}
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={handleUploadImage}
                    disabled={isLoading || !!error || countdown !== null}
                    className="w-16 h-16 rounded-full text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Upload className="w-6 h-6" />
                  </Button>
                  <span className="text-xs text-white/60">Upload</span>
                </div>
                
                <Button
                  variant="capture"
                  size="icon-lg"
                  onClick={handleCapture}
                  disabled={isLoading || !!error || countdown !== null}
                  className="w-20 h-20 rounded-full"
                >
                  <Camera className="w-8 h-8" />
                </Button>
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </motion.div>
        )}

        {/* Preview View */}
        {state === "preview" && capturedPhoto && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground"
          >
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />

            {/* Action buttons */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8">
              <Button
                variant="capture"
                size="icon-lg"
                onClick={handleRetake}
                className="rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
              <Button
                variant="aura"
                size="icon-lg"
                onClick={handleContinue}
                className="rounded-full"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Processing View */}
        {state === "processing" && capturedPhoto && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 mb-6"
            />
            <p className="font-display text-xl text-white">Analyzing your aura...</p>
            
            {/* Hidden aura processing */}
            {auraAnalysis && (
              <AuraOverlay
                photo={capturedPhoto}
                colors={auraAnalysis.dominantColors}
                onComplete={handleAuraComplete}
              />
            )}
          </motion.div>
        )}

        {/* Result View */}
        {state === "result" && auraPhoto && auraAnalysis && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative"
          >
            <ResultView
              auraPhoto={auraPhoto}
              analysis={auraAnalysis}
              onRetake={handleRetake}
              onSave={handleSave}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Result View Component
interface ResultViewProps {
  auraPhoto: string;
  analysis: AuraAnalysis;
  onRetake: () => void;
  onSave: () => void;
  onClose: () => void;
}

function ResultView({ auraPhoto, analysis, onRetake, onSave, onClose }: ResultViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const createBrandedImage = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(auraPhoto);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Set canvas size with padding for branding
        const padding = 40;
        const brandingHeight = 100;
        canvas.width = img.width;
        canvas.height = img.height + brandingHeight + padding;

        // Draw galaxy background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a0b2e');
        gradient.addColorStop(0.5, '#0a0118');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the aura photo
        ctx.drawImage(img, 0, 0);

        // Draw branding section
        const brandY = img.height + padding / 2;
        
        // Add semi-transparent overlay
        ctx.fillStyle = 'rgba(147, 51, 234, 0.1)';
        ctx.fillRect(0, brandY, canvas.width, brandingHeight);

        // Add AuraCapture text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AuraCapture', canvas.width / 2, brandY + 40);

        // Add reading text
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const readingText = analysis.reading.length > 60 
          ? analysis.reading.substring(0, 57) + '...' 
          : analysis.reading;
        ctx.fillText(`"${readingText}"`, canvas.width / 2, brandY + 70);

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = auraPhoto;
    });
  }, [auraPhoto, analysis.reading]);

  const handleShare = useCallback(async () => {
    try {
      // Create branded image
      const brandedImage = await createBrandedImage();
      
      // Try to use Web Share API first (works on mobile)
      if (navigator.share && navigator.canShare) {
        // Convert base64 to blob
        const response = await fetch(brandedImage);
        const blob = await response.blob();
        const file = new File([blob], 'my-aura-capture.jpg', { type: 'image/jpeg' });
        
        const shareData = {
          title: 'My Aura Reading - AuraCapture',
          text: `✨ Discover your energy colors! ${analysis.reading}\n\nCreated with AuraCapture`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          
          toast({
            title: "Shared!",
            description: "Your aura has been shared",
          });
          return;
        }
      }
      
      // Fallback: Download the branded image
      const link = document.createElement('a');
      link.href = brandedImage;
      link.download = 'my-aura-capture.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "Image saved. You can now share it on social media",
      });
    } catch (error) {
      // If sharing was cancelled or failed
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback to download original
        const link = document.createElement('a');
        link.href = auraPhoto;
        link.download = 'my-aura-capture.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Downloaded!",
          description: "Image saved. You can now share it on social media",
        });
      }
    }
  }, [auraPhoto, analysis.reading, createBrandedImage, toast]);
  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10">
          <X className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")} className="text-white/70 hover:text-white hover:bg-white/10">
          Gallery
        </Button>
      </div>

      {/* Aura Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-sm mx-auto mb-8 z-10"
      >
        <div className="aspect-square shadow-2xl bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/10">
          <img
            src={auraPhoto}
            alt="Your aura"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Color indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center gap-3 mb-8 z-10 relative"
      >
        {analysis.dominantColors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white/30"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-sm text-white/70">{color.chakra}</span>
          </div>
        ))}
      </motion.div>

      {/* Reading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md mx-auto text-center mb-12 relative z-10"
      >
        <p className="font-display text-lg text-white/90 leading-relaxed">
          "{analysis.reading}"
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        {/* Primary actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onRetake} className="gap-2 backdrop-blur-md bg-white/5 hover:bg-white/10 border-2 border-purple-400/30 hover:border-purple-400/50 text-white/90">
            <RotateCcw className="w-4 h-4" />
            Retake
          </Button>
          <Button onClick={onSave} className="gap-2 shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border-0">
            Save to Gallery
          </Button>
        </div>
        
        {/* Share to Social Media */}
        <Button 
          variant="outline"
          onClick={handleShare}
          className="gap-2 backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-400/40 hover:border-pink-400/50 text-white/90 min-w-[200px]"
        >
          <Share2 className="w-4 h-4" />
          Share to Social Media
        </Button>
      </motion.div>
    </div>
  );
}

export default Capture;
