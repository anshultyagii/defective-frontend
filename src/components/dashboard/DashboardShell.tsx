import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { AnalysisSummary } from '#/types/screening';

interface DashboardShellProps {
  children: ReactNode;
  analysis: AnalysisSummary;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen text-slate-50 relative overflow-hidden font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
