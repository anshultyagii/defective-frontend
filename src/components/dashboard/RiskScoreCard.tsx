import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiskLevel } from '#/types/screening';
import { GlassCard } from '#/components/common/GlassCard';
import { AnimatedNumber } from '#/components/common/AnimatedNumber';

interface RiskScoreCardProps {
  score: number;
  level: RiskLevel;
  confidence: number;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ score, level, confidence }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getColor = (s: number) => {
    if (s < 30) return '#10b981'; // green
    if (s < 60) return '#f59e0b'; // yellow
    if (s < 80) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const color = getColor(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Arc represents 75% of a circle (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  return (
    <GlassCard className="flex flex-col items-center justify-center p-6 h-full">
      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6 w-full text-center">OVERALL SCREENING RISK</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform rotate-135" viewBox="0 0 140 140">
          {/* Background Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            className="transform rotate-90 origin-center"
          />
          {/* Foreground Arc */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: mounted ? strokeDashoffset : arcLength }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="transform rotate-90 origin-center"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-5xl font-bold font-mono tracking-tighter" style={{ color }}>
            <AnimatedNumber value={score} />
          </span>
          <span className="text-slate-500 text-sm mt-1">/ 100</span>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold tracking-wide uppercase mb-1" style={{ color }}>
          {level}
        </div>
        <div className="text-sm text-slate-400">
          Model confidence: <span className="text-slate-200 font-mono">{(confidence < 1 ? confidence * 100 : confidence).toFixed(1)}%</span>
        </div>
      </div>
    </GlassCard>
  );
};
