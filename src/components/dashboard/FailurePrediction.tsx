import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';
import { ComponentResult } from '#/types/screening';

interface FailurePredictionProps {
  components: ComponentResult[];
}

export const FailurePrediction: React.FC<FailurePredictionProps> = ({ components }) => {
  // Group into probability buckets (0-10, 10-20, etc.)
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${(i + 1) * 10}%`,
    count: 0,
    minProb: i * 0.1,
    maxProb: (i + 1) * 0.1
  }));

  components.forEach(comp => {
    // Assuming riskScore is between 0 and 1, mapping to probability
    const prob = comp.riskScore;
    const bucketIndex = Math.min(Math.floor(prob * 10), 9);
    if (buckets[bucketIndex]) {
      buckets[bucketIndex].count += 1;
    }
  });

  const getBarColor = (minProb: number) => {
    if (minProb >= 0.7) return '#ef4444'; // High risk (red)
    if (minProb >= 0.4) return '#f59e0b'; // Medium risk (amber)
    return '#10b981'; // Low risk (green)
  };

  return (
    <GlassCard>
      <SectionHeading title="FAILURE PROBABILITY DISTRIBUTION" />
      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={{ stroke: '#1e293b' }}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
              contentStyle={{
                backgroundColor: 'rgba(11, 17, 32, 0.9)',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
              }}
              formatter={(value: any) => [value, 'Components']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {buckets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.minProb)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
