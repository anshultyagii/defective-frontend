import React from 'react';
import { motion } from 'framer-motion';

export interface UploadActionsProps {
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  isPrimaryDisabled?: boolean;
  isLoading?: boolean;
}

export const UploadActions: React.FC<UploadActionsProps> = ({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  isPrimaryDisabled = false,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-row items-center justify-end gap-4 mt-6">
      {secondaryLabel && onSecondary && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSecondary}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg font-medium text-slate-300 border border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {secondaryLabel}
        </motion.button>
      )}
      <motion.button
        whileHover={!isPrimaryDisabled && !isLoading ? { scale: 1.02, boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)' } : {}}
        whileTap={!isPrimaryDisabled && !isLoading ? { scale: 0.98 } : {}}
        onClick={onPrimary}
        disabled={isPrimaryDisabled || isLoading}
        className={`relative px-6 py-2 rounded-lg font-bold overflow-hidden transition-all flex items-center justify-center min-w-[120px] ${
          isPrimaryDisabled || isLoading
            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600/50'
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-500/50'
        }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          primaryLabel
        )}
      </motion.button>
    </div>
  );
};
