import type {
  ScreeningDataset,
  AnalysisSummary,
  ComponentResult,
  ParameterHistory,
  Anomaly,
  AIInsight,
  HealthStatus,
} from '#/types/screening'

const COMPONENT_PREFIXES = ['MOSFET', 'CAP', 'BJT', 'IGBT', 'DIODE', 'RES', 'IND', 'IC', 'XTAL', 'TRIAC']
const INDICATORS = ['leakageCurrent', 'temperature', 'voltage', 'current', 'resistance']

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function generateComponentId(index: number): string {
  const prefix = COMPONENT_PREFIXES[index % COMPONENT_PREFIXES.length]
  const num = 1000 + Math.floor(index * 2.7 + Math.random() * 10)
  return `${prefix}-${num}`
}

function generateMockParameterHistory(health: HealthStatus): ParameterHistory {
  const points = 7
  const timestamps = ['0h', '20h', '40h', '60h', '80h', '100h', '118h']
  const temperature: number[] = []
  const voltage: number[] = []
  const current: number[] = []
  const resistance: number[] = []
  const leakageCurrent: number[] = []

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1)
    const degradation = health === 'critical' ? 1.5 : health === 'at-risk' ? 1.15 : 1.0

    temperature.push(parseFloat((25 + 60 * t + (t > 0.6 ? (t - 0.6) * 30 * degradation : 0) + randomBetween(-2, 2)).toFixed(1)))
    voltage.push(parseFloat((3.3 - t * 0.1 * degradation + randomBetween(-0.02, 0.02)).toFixed(3)))
    current.push(parseFloat((10 + t * 2 * degradation + randomBetween(-0.5, 0.5)).toFixed(1)))
    resistance.push(parseFloat((0.1 + t * 0.05 * degradation + randomBetween(-0.01, 0.01)).toFixed(3)))
    leakageCurrent.push(parseFloat((1 + Math.pow(t * degradation, 2) * 14 + randomBetween(-0.3, 0.3)).toFixed(1)))
  }

  return { timestamps, temperature, voltage, current, resistance, leakageCurrent }
}

export function generateMockDataset(): ScreeningDataset {
  return {
    records: [],
    metadata: {
      totalRecords: 5216,
      totalComponents: 412,
      parameters: [
        'temperature', 'voltage', 'current', 'resistance', 'leakageCurrent',
        'stressDuration', 'humidity', 'vibration', 'pressure', 'power',
        'frequency', 'capacitance', 'inductance', 'threshold', 'gateCharge',
        'thermalResistance', 'dielectricStrength'
      ],
      dataQuality: 0.987,
      uploadedAt: new Date().toISOString(),
      format: 'csv'
    }
  }
}

