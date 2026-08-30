import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';
import { StatusBadge } from '#/components/common/StatusBadge';
import { Anomaly } from '#/types/screening';

interface AnomalyTimelineProps {
  anomalies: Anomaly[];
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({ anomalies }) => {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <GlassCard>
      <SectionHeading title="ANOMALY TIMELINE" />
      <div className="mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative border-l border-slate-700/50 ml-3 space-y-6 pb-4"
        >
          {anomalies.map((anomaly, index) => (
            <motion.div key={anomaly.id || index} variants={item} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 bg-slate-900 border border-slate-700 rounded-full p-1">
                {getIcon(anomaly.severity)}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-mono text-sm font-semibold">{anomaly.componentId}</span>
                  <span className="text-slate-500 text-xs font-mono">{new Date(Date.now() - (anomalies.length - index) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge
                    status={anomaly.severity}
                    size="sm"
                  />
                  <span className="text-slate-400 text-xs px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700/50">
                    {anomaly.parameter}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-2">{anomaly.parameter} value {anomaly.value} exceeded threshold {anomaly.threshold} (score: {anomaly.score.toFixed(2)})</p>
              </div>
            </motion.div>
          ))}
          {anomalies.length === 0 && (
            <div className="pl-6 text-slate-400 text-sm italic">No anomalies detected during this screening window.</div>
          )}
        </motion.div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </GlassCard>
  );
};
