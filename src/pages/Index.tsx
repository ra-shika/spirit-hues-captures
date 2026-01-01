import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[hsl(var(--home-bg))]">
      {/* SEO */}
      <title>Aura Photography - Discover Your Energy</title>
      <meta name="description" content="Capture your aura and discover your chakra energy with our mystical photo experience. Free, instant, and beautiful." />
      
      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-0">
        {/* Header Text */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-2xl sm:text-3xl font-medium text-[hsl(var(--home-accent))] mb-8 tracking-tight"
        >
          want to see your aura?
        </motion.h1>

        {/* Description Box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="border-2 border-[hsl(var(--home-accent))] p-4 max-w-[200px] mb-6"
        >
          <p className="text-[hsl(var(--home-accent))] text-sm leading-relaxed">
            discover the colors of your energy.
            <br /><br />
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
            <button className="border-2 border-[hsl(var(--home-accent))] px-4 py-2 text-[hsl(var(--home-accent))] text-sm hover:bg-[hsl(var(--home-accent))] hover:text-[hsl(var(--home-bg))] transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--home-accent))]" />
              capture your aura
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Photobooth Illustration */}
      <div className="absolute bottom-0 right-0 w-[65%] sm:w-[55%] h-[60%] pointer-events-none">
        {/* Curtain */}
        <svg
          viewBox="0 0 200 300"
          className="absolute top-0 right-0 w-full h-[70%]"
          preserveAspectRatio="xMaxYMin slice"
        >
          {/* Curtain rod */}
          <rect x="20" y="0" width="180" height="8" fill="none" stroke="hsl(var(--home-accent))" strokeWidth="2" />
          
          {/* Curtain folds */}
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M${30 + i * 14} 8 Q${30 + i * 14 + 7} 150, ${30 + i * 14} 250`}
              fill="none"
              stroke="hsl(var(--home-accent))"
              strokeWidth="1.5"
            />
          ))}
          
          {/* Curtain outline */}
          <path
            d="M20 8 L20 250 Q100 260, 180 250 L180 8"
            fill="none"
            stroke="hsl(var(--home-accent))"
            strokeWidth="2"
          />
        </svg>

        {/* Swinging Legs */}
        <motion.div
          className="absolute bottom-[15%] right-[15%] w-[40%] origin-top"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <svg viewBox="0 0 100 120" className="w-full">
            {/* Left leg */}
            <path
              d="M25 0 L20 60 L15 90 L25 95 L30 85 L35 60 L30 0"
              fill="hsl(var(--home-accent) / 0.3)"
              stroke="hsl(var(--home-accent))"
              strokeWidth="1.5"
            />
            {/* Left boot */}
            <path
              d="M15 90 L10 110 L5 115 L30 115 L25 95"
              fill="hsl(var(--home-accent) / 0.3)"
              stroke="hsl(var(--home-accent))"
              strokeWidth="1.5"
            />
            {/* Boot heel left */}
            <rect x="8" y="115" width="8" height="5" fill="hsl(var(--home-accent) / 0.3)" stroke="hsl(var(--home-accent))" strokeWidth="1" />
            
            {/* Right leg */}
            <path
              d="M55 0 L50 55 L48 85 L58 90 L65 80 L70 55 L65 0"
              fill="hsl(var(--home-accent) / 0.3)"
              stroke="hsl(var(--home-accent))"
              strokeWidth="1.5"
            />
            {/* Right boot */}
            <path
              d="M48 85 L45 105 L40 110 L70 110 L58 90"
              fill="hsl(var(--home-accent) / 0.3)"
              stroke="hsl(var(--home-accent))"
              strokeWidth="1.5"
            />
            {/* Boot heel right */}
            <rect x="42" y="110" width="8" height="5" fill="hsl(var(--home-accent) / 0.3)" stroke="hsl(var(--home-accent))" strokeWidth="1" />
          </svg>
        </motion.div>
      </div>

      {/* Checkered Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] overflow-hidden">
        <svg
          viewBox="0 0 400 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Perspective checkered pattern */}
          {[...Array(10)].map((_, row) =>
            [...Array(16)].map((_, col) => {
              const isEven = (row + col) % 2 === 0;
              const y = 100 - (row + 1) * 10;
              const perspectiveScale = 1 + row * 0.15;
              const width = 25 * perspectiveScale;
              const xOffset = col * 25 - (row * 2);
              
              return isEven ? (
                <rect
                  key={`${row}-${col}`}
                  x={xOffset}
                  y={y}
                  width={width}
                  height={10}
                  fill="hsl(var(--home-accent) / 0.15)"
                  stroke="hsl(var(--home-accent) / 0.3)"
                  strokeWidth="0.5"
                />
              ) : null;
            })
          )}
          
          {/* Grid lines for depth */}
          {[...Array(11)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 10}
              x2="400"
              y2={i * 10}
              stroke="hsl(var(--home-accent) / 0.2)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Index;
