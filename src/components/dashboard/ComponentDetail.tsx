import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, AlertTriangle, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ComponentResult } from '#/types/screening';
import { GlassCard } from '#/components/common/GlassCard';
import { StatusBadge } from '#/components/common/StatusBadge';

interface ComponentDetailProps {
  component: ComponentResult | null;
  onClose: () => void;
}

const mockChartData = [
  { time: '0h', voltage: 4.8, temp: 42 },
  { time: '2h', voltage: 4.9, temp: 45 },
  { time: '4h', voltage: 5.1, temp: 48 },
  { time: '6h', voltage: 5.4, temp: 53 },
  { time: '8h', voltage: 5.3, temp: 58 },
  { time: '10h', voltage: 6.2, temp: 72 },
  { time: '12h', voltage: 6.8, temp: 85 }
];

export const ComponentDetail: React.FC<ComponentDetailProps> = ({ component, onClose }) => {
  return (
    <AnimatePresence>
      {component && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md p-4 shadow-2xl"
          >
            <GlassCard className="h-full flex flex-col overflow-hidden bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
              <div className="p-6 border-b border-slate-800/60 flex items-start justify-between">
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold mb-1">Component Inspection</h2>
                  <div className="text-3xl font-mono font-bold text-slate-100">{component.componentId}</div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <StatusBadge status={component.health} size="md" showDot />
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Risk Score</div>
                    <div className="font-mono text-xl font-bold text-slate-200">{component.riskScore.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 uppercase mb-1">Failure Prob</div>
                    <div className="font-mono text-xl text-red-400">{component.failureProbability.toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 uppercase mb-1">Anomaly Score</div>
                    <div className="font-mono text-xl text-orange-400">{component.anomalyScore.toFixed(2)}</div>
                  </div>
                </div>

                {component.primaryIndicator && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-300">Primary Anomaly Indicator</h4>
                      <p className="text-sm text-slate-300 mt-1 capitalize">{component.primaryIndicator.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-500" />
                    Parameter History (12h)
                  </h3>
                  <div className="h-64 w-full bg-slate-950/30 rounded-lg p-4 border border-slate-800/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={30} />
                        <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={30} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <span className="text-slate-400">Voltage (V)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-slate-400">Temp (°C)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    Component Metadata
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batch ID</span>
                      <span className="font-mono text-slate-300">B-7492-{component.componentId.substring(0, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stress Duration</span>
                      <span className="font-mono text-slate-300">{component.stressDuration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Scanned</span>
                      <span className="font-mono text-slate-300">14 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