function createComponents(): ComponentResult[] {
  const components: ComponentResult[] = []

  // Named critical components
  const criticalComponents: Partial<ComponentResult>[] = [
    { componentId: 'MOSFET-1042', riskScore: 91, anomalyScore: 0.94, failureProbability: 87, primaryIndicator: 'leakageCurrent' },
    { componentId: 'IGBT-4012', riskScore: 88, anomalyScore: 0.89, failureProbability: 82, primaryIndicator: 'resistance' },
    { componentId: 'MOSFET-1098', riskScore: 85, anomalyScore: 0.87, failureProbability: 79, primaryIndicator: 'leakageCurrent' },
    { componentId: 'BJT-3088', riskScore: 84, anomalyScore: 0.85, failureProbability: 76, primaryIndicator: 'temperature' },
    { componentId: 'IC-8032', riskScore: 82, anomalyScore: 0.83, failureProbability: 74, primaryIndicator: 'voltage' },
  ]

  for (const c of criticalComponents) {
    components.push({
      componentId: c.componentId!,
      health: 'critical',
      riskScore: c.riskScore!,
      anomalyScore: c.anomalyScore!,
      failureProbability: c.failureProbability!,
      stressDuration: 118,
      primaryIndicator: c.primaryIndicator!,
      modelConfidence: randomBetween(0.89, 0.96),
      parameters: generateMockParameterHistory('critical'),
    })
  }

  // Generate remaining critical (13 more = 18 total)
  for (let i = 0; i < 13; i++) {
    components.push({
      componentId: generateComponentId(100 + i),
      health: 'critical',
      riskScore: randomBetween(80, 95),
      anomalyScore: randomBetween(0.78, 0.96),
      failureProbability: randomBetween(70, 92),
      stressDuration: 118,
      primaryIndicator: INDICATORS[Math.floor(Math.random() * INDICATORS.length)],
      modelConfidence: randomBetween(0.85, 0.96),
      parameters: generateMockParameterHistory('critical'),
    })
  }

  // Named at-risk components
  const atRiskNamed: Partial<ComponentResult>[] = [
    { componentId: 'BJT-3044', riskScore: 65, anomalyScore: 0.72, failureProbability: 45, primaryIndicator: 'temperature' },
    { componentId: 'DIODE-5521', riskScore: 55, anomalyScore: 0.65, failureProbability: 38, primaryIndicator: 'voltage' },
    { componentId: 'CAP-2201', riskScore: 48, anomalyScore: 0.58, failureProbability: 32, primaryIndicator: 'temperature' },
    { componentId: 'RES-6015', riskScore: 52, anomalyScore: 0.61, failureProbability: 35, primaryIndicator: 'resistance' },
    { componentId: 'TRIAC-9044', riskScore: 58, anomalyScore: 0.68, failureProbability: 40, primaryIndicator: 'current' },
  ]

  for (const c of atRiskNamed) {
    components.push({
      componentId: c.componentId!,
      health: 'at-risk',
      riskScore: c.riskScore!,
      anomalyScore: c.anomalyScore!,
      failureProbability: c.failureProbability!,
      stressDuration: 118,
      primaryIndicator: c.primaryIndicator!,
      modelConfidence: randomBetween(0.82, 0.94),
      parameters: generateMockParameterHistory('at-risk'),
    })
  }

  // Generate remaining at-risk (38 more = 43 total)
  for (let i = 0; i < 38; i++) {
    components.push({
      componentId: generateComponentId(200 + i),
      health: 'at-risk',
      riskScore: randomBetween(35, 75),
      anomalyScore: randomBetween(0.4, 0.78),
      failureProbability: randomBetween(20, 55),
      stressDuration: 118,
      primaryIndicator: INDICATORS[Math.floor(Math.random() * INDICATORS.length)],
      modelConfidence: randomBetween(0.80, 0.94),
      parameters: generateMockParameterHistory('at-risk'),
    })
  }

  // Generate healthy components (351 total)
  for (let i = 0; i < 351; i++) {
    components.push({
      componentId: generateComponentId(300 + i),
      health: 'healthy',
      riskScore: randomBetween(2, 30),
      anomalyScore: randomBetween(0.02, 0.35),
      failureProbability: randomBetween(1, 15),
      stressDuration: 118,
      primaryIndicator: INDICATORS[Math.floor(Math.random() * INDICATORS.length)],
      modelConfidence: randomBetween(0.92, 0.99),
      parameters: generateMockParameterHistory('healthy'),
    })
  }

  return components
}

function createAnomalies(components: ComponentResult[]): Anomaly[] {
  const anomalies: Anomaly[] = []
  const critical = components.filter(c => c.health === 'critical')
  const atRisk = components.filter(c => c.health === 'at-risk').slice(0, 10)

  let id = 1
  for (const comp of [...critical, ...atRisk]) {
    anomalies.push({
      id: `ANO-${String(id++).padStart(3, '0')}`,
      componentId: comp.componentId,
      parameter: comp.primaryIndicator,
      value: parseFloat(randomBetween(comp.health === 'critical' ? 12 : 8, 20).toFixed(1)),
      threshold: 10.0,
      score: comp.anomalyScore,
      timestamp: new Date(Date.now() - Math.random() * 48 * 3600000).toISOString(),
      severity: comp.health === 'critical' ? 'critical' : 'elevated',
    })
    if (anomalies.length >= 27) break
  }

  return anomalies
}

