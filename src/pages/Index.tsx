import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, BookOpen, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0118]">
      {/* SEO */}
      <title>AuraCapture - Discover Your Energy Colors</title>
      <meta name="description" content="Capture your aura and discover your chakra energy with our mystical photo experience. Free, instant, and beautiful." />
      
      {/* Galaxy Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Deep space gradient base */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, #1a0b2e 0%, #0a0118 50%, #000000 100%)'
          }}
        />
        
        {/* Nebula clouds */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)'
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating nebula orbs - cosmic gas clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 400 + 300,
              height: Math.random() * 400 + 300,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                [
                  'rgba(147, 51, 234, 0.25)', // purple
                  'rgba(236, 72, 153, 0.2)', // pink
                  'rgba(59, 130, 246, 0.18)', // blue
                  'rgba(168, 85, 247, 0.22)', // violet
                  'rgba(219, 39, 119, 0.2)' // rose
                ][i]
              }, transparent 70%)`,
              filter: 'blur(60px)',
              mixBlendMode: 'screen'
            }}
            animate={{
              x: [0, Math.random() * 150 - 75, 0],
              y: [0, Math.random() * 150 - 75, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Stars - small twinkling dots */}
        {[...Array(100)].map((_, i) => (
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
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Larger glowing stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bigstar-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              style={{
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(147, 51, 234, 0.4)'
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          </motion.div>
        ))}

        {/* Aurora/cosmic light rays */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(147, 51, 234, 0.1) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)'
          }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              width: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformOrigin: 'left center',
              rotate: '-45deg'
            }}
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [-100, 300]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 10 + 5,
              ease: "easeOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-display text-lg text-white/90">AuraCapture</span>
        </motion.div>
        <Link to="/gallery">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md border border-white/10"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Button>
        </Link>
      </header>

      {/* Main content - Split Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            {/* Main Heading */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-sm font-medium text-purple-200 backdrop-blur-md">
                  ✨ Energy Discovery
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="block text-white/95">Do you wanna see</span>
                <span 
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.4))'
                  }}
                >
                  your colors?
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-3 text-lg text-white/70"
              >
                <p className="border-l-2 border-purple-400/50 pl-4">
                  Discover the color of your energy.
                </p>
                <p className="border-l-2 border-pink-400/50 pl-4">
                  Capture your aura and reveal your inner light.
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/capture">
                <Button 
                  size="lg"
                  className="gap-3 group shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border-0 px-8 py-6 text-lg relative overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Camera className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Capture your Aura
                </Button>
              </Link>
              <Link to="/gallery">
                <Button 
                  variant="outline"
                  size="lg"
                  className="gap-3 group backdrop-blur-md bg-white/5 hover:bg-white/10 border-2 border-purple-400/30 hover:border-purple-400/50 px-8 py-6 text-lg text-white/90"
                >
                  <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Explore Gallery
                </Button>
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { label: "Instant", desc: "Real-time capture" },
                { label: "Private", desc: "Local only" },
                { label: "Free", desc: "Always" }
              ].map((feature, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-400/30 transition-colors">
                  <div className="font-semibold text-white/90">{feature.label}</div>
                  <div className="text-xs text-white/50 mt-1">{feature.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* Privacy note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm text-white/50 flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              Your photos never leave your device
            </motion.p>
          </motion.div>

          {/* Right Side - Animated Figure */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center h-[600px]"
          >
            {/* Cosmic glow behind figure */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.2), transparent)',
                filter: 'blur(80px)'
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Rotating galaxy ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid rgba(147, 51, 234, 0.3)',
                width: '400px',
                height: '400px',
                margin: 'auto'
              }}
              animate={{ 
                rotate: 360
              }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* Cosmic aura lines emanating */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"/>
              <defs>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(147, 51, 234, 0.7)', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(236, 72, 153, 0.5)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0.3)', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Vertical cosmic energwith cosmic glow */}
            <svg className="relative z-10" width="300" height="500" viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(168, 85, 247, 0.8)' }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(236, 72, 153, 0.7)' }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(147, 51, 234, 0.6)' }} />
                </linearGradient>
                <filter id="figureGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Body */}
              <motion.path
                d="M 150 80 Q 130 100, 120 150 L 110 250 Q 105 280, 100 300"
                stroke="url(#bodyGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                filter="url(#figureGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.path
                d="M 150 80 Q 170 100, 180 150 L 190 250 Q 195 280, 200 300"
                stroke="url(#bodyGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                filter="url(#figureGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Arms */}
              <motion.path
                d="M 130 120 Q 100 140, 80 180"
                stroke="rgba(168, 85, 247, 0.7)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                filter="url(#figureGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />
              <motion.path
                d="M 170 120 Q 200 140, 220 180"
                stroke="rgba(168, 85, 247, 0.7)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                filter="url(#figureGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />

              {/* Head with cosmic glow */}
              <motion.circle
                cx="150"
                cy="60"
                r="25"
                fill="rgba(147, 51, 234, 0.3)"
                stroke="rgba(168, 85, 247, 0.9)"
                strokeWidth="2"
                filter="url(#figureGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />

              {/* Left Leg - Animated */}
              <motion.g>
                <motion.path
                  d="M 100 300 L 90 380 Q 88 410, 85 440"
                  stroke="url(#bodyGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#figureGlow)"
                  animate={{ 
                    d: [
                      "M 100 300 L 90 380 Q 88 410, 85 440",
                      "M 100 300 L 92 380 Q 90 410, 88 440",
                      "M 100 300 L 90 380 Q 88 410, 85 440"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Foot */}
                <motion.ellipse
                  cx="85"
                  cy="445"
                  rx="15"
                  ry="8"
                  fill="rgba(147, 51, 234, 0.5)"
                  filter="url(#figureGlow)"
                  animate={{ 
                    cx: [85, 88, 85],
                    cy: [445, 445, 445]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.g>

              {/* Right Leg - Animated with different timing */}
              <motion.g>
                <motion.path
                  d="M 200 300 L 210 380 Q 212 410, 215 440"
                  stroke="url(#bodyGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#figureGlow)"
                  animate={{ 
                    d: [
                      "M 200 300 L 210 380 Q 212 410, 215 440",
                      "M 200 300 L 208 380 Q 210 410, 212 440",
                      "M 200 300 L 210 380 Q 212 410, 215 440"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
                {/* Foot */}
                <motion.ellipse
                  cx="215"
                  cy="445"
                  rx="15"
                  ry="8"
                  fill="rgba(147, 51, 234, 0.5)"
                  filter="url(#figureGlow)"
                  animate={{ 
                    cx: [215, 212, 215],
                    cy: [445, 445, 445]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.g>

              {/* Flowing cosmic hair/aura */}
              <motion.path
                d="M 125 50 Q 100 30, 90 60 Q 85 80, 100 90"
                stroke="rgba(236, 72, 153, 0.6)"
                strokeWidth="2"
                fill="none"
                filter="url(#figureGlow)"
                animate={{
                  d: [
                    "M 125 50 Q 100 30, 90 60 Q 85 80, 100 90",
                    "M 125 50 Q 95 35, 85 60 Q 80 85, 95 95",
                    "M 125 50 Q 100 30, 90 60 Q 85 80, 100 90"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 175 50 Q 200 30, 210 60 Q 215 80, 200 90"
                stroke="rgba(147, 51, 234, 0.6)"
                strokeWidth="2"
                fill="none"
                filter="url(#figureGlow)"
                animate={{
                  d: [
                    "M 175 50 Q 200 30, 210 60 Q 215 80, 200 90",
                    "M 175 50 Q 205 35, 215 60 Q 220 85, 205 95",
                    "M 175 50 Q 200 30, 210 60 Q 215 80, 200 90"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </svg>

            {/* Floating cosmic sparkles around figure */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 80}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0.3, 1.2, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: ['#a855f7', '#ec4899', '#3b82f6'][i % 3],
                    boxShadow: `0 0 10px 2px ${['#a855f7', '#ec4899', '#3b82f6'][i % 3]}40`
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/40"
        >
          Powered by cosmic chakra energy ✨
        </motion.p>
      </footer>
    </div>
  );
};

export default Index;
