import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { AuraOverlay } from "@/components/AuraOverlay";
import { analyzeAura, AuraAnalysis } from "@/lib/auraAnalysis";
import { compressImage, generateId, saveToGallery, AuraPhoto } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import ScratchReveal from "@/components/ScratchReveal";

type CaptureState = "camera" | "preview" | "processing" | "result";

const Capture = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { videoRef, canvasRef, isLoading, error, startCamera, stopCamera, capturePhoto } = useCamera();

  const [state, setState] = useState<CaptureState>("camera");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [auraAnalysis, setAuraAnalysis] = useState<AuraAnalysis | null>(null);
  const [auraPhoto, setAuraPhoto] = useState<string | null>(null);

  // Start/stop camera based on view state (fixes black preview after retake)
  useEffect(() => {
    if (state === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

            {/* Capture button */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
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
            className="fixed inset-0 bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary mb-6"
            />
            <p className="font-display text-xl text-foreground">Analyzing your aura...</p>
            
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
            className="min-h-screen bg-background"
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
  const [isRevealed, setIsRevealed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button variant="minimal" size="icon-sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <Button variant="minimal" size="sm" onClick={() => navigate("/gallery")}>
          Gallery
        </Button>
      </div>

      {/* Aura Photo with Scratch Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-sm mx-auto mb-8"
      >
        <div className="aspect-square shadow-soft bg-card">
          <ScratchReveal onReveal={() => setIsRevealed(true)}>
            <img
              src={auraPhoto}
              alt="Your aura"
              className="w-full h-full object-cover"
            />
          </ScratchReveal>
        </div>
      </motion.div>

      {/* Color indicators - show after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-3 mb-8"
          >
            {analysis.dominantColors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-border/30"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-muted-foreground">{color.chakra}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading - show after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md mx-auto text-center mb-12"
          >
            <p className="font-display text-lg text-foreground leading-relaxed">
              "{analysis.reading}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions - show after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            <Button variant="outline" onClick={onRetake} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
            <Button variant="hero" onClick={onSave} className="gap-2">
              Save to Gallery
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Capture;
