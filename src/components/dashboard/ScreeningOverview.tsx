import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, AlertTriangle, AlertOctagon, Activity } from 'lucide-react';
import { RiskAssessment } from '#/types/screening';
import { GlassCard } from '#/components/common/GlassCard';
import { AnimatedNumber } from '#/components/common/AnimatedNumber';

interface ScreeningOverviewProps {
  risk: RiskAssessment;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const ScreeningOverview: React.FC<ScreeningOverviewProps> = ({ risk }) => {
  const cards = [
    {
      label: 'COMPONENTS ANALYZED',
      value: risk.totalComponents,
      icon: <Cpu className="w-12 h-12 text-blue-500/10 absolute -bottom-2 -right-2" />,
      accentColor: 'border-l-blue-500',
      valueColor: 'text-slate-100'
    },
    {
      label: 'HEALTHY',
      value: risk.healthy,
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-500/10 absolute -bottom-2 -right-2" />,
      accentColor: 'border-l-emerald-500',
      valueColor: 'text-emerald-400'
    },
    {
      label: 'AT RISK',
      value: risk.atRisk,
      icon: <AlertTriangle className="w-12 h-12 text-amber-500/10 absolute -bottom-2 -right-2" />,
      accentColor: 'border-l-amber-500',
      valueColor: 'text-amber-400'
    },
    {
      label: 'CRITICAL',
      value: risk.critical,
      icon: <AlertOctagon className="w-12 h-12 text-red-500/10 absolute -bottom-2 -right-2" />,
      accentColor: 'border-l-red-500',
      valueColor: 'text-red-400'
    },
    {
      label: 'ANOMALIES',
      value: risk.totalAnomalies,
      icon: <Activity className="w-12 h-12 text-orange-500/10 absolute -bottom-2 -right-2" />,
      accentColor: 'border-l-orange-500',
      valueColor: 'text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div key={index} variants={itemVariants}>
          <GlassCard className={`p-4 h-full relative overflow-hidden border-l-2 ${card.accentColor}`}>
            <div className="relative z-10">
              <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">{card.label}</h3>
              <div className={`text-3xl font-bold ${card.valueColor} font-mono`}>
                <AnimatedNumber value={card.value} />
              </div>
            </div>
            {card.icon}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};
