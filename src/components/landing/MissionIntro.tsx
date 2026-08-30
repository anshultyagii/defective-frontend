import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '#/components/common/GlassCard';
import { Upload } from 'lucide-react';

interface MissionIntroProps {
  scrollYProgress: MotionValue<number>;
}

export const MissionIntro: React.FC<MissionIntroProps> = ({ scrollYProgress }) => {
  const navigate = useNavigate();

  // Fades in when scroll is between 0.7 and 0.8
  const opacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const y = useTransform(scrollYProgress, [0.65, 0.8], [50, 0]);
  
  // Disable pointer events when invisible
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.7 ? 'auto' : 'none');

  return (
    <motion.div 
      style={{ opacity, y, pointerEvents: pointerEvents as any }}
      className="absolute inset-0 flex items-center justify-center z-20 p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-900/80 to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      <GlassCard className="max-w-2xl w-full p-10 md:p-16 flex flex-col items-center text-center relative z-10 border-cyan-900/30">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center w-full"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mb-6 border border-cyan-700/50">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light tracking-widest text-white uppercase mb-4">
            Mission Initialization
          </h2>
          
          <p className="text-slate-400 tracking-wider font-light mb-10 max-w-lg">
            Upload screening data to begin intelligent analysis. 
            Our platform evaluates component telemetry with high precision.
          </p>
          
          <button 
            onClick={() => navigate({ to: '/upload' })}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-medium tracking-widest text-white uppercase transition-all duration-300 ease-in-out bg-transparent border border-cyan-500/50 rounded-sm hover:border-cyan-400 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-cyan-400 group-hover:-translate-y-1 transition-transform duration-300" />
              Upload Data
            </span>
          </button>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};
