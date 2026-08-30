import React from 'react';
import { motion } from 'framer-motion';
import type { DataFormat } from '#/types/screening';

export interface DataFormatSelectorProps {
  selected: DataFormat;
  onSelect: (format: DataFormat) => void;
}

const formatOptions: { value: DataFormat; label: string }[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'sensor-stream', label: 'Sensor Stream' },
  { value: 'manual', label: 'Manual Parameters' },
];

export const DataFormatSelector: React.FC<DataFormatSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {formatOptions.map(({ value, label }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isSelected
                ? 'text-white border-cyan-500/50'
                : 'text-slate-400 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-200'
            } border backdrop-blur-sm`}
          >
            {isSelected && (
              <motion.div
                layoutId="format-indicator"
                className="absolute inset-0 rounded-full bg-cyan-900/40 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
