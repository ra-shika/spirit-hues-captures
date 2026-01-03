import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Trash2, X, Grid, Columns, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGallery, deleteFromGallery, AuraPhoto } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Gallery = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<AuraPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<AuraPhoto | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<AuraPhoto[]>([]);

  useEffect(() => {
    setPhotos(getGallery());
  }, []);

  const handleDelete = (id: string) => {
    if (deleteFromGallery(id)) {
      setPhotos(getGallery());
      setSelectedPhoto(null);
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from your gallery",
      });
    }
  };

  const handleCompareSelect = (photo: AuraPhoto) => {
    if (comparePhotos.find(p => p.id === photo.id)) {
      setComparePhotos(comparePhotos.filter(p => p.id !== photo.id));
    } else if (comparePhotos.length < 2) {
      setComparePhotos([...comparePhotos, photo]);
    }
  };

  const createBrandedImage = useCallback(async (photo: AuraPhoto): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(photo.auraPhoto);
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
        const readingText = photo.reading.length > 60 
          ? photo.reading.substring(0, 57) + '...' 
          : photo.reading;
        ctx.fillText(`"${readingText}"`, canvas.width / 2, brandY + 70);

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = photo.auraPhoto;
    });
  }, []);

  const handleShare = useCallback(async (photo: AuraPhoto) => {
    try {
      // Create branded image
      const brandedImage = await createBrandedImage(photo);
      
      // Try to use Web Share API first (works on mobile)
      if (navigator.share && navigator.canShare) {
        // Convert base64 to blob
        const response = await fetch(brandedImage);
        const blob = await response.blob();
        const file = new File([blob], 'my-aura-capture.jpg', { type: 'image/jpeg' });
        
        const shareData = {
          title: 'My Aura Reading - AuraCapture',
          text: `✨ Discover your energy colors! ${photo.reading}\n\nCreated with AuraCapture`,
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
      link.download = `aura-capture-${formatDate(photo.timestamp)}.jpg`;
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
        link.href = photo.auraPhoto;
        link.download = `aura-${formatDate(photo.timestamp)}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Downloaded!",
          description: "Image saved. You can now share it on social media",
        });
      }
    }
  }, [createBrandedImage, toast]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0118] relative overflow-hidden">
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
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0118]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="icon-sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <h1 className="font-display text-xl text-white/90">Gallery</h1>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setComparePhotos([]);
            }}
            className={compareMode ? "text-purple-400 hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10"}
          >
            {compareMode ? <Grid className="w-5 h-5" /> : <Columns className="w-5 h-5" />}
          </Button>
        </div>
        
        {compareMode && (
          <div className="px-6 pb-4">
            <p className="text-sm text-white/60">
              {comparePhotos.length === 0 
                ? "Select two photos to compare"
                : `${comparePhotos.length}/2 selected`}
            </p>
          </div>
        )}
      </header>

      {/* Empty state */}
      {photos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] px-6 relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="font-display text-2xl text-white/90 mb-2">No photos yet</h2>
          <p className="text-white/60 text-center mb-8">
            Capture your first aura to start your collection
          </p>
          <Link to="/capture">
            <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border-0">
              <Camera className="w-4 h-4" />
              Capture Aura
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="p-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                  compareMode && comparePhotos.find(p => p.id === photo.id)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => {
                  if (compareMode) {
                    handleCompareSelect(photo);
                  } else {
                    setSelectedPhoto(photo);
                  }
                }}
              >
                <img
                  src={photo.auraPhoto}
                  alt="Aura photo"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-card truncate">{formatDate(photo.timestamp)}</p>
                </div>
                
                {/* Color dots */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {photo.dominantColors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-card/30"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* New photo button */}
          <div className="mt-8 text-center">
            <Link to="/capture">
              <Button className="gap-2 backdrop-blur-md bg-white/5 hover:bg-white/10 border-2 border-purple-400/30 hover:border-purple-400/50 text-white/90">
                <Camera className="w-4 h-4" />
                Take New Photo
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Compare View */}
      <AnimatePresence>
        {compareMode && comparePhotos.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 bg-[#1a0b2e]/95 backdrop-blur-md border-t border-white/10 p-6 rounded-t-3xl shadow-2xl"
          >
            <div className="flex gap-4 mb-4">
              {comparePhotos.map((photo) => (
                <div key={photo.id} className="flex-1">
                  <div className="aspect-square rounded-xl overflow-hidden mb-2">
                    <img
                      src={photo.auraPhoto}
                      alt="Compare"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-white/60 text-center">
                    {formatDate(photo.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            <Button
              className="w-full backdrop-blur-md bg-white/5 hover:bg-white/10 border-2 border-purple-400/30 hover:border-purple-400/50 text-white/90"
              onClick={() => setComparePhotos([])}
            >
              Clear Selection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0118]/95 backdrop-blur-sm"
          >
            <div className="h-full overflow-y-auto">
              <div className="min-h-full px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setSelectedPhoto(null)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <p className="text-sm text-white/60">
                    {formatDate(selectedPhoto.timestamp)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-sm mx-auto mb-8"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                    <img
                      src={selectedPhoto.auraPhoto}
                      alt="Your aura"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Colors */}
                <div className="flex justify-center gap-3 mb-8">
                  {selectedPhoto.dominantColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-white/70">{color.chakra}</span>
                    </div>
                  ))}
                </div>

                {/* Reading */}
                <div className="max-w-md mx-auto text-center mb-8">
                  <p className="font-display text-lg text-white/90 leading-relaxed">
                    "{selectedPhoto.reading}"
                  </p>
                </div>

                {/* Share Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => handleShare(selectedPhoto)}
                    className="gap-2 backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-400/40 hover:border-pink-400/50 text-white/90"
                  >
                    <Share2 className="w-4 h-4" />
                    Share to Social Media
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  
  );
};

export default Gallery;
