import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';
import { Anomaly, ComponentResult } from '#/types/screening';

interface AnomalySummaryProps {
  anomalies: Anomaly[];
  components: ComponentResult[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b1120]/90 border border-slate-700/50 backdrop-blur-md p-3 rounded-lg shadow-xl">
        <p className="text-cyan-400 font-mono text-sm font-semibold mb-1">{data.componentId}</p>
        <div className="space-y-1 text-xs">
          <p className="text-slate-300">
            <span className="text-slate-400">Score:</span> {data.score.toFixed(3)}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Risk:</span>{' '}
            <span
              className={
                data.severity === 'high'
                  ? 'text-red-400'
                  : data.severity === 'medium'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }
            >
              {data.severity.toUpperCase()}
            </span>
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Parameter:</span> {data.parameter}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const AnomalySummary: React.FC<AnomalySummaryProps> = ({ anomalies, components }) => {
  const chartData = anomalies.map((anomaly, index) => {
    return {
      index: index + 1,
      componentId: anomaly.componentId,
      score: anomaly.score,
      severity: anomaly.severity,
      parameter: anomaly.parameter,
    };
  });

  const getColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#06b6d4';
    }
  };

  return (
    <GlassCard>
      <SectionHeading title="ANOMALY DETECTION" />
      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="index"
              name="Index"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Anomaly Score"
              domain={[0, 1]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
            <ReferenceLine y={0.7} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'High Risk Threshold', fill: '#ef4444', fontSize: 10 }} />
            <Scatter name="Anomalies" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.severity)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
