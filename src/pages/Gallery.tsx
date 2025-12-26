import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Trash2, X, Grid, Columns } from "lucide-react";
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/">
            <Button variant="minimal" size="icon-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <h1 className="font-display text-xl text-foreground">Gallery</h1>
          
          <Button
            variant="minimal"
            size="icon-sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setComparePhotos([]);
            }}
            className={compareMode ? "text-primary" : ""}
          >
            {compareMode ? <Grid className="w-5 h-5" /> : <Columns className="w-5 h-5" />}
          </Button>
        </div>
        
        {compareMode && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground">
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
          className="flex flex-col items-center justify-center min-h-[60vh] px-6"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">No photos yet</h2>
          <p className="text-muted-foreground text-center mb-8">
            Capture your first aura to start your collection
          </p>
          <Link to="/capture">
            <Button variant="hero" className="gap-2">
              <Camera className="w-4 h-4" />
              Capture Aura
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="p-6">
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
              <Button variant="outline" className="gap-2">
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
            className="fixed inset-x-0 bottom-0 bg-card border-t border-border p-6 rounded-t-3xl shadow-soft"
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
                  <p className="text-xs text-muted-foreground text-center">
                    {formatDate(photo.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
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
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          >
            <div className="h-full overflow-y-auto">
              <div className="min-h-full px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <Button
                    variant="minimal"
                    size="icon-sm"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedPhoto.timestamp)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="text-destructive hover:text-destructive"
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
                        className="w-4 h-4 rounded-full border border-border/30"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-muted-foreground">{color.chakra}</span>
                    </div>
                  ))}
                </div>

                {/* Reading */}
                <div className="max-w-md mx-auto text-center">
                  <p className="font-display text-lg text-foreground leading-relaxed">
                    "{selectedPhoto.reading}"
                  </p>
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
