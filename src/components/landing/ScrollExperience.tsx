import React, { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { HeroScene } from './HeroScene';
import { HeroOverlay } from './HeroOverlay';
import { MissionIntro } from './MissionIntro';

export const ScrollExperience: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  if (reducedMotion) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
          <h1 className="text-4xl md:text-6xl font-light tracking-widest text-white mb-2 uppercase text-center">
            Intelligent
          </h1>
          <h1 className="text-4xl md:text-6xl font-light tracking-widest text-cyan-400 mb-6 uppercase text-center">
            Burn-In Analysis
          </h1>
          <h2 className="text-sm md:text-base font-light tracking-[0.3em] text-slate-300 uppercase mb-20 text-center">
            AI-Driven Component Screening
          </h2>
        </div>
        
        <div className="flex-1 flex items-start justify-center p-6">
          <div className="w-full h-full relative" style={{ opacity: 1, pointerEvents: 'auto' }}>
             <MissionIntro scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-950">
      {/* Scroll container that provides the distance */}
      <div style={{ height: '500vh' }}></div>

      {/* Fixed viewport container */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Background that fades out when scene ends */}
        <div 
          className="absolute inset-0 bg-slate-950 transition-opacity duration-1000"
          style={{ opacity: progress > 0.8 ? 1 : 0, zIndex: 15, pointerEvents: 'none' }}
        />
        
        {/* 3D Scene */}
        <HeroScene scrollProgress={progress} />
        
        {/* Overlay content */}
        <HeroOverlay scrollYProgress={scrollYProgress} />
        
        {/* Transition content */}
        <MissionIntro scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
};
