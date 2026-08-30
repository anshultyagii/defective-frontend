import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';

interface ThermalData {
  time: number;
  temperature: number;
}

interface ThermalProfileProps {
  data: ThermalData[];
}

export const ThermalProfile: React.FC<ThermalProfileProps> = ({ data }) => {
  return (
    <GlassCard>
      <SectionHeading title="THERMAL STRESS PROFILE" />
      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
              tickFormatter={(value) => `${value}h`}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(11, 17, 32, 0.9)',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
              }}
              itemStyle={{ color: '#06b6d4' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
              labelFormatter={(label) => `Time: ${label}h`}
            />
            <ReferenceLine y={125} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Max Operating (125°C)', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={-40} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Min Operating (-40°C)', fill: '#3b82f6', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
