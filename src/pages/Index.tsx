import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* SEO */}
      <title>Aura Photography - Discover Your Energy</title>
      <meta name="description" content="Capture your aura and discover your chakra energy with our mystical photo experience. Free, instant, and beautiful." />
      
      {/* Vibrant aura gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Central radial gradient - yellow core fading to pink/magenta edges */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                hsl(50, 100%, 65%) 0%,
                hsl(45, 100%, 60%) 15%,
                hsl(35, 95%, 55%) 25%,
                hsl(340, 90%, 65%) 45%,
                hsl(320, 85%, 60%) 60%,
                hsl(300, 75%, 55%) 75%,
                hsl(290, 70%, 50%) 90%,
                hsl(280, 65%, 45%) 100%
              )
            `
          }}
        />
        
        {/* Animated pulsing glow layers */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                hsl(50, 100%, 70%) 0%,
                transparent 50%
              )
            `
          }}
        />
        
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                transparent 30%,
                hsl(340, 90%, 70%) 50%,
                transparent 70%
              )
            `
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-end p-6">
        <Link to="/gallery">
          <Button variant="ghost" size="sm" className="gap-2 text-white/90 hover:text-white hover:bg-white/20">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-md mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-medium text-white mb-4 tracking-tight drop-shadow-lg"
          >
            Aura
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/90 text-lg mb-12 leading-relaxed drop-shadow-md"
          >
            Discover the colors of your energy. 
            <br className="hidden sm:block" />
            Capture your aura and reveal your inner light.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to="/capture">
              <Button 
                size="xl" 
                className="gap-3 group bg-white/95 hover:bg-white text-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
                Capture Your Aura
              </Button>
            </Link>
          </motion.div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 text-xs text-white/60"
          >
            Your photos never leave your device
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs text-white/40">
          Powered by chakra wisdom
        </p>
      </footer>
    </div>
  );
};

export default Index;
