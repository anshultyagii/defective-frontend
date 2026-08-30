import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '#/components/common/GlassCard';
import { LoadingOrb } from '#/components/common/LoadingOrb';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { AnalysisStep } from '#/types/screening';

export interface AnalysisProgressProps {
  steps: AnalysisStep[];
  currentStep: number;
  onComplete: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps, currentStep, onComplete }) => {
  const isComplete = currentStep >= steps.length;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <GlassCard className="overflow-hidden relative" hoverable={false}>
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(currentStep, steps.length) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-6 md:p-8 flex flex-col items-center">
        {/* Header with loading orb */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <LoadingOrb size={isComplete ? 64 : 56} label={isComplete ? "Complete" : undefined} />
          </div>
          <h3 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">
            {isComplete ? 'Analysis Complete' : 'Initializing Analysis'}
          </h3>
          <p className="text-cyan-400/80 font-mono text-sm mt-2">
            {isComplete ? 'SYSTEM READY — REDIRECTING TO DASHBOARD' : 'PROCESSING UPLOADED DATASET'}
          </p>
        </div>

        {/* Steps list */}
        <div className="w-full max-w-lg space-y-4">
          <AnimatePresence>
            {steps.map((step, index) => {
              const status = index < currentStep ? 'complete' : index === currentStep ? 'running' : 'pending';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                    status === 'complete' ? 'bg-green-950/20 border-green-900/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                    status === 'running' ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' :
                    'bg-slate-900/30 border-slate-800'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {status === 'complete' ? (
                      <CheckCircle2 size={24} className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    ) : status === 'running' ? (
                      <Loader2 size={24} className="text-cyan-400 animate-spin" />
                    ) : (
                      <Circle size={24} className="text-slate-600" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <h4 className={`text-sm font-bold tracking-wide ${
                      status === 'complete' ? 'text-green-100' :
                      status === 'running' ? 'text-cyan-100' :
                      'text-slate-500'
                    }`}>
                      {step.label}
                    </h4>
                  </div>

                  {status === 'running' && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
};
