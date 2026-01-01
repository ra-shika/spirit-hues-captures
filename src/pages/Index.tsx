import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FFC0CB]">
      {/* SEO */}
      <title>Aura Photography - Discover Your Energy</title>
      <meta name="description" content="Capture your aura and discover your chakra energy with our mystical photo experience. Free, instant, and beautiful." />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl font-light text-white tracking-widest"
        >
          want to see your aura?
        </motion.h1>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center px-6 sm:px-12">
        {/* Left Side Content */}
        <div className="max-w-md">
          {/* Description Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="border-2 border-pink-300 bg-white/10 p-6 mb-6"
          >
            <p className="text-white text-xl sm:text-2xl leading-relaxed">
              discover the colors of your energy.
            </p>
            <p className="text-white text-xl sm:text-2xl leading-relaxed mt-4">
              capture your aura and reveal your inner light.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <Link to="/capture">
              <button className="border-2 border-pink-300 bg-white/10 px-8 py-3 text-white text-lg sm:text-xl rounded-full hover:bg-white/20 transition-colors">
                • capture your aura
              </button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Right Side - Curtain and Seated Girl */}
      <div className="absolute bottom-0 right-0 w-[60%] sm:w-[50%] h-full pointer-events-none">
        {/* Curtain */}
        <svg
          viewBox="0 0 300 500"
          className="absolute top-0 right-0 w-full h-[75%]"
          preserveAspectRatio="xMaxYMin slice"
        >
          {/* Curtain rod */}
          <rect x="20" y="10" width="280" height="10" fill="none" stroke="#F9A8D4" strokeWidth="2" />
          
          {/* Curtain panels with flowing curves */}
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d={`M${30 + i * 35} 20 
                  Q${30 + i * 35 + 10} 100, ${30 + i * 35 - 5} 180
                  Q${30 + i * 35 + 15} 260, ${30 + i * 35} 340
                  Q${30 + i * 35 + 8} 400, ${30 + i * 35 - 3} 450`}
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
          ))}
          
          {/* Curtain outline */}
          <path
            d="M20 20 Q20 250, 25 450 L275 450 Q280 250, 280 20"
            fill="none"
            stroke="#F9A8D4"
            strokeWidth="2"
          />
        </svg>

        {/* Seated Girl Illustration */}
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-[60%]"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ transformOrigin: "top center" }}
        >
          <svg viewBox="0 0 200 280" className="w-full">
            {/* Head */}
            <ellipse cx="100" cy="30" rx="20" ry="25" fill="none" stroke="#F9A8D4" strokeWidth="2.5" />
            
            {/* Hair */}
            <path
              d="M80 25 Q75 10, 90 5 Q100 0, 110 5 Q125 10, 120 25"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            <path
              d="M78 30 Q70 40, 72 55"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            <path
              d="M122 30 Q130 40, 128 55"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            
            {/* Neck */}
            <path
              d="M93 52 L93 65 M107 52 L107 65"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            
            {/* Shoulders and torso */}
            <path
              d="M60 75 Q80 65, 100 68 Q120 65, 140 75"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2.5"
            />
            <path
              d="M70 75 Q75 110, 80 140"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2.5"
            />
            <path
              d="M130 75 Q125 110, 120 140"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2.5"
            />
            
            {/* Left arm */}
            <path
              d="M60 75 Q45 95, 50 120 Q52 135, 60 145"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            
            {/* Right arm */}
            <path
              d="M140 75 Q155 95, 150 120 Q148 135, 140 145"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            
            {/* Waist/hip area */}
            <path
              d="M80 140 Q100 150, 120 140"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            
            {/* Crossed legs */}
            {/* Left leg (behind) */}
            <path
              d="M85 145 Q75 170, 80 200 Q82 220, 75 245"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2.5"
            />
            
            {/* Right leg (front, crossed over) */}
            <path
              d="M115 145 Q130 165, 125 185 Q115 210, 130 240"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2.5"
            />
            
            {/* Left high heel */}
            <path
              d="M75 245 L65 250 L60 255 L55 265 L70 265 L72 260 Q80 258, 85 250 L80 245"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            {/* Left heel */}
            <path
              d="M58 265 L60 275 L65 275 L63 265"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="1.5"
            />
            
            {/* Right high heel */}
            <path
              d="M130 240 L140 245 L145 250 L150 260 L135 260 L133 255 Q125 253, 120 245 L125 240"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="2"
            />
            {/* Right heel */}
            <path
              d="M147 260 L145 270 L140 270 L142 260"
              fill="none"
              stroke="#F9A8D4"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Checkered Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] overflow-hidden">
        <svg
          viewBox="0 0 400 80"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Checkered pattern */}
          {[...Array(4)].map((_, row) =>
            [...Array(10)].map((_, col) => {
              const isEven = (row + col) % 2 === 0;
              const x = col * 40;
              const y = row * 20;
              
              return isEven ? (
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={40}
                  height={20}
                  fill="rgba(249, 168, 212, 0.35)"
                />
              ) : null;
            })
          )}
          
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 20}
              x2="400"
              y2={i * 20}
              stroke="rgba(249, 168, 212, 0.25)"
              strokeWidth="1"
            />
          ))}
          {[...Array(11)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 40}
              y1="0"
              x2={i * 40}
              y2="80"
              stroke="rgba(249, 168, 212, 0.25)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Index;
