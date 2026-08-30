import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FileDown, Plus, Clock, Database, Cpu, Shield } from 'lucide-react';
import type { AnalysisSummary } from '#/types/screening';
import { GlassCard } from '#/components/common/GlassCard';
import { StatusBadge } from '#/components/common/StatusBadge';

interface DashboardHeaderProps {
  analysis: AnalysisSummary;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ analysis }) => {
  const navigate = useNavigate();

  return (
    <GlassCard className="overflow-hidden p-0" hoverable={false}>
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-wider uppercase">
              Screening Intelligence
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 flex items-center">
            Mission: <span className="text-cyan-400 ml-2 font-mono">{analysis.missionId}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="healthy" size="md" showDot />
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700">
            <FileDown size={16} />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => navigate({ to: '/upload' })}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Plus size={16} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border-t border-white/5 px-5 py-3 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-slate-500" />
          <span>Records: <span className="text-slate-300">{analysis.dataset.totalRecords.toLocaleString()}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-slate-500" />
          <span>Components: <span className="text-slate-300">{analysis.risk.totalComponents.toLocaleString()}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-slate-500" />
          <span>Model: <span className="text-slate-300">{analysis.modelVersion}</span></span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Clock size={14} className="text-slate-500" />
          <span>{new Date(analysis.completedAt).toLocaleString()}</span>
        </div>
      </div>
    </GlassCard>
  );
};
