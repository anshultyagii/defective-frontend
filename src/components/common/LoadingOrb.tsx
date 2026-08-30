import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '#/lib/utils';

export interface LoadingOrbProps {
  size?: number;
  label?: string;
  className?: string;
}

export const LoadingOrb: React.FC<LoadingOrbProps> = ({
  size = 48,
  label,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)} role="status" aria-label={label || "Loading"}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Core */}
        <motion.div
          className="absolute rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          style={{ width: size * 0.3, height: size * 0.3 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full border border-cyan-500/50"
          style={{ width: size * 0.6, height: size * 0.6 }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full border border-cyan-500/20 border-t-cyan-400"
          style={{ width: size, height: size }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {label && (
        <div className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase animate-pulse">
          {label}
        </div>
      )}
    </div>
  );
};