function createInsights(): AIInsight[] {
  return [
    {
      id: 'INS-001',
      category: 'finding',
      title: '18 components show elevated failure probability',
      description: 'Analysis detected 18 components with failure probability exceeding 70%. These components exhibit accelerated degradation patterns inconsistent with normal burn-in profiles. The primary failure mode is leakage current drift, observed in 11 of the 18 components.',
      severity: 'critical',
      relatedComponents: ['MOSFET-1042', 'IGBT-4012', 'MOSFET-1098'],
    },
    {
      id: 'INS-002',
      category: 'finding',
      title: 'Leakage current drift is the dominant anomaly pattern',
      description: 'Leakage current accounts for 42% of all detected anomalies. The drift pattern shows exponential acceleration after the 80-hour mark, suggesting gate oxide degradation under sustained thermal stress. This is consistent with known failure mechanisms in this component family.',
      severity: 'high',
      relatedComponents: ['MOSFET-1042', 'MOSFET-1098'],
    },
    {
      id: 'INS-003',
      category: 'finding',
      title: '6 components exhibit unexpected aging profile',
      description: 'Components BJT-3044, DIODE-5521, and 4 others show degradation curves that deviate from the expected wear-out model. Their behavior suggests possible manufacturing defects rather than end-of-life wear, warranting further investigation.',
      severity: 'elevated',
      relatedComponents: ['BJT-3044', 'DIODE-5521'],
    },
    {
      id: 'INS-004',
      category: 'warning',
      title: 'Thermal runaway risk detected in MOSFET-1042',
      description: 'MOSFET-1042 shows a positive feedback loop between leakage current and junction temperature. Current trajectory suggests thermal runaway within the next 50 operating hours if stress conditions are maintained.',
      severity: 'critical',
      relatedComponents: ['MOSFET-1042'],
    },
    {
      id: 'INS-005',
      category: 'recommendation',
      title: 'Prioritize secondary screening for high-risk components',
      description: 'Recommend removing all 18 critical components from the deployment batch and subjecting them to secondary screening including curve tracing, thermal imaging, and accelerated life testing. This will reduce batch failure risk by an estimated 85%.',
      severity: 'high',
      relatedComponents: [],
    },
    {
      id: 'INS-006',
      category: 'recommendation',
      title: 'Adjust burn-in parameters for next batch',
      description: 'Consider lowering ambient temperature by 5°C and extending the burn-in duration to 168h for the next batch. This will improve detection sensitivity for latent defects by approximately 12% based on historical data.',
      severity: 'medium',
      relatedComponents: [],
    },
    {
      id: 'INS-007',
      category: 'warning',
      title: 'BJT-3044 batch shows correlated thermal anomalies',
      description: 'Multiple BJT components from the same wafer lot show correlated temperature elevations, suggesting a systematic wafer-level issue. Recommend quarantining the entire lot for additional evaluation.',
      severity: 'high',
      relatedComponents: ['BJT-3044', 'BJT-3088'],
    },
  ]
}

export function generateMockAnalysis(): AnalysisSummary {
  const components = createComponents()
  const anomalies = createAnomalies(components)
  const insights = createInsights()

  return {
    id: 'ANALYSIS-' + Math.random().toString(36).substring(2, 11),
    missionId: 'BURN-IN-042',
    dataset: generateMockDataset().metadata,
    risk: {
      overallScore: 72,
      level: 'elevated',
      modelConfidence: 0.942,
      totalComponents: 412,
      healthy: 351,
      atRisk: 43,
      critical: 18,
      totalAnomalies: 27,
    },
    components,
    anomalies,
    insights,
    completedAt: new Date().toISOString(),
    modelVersion: 'SENTINEL-v3.2.1',
  }
}

export function generateParameterTrendData() {
  const data = []
  for (let i = 0; i < 200; i++) {
    const t = (i / 200) * 120
    const anomalyRegion = t > 80 && t < 95
    const anomalyFactor = anomalyRegion ? 1.25 : 1.0

    data.push({
      timestamp: t.toFixed(1),
      temperature: parseFloat((85 + Math.sin(t * 0.1) * 8 + (t > 80 ? (t - 80) * 0.4 : 0) * anomalyFactor + randomBetween(-2, 2)).toFixed(1)),
      voltage: parseFloat((3.3 - t * 0.001 - (anomalyRegion ? 0.1 : 0) + randomBetween(-0.02, 0.02)).toFixed(3)),
      current: parseFloat((0.5 + Math.cos(t * 0.08) * 0.05 + (t > 70 ? (t - 70) * 0.005 : 0) + randomBetween(-0.01, 0.01)).toFixed(3)),
      leakageCurrent: parseFloat((1.2 + (t / 120) * 0.8 * anomalyFactor + (anomalyRegion ? 1.5 : 0) + randomBetween(-0.2, 0.2)).toFixed(2)),
      resistance: parseFloat((100 + Math.sin(t * 0.03) * 3 + (anomalyRegion ? 5 : 0) + randomBetween(-1, 1)).toFixed(1)),
    })
  }
  return data
}

export function generateAnomalyScatterData() {
  const data = []
  // Normal cluster
  for (let i = 0; i < 350; i++) {
    data.push({
      componentId: generateComponentId(300 + i),
      riskScore: randomBetween(5, 30),
      anomalyScore: randomBetween(0.05, 0.35),
      status: 'normal' as const,
    })
  }
  // At-risk cluster
  for (let i = 0; i < 43; i++) {
    data.push({
      componentId: generateComponentId(200 + i),
      riskScore: randomBetween(35, 75),
      anomalyScore: randomBetween(0.4, 0.78),
      status: 'at-risk' as const,
    })
  }
  // Critical cluster
  for (let i = 0; i < 18; i++) {
    data.push({
      componentId: generateComponentId(100 + i),
      riskScore: randomBetween(80, 98),
      anomalyScore: randomBetween(0.78, 0.98),
      status: 'critical' as const,
    })
  }
  return data
}
