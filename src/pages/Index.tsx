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
      
      {/* Subtle aura gradient background (reference-inspired) */}
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card/40 backdrop-blur-sm border border-border/30 shadow-soft">
              <Sparkles className="w-7 h-7 text-foreground" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-medium text-foreground mb-4 tracking-tight"
          >
            Aura
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground text-lg mb-12 leading-relaxed"
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
              <Button variant="hero" size="xl" className="gap-3 group shadow-soft">
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
            className="mt-8 text-xs text-muted-foreground"
          >
            Your photos never leave your device
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs text-muted-foreground/70">Powered by chakra wisdom</p>
      </footer>
    </div>
  );
};

export default Index;
