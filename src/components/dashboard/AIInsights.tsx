import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lightbulb, ShieldAlert, ChevronDown } from 'lucide-react';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';
import type { AIInsight } from '#/types/screening';

interface AIInsightsProps {
  insights: AIInsight[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getIcon = (category: AIInsight['category'], severity: string) => {
    if (category === 'recommendation') return <Lightbulb className="w-5 h-5 text-cyan-400" />;
    if (category === 'warning' || severity === 'critical') return <ShieldAlert className="w-5 h-5 text-red-400" />;
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'elevated':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  const findings = insights.filter(i => i.category === 'finding' || i.category === 'warning');
  const recommendations = insights.filter(i => i.category === 'recommendation');

  const renderInsightList = (list: AIInsight[]) => {
    return list.map((insight) => (
      <div
        key={insight.id}
        className="mb-3 overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
      >
        <button
          onClick={() => toggleExpand(insight.id)}
          className="w-full text-left px-4 py-3 flex items-start gap-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-lg"
          aria-expanded={expandedId === insight.id}
        >
          <div className="mt-0.5 flex-shrink-0">
            {getIcon(insight.category, insight.severity)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-slate-200 text-sm">{insight.title}</h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityStyles(insight.severity)}`}>
                  {insight.severity}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedId === insight.id ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>
        </button>
        <AnimatePresence>
          {expandedId === insight.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 pt-1 ml-8 text-sm text-slate-300">
                <p className="mb-3 leading-relaxed">{insight.description}</p>
                {insight.relatedComponents && insight.relatedComponents.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Related Components</span>
                    <div className="flex flex-wrap gap-2">
                      {insight.relatedComponents.map((compId: string) => (
                        <span key={compId} className="text-xs font-mono px-2 py-1 bg-slate-900/50 rounded border border-white/10 text-cyan-300">
                          {compId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  return (
    <GlassCard className="p-6" hoverable={false}>
      <SectionHeading title="AI Engineering Report" />

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
            Key Findings
          </h3>
          {renderInsightList(findings)}
        </div>

        {recommendations.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Recommended Actions
            </h3>
            {renderInsightList(recommendations)}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
