import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '#/components/common/GlassCard';

interface ComponentHealthCardProps {
  healthy: number;
  atRisk: number;
  critical: number;
}

export const ComponentHealthCard: React.FC<ComponentHealthCardProps> = ({ healthy, atRisk, critical }) => {
  const total = healthy + atRisk + critical;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const healthyPct = total > 0 ? (healthy / total) * 100 : 0;
  const atRiskPct = total > 0 ? (atRisk / total) * 100 : 0;
  const criticalPct = total > 0 ? (critical / total) * 100 : 0;

  return (
    <GlassCard className="p-6 h-full flex flex-col justify-center">
      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">Component Health Distribution</h3>
      
      <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
        <motion.div 
          className="h-full bg-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: mounted ? `${healthyPct}%` : '0%' }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
        />
        <motion.div 
          className="h-full bg-amber-500"
          initial={{ width: '0%' }}
          animate={{ width: mounted ? `${atRiskPct}%` : '0%' }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        />
        <motion.div 
          className="h-full bg-red-500"
          initial={{ width: '0%' }}
          animate={{ width: mounted ? `${criticalPct}%` : '0%' }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      <div className="flex justify-between mt-6 gap-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-medium text-slate-300">Healthy</span>
          </div>
          <span className="text-xl font-bold font-mono text-emerald-400">{healthy}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-sm font-medium text-slate-300">At Risk</span>
          </div>
          <span className="text-xl font-bold font-mono text-amber-400">{atRisk}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span className="text-sm font-medium text-slate-300">Critical</span>
          </div>
          <span className="text-xl font-bold font-mono text-red-400">{critical}</span>
        </div>
      </div>
    </GlassCard>
  );
};
