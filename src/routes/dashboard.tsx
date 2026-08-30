import { createFileRoute } from '@tanstack/react-router'
import { useState, lazy, Suspense } from 'react'
import { generateMockAnalysis } from '#/lib/mockData'
import type { AnalysisSummary, ComponentResult } from '#/types/screening'

const DashboardShell = lazy(() =>
  import('#/components/dashboard/DashboardShell').then(m => ({ default: m.DashboardShell }))
)
const DashboardHeader = lazy(() =>
  import('#/components/dashboard/DashboardHeader').then(m => ({ default: m.DashboardHeader }))
)
const ScreeningOverview = lazy(() =>
  import('#/components/dashboard/ScreeningOverview').then(m => ({ default: m.ScreeningOverview }))
)
const RiskScoreCard = lazy(() =>
  import('#/components/dashboard/RiskScoreCard').then(m => ({ default: m.RiskScoreCard }))
)
const ComponentHealthCard = lazy(() =>
  import('#/components/dashboard/ComponentHealthCard').then(m => ({ default: m.ComponentHealthCard }))
)
const AnomalySummary = lazy(() =>
  import('#/components/dashboard/AnomalySummary').then(m => ({ default: m.AnomalySummary }))
)
const ParameterTrends = lazy(() =>
  import('#/components/dashboard/ParameterTrends').then(m => ({ default: m.ParameterTrends }))
)
const ThermalProfile = lazy(() =>
  import('#/components/dashboard/ThermalProfile').then(m => ({ default: m.ThermalProfile }))
)
const AnomalyTimeline = lazy(() =>
  import('#/components/dashboard/AnomalyTimeline').then(m => ({ default: m.AnomalyTimeline }))
)
const FailurePrediction = lazy(() =>
  import('#/components/dashboard/FailurePrediction').then(m => ({ default: m.FailurePrediction }))
)
const ComponentTable = lazy(() =>
  import('#/components/dashboard/ComponentTable').then(m => ({ default: m.ComponentTable }))
)
const ComponentDetail = lazy(() =>
  import('#/components/dashboard/ComponentDetail').then(m => ({ default: m.ComponentDetail }))
)
const AIInsights = lazy(() =>
  import('#/components/dashboard/AIInsights').then(m => ({ default: m.AIInsights }))
)
const AIChatPanel = lazy(() =>
  import('#/components/chat/AIChatPanel').then(m => ({ default: m.AIChatPanel }))
)

export const Route = createFileRoute('/dashboard')({
  loader: () => {
    const analysis = generateMockAnalysis()
    return { analysis }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { analysis } = Route.useLoaderData()
  const [selectedComponent, setSelectedComponent] = useState<ComponentResult | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const trendData = generateParameterTrendData()
  const thermalData = trendData.map(d => ({ time: parseFloat(d.timestamp), temperature: d.temperature }))

  return (
    <div className="min-h-screen bg-[#020617] relative">
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-pattern-fine opacity-30 pointer-events-none" />

      {/* Atmospheric gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-cyan-500/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-blue-500/3 rounded-full blur-[120px]" />
      </div>

      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 uppercase tracking-widest">Loading Intelligence Dashboard</p>
            </div>
          </div>
        }
      >
        <DashboardShell analysis={analysis}>
          <DashboardHeader analysis={analysis} />

          {/* KPI Overview */}
          <section className="mt-8">
            <ScreeningOverview risk={analysis.risk} />
          </section>

          {/* Risk Score + Component Health */}
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RiskScoreCard
                score={analysis.risk.overallScore}
                level={analysis.risk.level}
                confidence={analysis.risk.modelConfidence}
              />
            </div>
            <div className="lg:col-span-1">
              <ComponentHealthCard
                healthy={analysis.risk.healthy}
                atRisk={analysis.risk.atRisk}
                critical={analysis.risk.critical}
              />
            </div>
            <div className="lg:col-span-1">
              <FailurePrediction components={analysis.components} />
            </div>
          </section>

          {/* Charts Row */}
          <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ParameterTrends data={trendData} />
            <AnomalySummary anomalies={analysis.anomalies} components={analysis.components} />
          </section>

          {/* Thermal + Timeline */}
          <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ThermalProfile data={thermalData} />
            <AnomalyTimeline anomalies={analysis.anomalies} />
          </section>

          {/* AI Insights */}
          <section className="mt-8">
            <AIInsights insights={analysis.insights} />
          </section>

          {/* Component Table */}
          <section className="mt-8">
            <ComponentTable
              components={analysis.components}
              onSelectComponent={(id) => {
                const comp = analysis.components.find(c => c.componentId === id)
                if (comp) setSelectedComponent(comp)
              }}
            />
          </section>

          {/* Component Detail Panel */}
          <ComponentDetail
            component={selectedComponent}
            onClose={() => setSelectedComponent(null)}
          />

          {/* AI Chat Toggle */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full glass-strong flex items-center justify-center hover:glow-border-active transition-all duration-300 group"
            aria-label="Toggle AI Chat"
          >
            <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </button>

          {/* AI Chat Panel */}
          <AIChatPanel
            analysis={analysis}
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
          />
        </DashboardShell>
      </Suspense>
    </div>
  )
}

// Helper to generate parameter trend data inline
function generateParameterTrendData() {
  const data = []
  for (let i = 0; i < 200; i++) {
    const t = (i / 200) * 120
    const baseTemp = 85 + Math.sin(t * 0.1) * 15 + (Math.random() - 0.5) * 5
    const baseVoltage = 3.3 + Math.sin(t * 0.05) * 0.1 + (Math.random() - 0.5) * 0.05
    const baseCurrent = 0.5 + Math.cos(t * 0.08) * 0.05 + (Math.random() - 0.5) * 0.02
    const baseLeakage = 1.2 + (t / 120) * 0.8 + (Math.random() - 0.5) * 0.3
    const baseResistance = 100 + Math.sin(t * 0.03) * 5 + (Math.random() - 0.5) * 2

    // Add anomalous regions
    const anomalyFactor = (t > 80 && t < 95) ? 1.3 : 1
    data.push({
      timestamp: t.toFixed(1),
      temperature: parseFloat((baseTemp * anomalyFactor).toFixed(1)),
      voltage: parseFloat(baseVoltage.toFixed(3)),
      current: parseFloat(baseCurrent.toFixed(3)),
      leakageCurrent: parseFloat((baseLeakage * anomalyFactor).toFixed(2)),
      resistance: parseFloat(baseResistance.toFixed(1)),
    })
  }
  return data
}
