import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* SEO */}
      <title>Aura Photography - Discover Your Energy</title>
      <meta name="description" content="Capture your aura and discover your chakra energy with our mystical photo experience. Free, instant, and beautiful." />
      
      {/* Subtle aura gradient background (keeping existing) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-home-aura)" }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 50% 55%, hsl(var(--home-glow-core) / 0.25) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-end p-6">
        <Link to="/gallery">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-foreground/80 hover:text-foreground hover:bg-foreground/5"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col px-6 sm:px-12 lg:px-20 pb-12">
        {/* Large Title at Top */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-foreground tracking-tight text-center mt-8 sm:mt-12"
        >
          Do you wanna see your colors?
        </motion.h1>

        {/* Content area */}
        <div className="flex-1 flex items-center mt-12 sm:mt-16">
          {/* Left side - Content Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="max-w-sm"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-border/20 p-6 sm:p-8">
              <p className="text-foreground/90 text-base sm:text-lg mb-2">
                Discover the color of your energy.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg mb-8">
                Capture your aura and reveal your inner light.
              </p>

              {/* CTA Button */}
              <Link to="/capture">
                <Button 
                  variant="outline" 
                  className="gap-2 group border-foreground/30 hover:bg-foreground/5 text-foreground"
                >
                  <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Capture your Aura
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Privacy note */}
      <footer className="relative z-10 pb-6 px-6 sm:px-12">
        <p className="text-xs text-muted-foreground/60">
          Your photos never leave your device
        </p>
      </footer>
    </div>
  );
};

export default Index;
