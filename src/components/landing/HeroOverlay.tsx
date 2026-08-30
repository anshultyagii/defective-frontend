import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroOverlayProps {
  scrollYProgress: MotionValue<number>;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollYProgress }) => {
  // Fade out early in the scroll (0 to 0.15)
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-white mb-2 uppercase">
          Intelligent
        </h1>
        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-cyan-400 mb-6 uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          Burn-In Analysis
        </h1>
        
        <h2 className="text-sm md:text-base font-light tracking-[0.3em] text-slate-300 uppercase">
          AI-Driven Component Screening
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center"
      >
        <span className="text-xs font-light tracking-widest text-slate-400 uppercase mb-4">
          Scroll to Initiate
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-cyan-400 w-6 h-6 opacity-70" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
