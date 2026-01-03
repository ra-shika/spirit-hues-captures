import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0118] relative overflow-hidden">
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
            background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)'
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 px-6"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 inline-block"
        >
          <Sparkles className="w-16 h-16 text-purple-400" />
        </motion.div>
        <h1 className="mb-4 text-6xl font-bold font-display bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">404</h1>
        <p className="mb-8 text-xl text-white/70">Oops! This aura doesn't exist</p>
        <a href="/">
          <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border-0">
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
