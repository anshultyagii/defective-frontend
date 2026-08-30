import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { GlassCard } from '#/components/common/GlassCard';
import { SectionHeading } from '#/components/common/SectionHeading';

interface TrendData {
  timestamp: string;
  temperature: number;
  voltage: number;
  current: number;
  leakageCurrent: number;
  resistance: number;
}

interface ParameterTrendsProps {
  data: TrendData[];
}

type ParameterType = 'temperature' | 'voltage' | 'current' | 'leakageCurrent' | 'resistance';

const PARAMETERS: { id: ParameterType; label: string; color: string; threshold: number }[] = [
  { id: 'temperature', label: 'Temperature (°C)', color: '#06b6d4', threshold: 125 },
  { id: 'voltage', label: 'Voltage (V)', color: '#8b5cf6', threshold: 5.5 },
  { id: 'current', label: 'Current (A)', color: '#ec4899', threshold: 2.0 },
  { id: 'leakageCurrent', label: 'Leakage (µA)', color: '#f59e0b', threshold: 50 },
  { id: 'resistance', label: 'Resistance (Ω)', color: '#10b981', threshold: 0.15 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b1120]/90 border border-slate-700/50 backdrop-blur-md p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-mono text-xs mb-2 border-b border-slate-700 pb-1">{label}</p>
        <div className="space-y-1 text-xs">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="text-slate-200 font-mono">{entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ParameterTrends: React.FC<ParameterTrendsProps> = ({ data }) => {
  const [selectedParam, setSelectedParam] = useState<ParameterType>('temperature');

  return (
    <GlassCard>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SectionHeading title="PARAMETER TREND ANALYSIS" />
        <div className="flex flex-wrap gap-2">
          {PARAMETERS.map((param) => (
            <button
              key={param.id}
              onClick={() => setSelectedParam(param.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedParam === param.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              {param.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timestamp"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={{ stroke: '#1e293b' }}
              minTickGap={30}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {PARAMETERS.map((param) => {
              const isSelected = selectedParam === param.id;
              return (
                <Line
                  key={param.id}
                  type="monotone"
                  dataKey={param.id}
                  name={param.label}
                  stroke={param.color}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 1 : 0.2}
                  dot={false}
                  activeDot={isSelected ? { r: 4, strokeWidth: 0 } : false}
                />
              );
            })}
            
            {PARAMETERS.map((param) => (
               selectedParam === param.id && (
                <ReferenceLine 
                  key={`ref-${param.id}`}
                  y={param.threshold} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  label={{ position: 'insideTopLeft', value: 'Threshold', fill: '#ef4444', fontSize: 10 }} 
                />
               )
            ))}

            <Brush 
              dataKey="timestamp" 
              height={20} 
              stroke="#475569" 
              fill="#0f172a"
              tickFormatter={() => ''}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
