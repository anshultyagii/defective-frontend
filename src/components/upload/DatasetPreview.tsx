import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '#/components/common/GlassCard';
import { AnimatedNumber } from '#/components/common/AnimatedNumber';
import { Database, FileText, Activity, AlertTriangle } from 'lucide-react';

export interface DatasetMetadata {
  totalRecords: number;
  totalComponents: number;
  parameterCount: number;
  dataQuality: number;
  columns: string[];
  warnings?: string[];
}

export interface DatasetPreviewProps {
  metadata: DatasetMetadata;
  onProceed: () => void;
  onCancel: () => void;
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ metadata, onProceed, onCancel }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <GlassCard className="mt-8 border-cyan-500/20 relative overflow-hidden" hoverable={false}>
      <div className="absolute top-0 right-0 p-30 opacity-5 pointer-events-none">
        <Database size={200} />
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-2"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-wider text-slate-100">DATASET DETECTED</h3>
            <p className="text-sm text-cyan-400/80 font-mono">INTEGRITY CHECK COMPLETE</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Records</span>
            <div className="text-3xl font-light text-white font-mono">
              <AnimatedNumber value={metadata.totalRecords} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Components</span>
            <div className="text-3xl font-light text-cyan-400 font-mono">
              <AnimatedNumber value={metadata.totalComponents} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Parameters</span>
            <div className="text-3xl font-light text-blue-400 font-mono">
              <AnimatedNumber value={metadata.parameterCount} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent" />
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Data Quality</span>
            <div className="text-3xl font-light text-green-400 font-mono flex items-center">
              <AnimatedNumber value={metadata.dataQuality} />
              <span className="text-xl ml-1">%</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className="flex flex-col">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-cyan-500" /> Detected Columns
            </h4>
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-2">
                {metadata.columns.map((col, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded font-mono border border-slate-700">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {metadata.warnings && metadata.warnings.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Warnings
              </h4>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {metadata.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-amber-200/70">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate-800">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={onProceed} className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
            Begin Analysis
          </button>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
};
