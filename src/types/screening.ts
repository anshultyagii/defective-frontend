export interface ScreeningRecord {
  componentId: string
  timestamp: string
  temperature?: number
  voltage?: number
  current?: number
  resistance?: number
  leakageCurrent?: number
  stressDuration?: number
  [key: string]: unknown
}

export interface ScreeningDataset {
  records: ScreeningRecord[]
  metadata: DatasetMetadata
}

export interface DatasetMetadata {
  totalRecords: number
  totalComponents: number
  parameters: string[]
  dataQuality: number
  uploadedAt: string
  format: DataFormat
}

export type DataFormat = 'csv' | 'json' | 'xlsx' | 'sensor-stream' | 'manual'

export type HealthStatus = 'healthy' | 'at-risk' | 'critical'
export type RiskLevel = 'low' | 'medium' | 'elevated' | 'high' | 'critical'

export interface ComponentResult {
  componentId: string
  health: HealthStatus
  riskScore: number
  anomalyScore: number
  failureProbability: number
  stressDuration: number
  primaryIndicator: string
  modelConfidence: number
  parameters: ParameterHistory
}

export interface ParameterHistory {
  timestamps: string[]
  temperature: number[]
  voltage: number[]
  current: number[]
  resistance: number[]
  leakageCurrent: number[]
}

export interface Anomaly {
  id: string
  componentId: string
  parameter: string
  value: number
  threshold: number
  score: number
  timestamp: string
  severity: RiskLevel
}

export interface RiskAssessment {
  overallScore: number
  level: RiskLevel
  modelConfidence: number
  totalComponents: number
  healthy: number
  atRisk: number
  critical: number
  totalAnomalies: number
}

export interface AnalysisSummary {
  id: string
  missionId: string
  dataset: DatasetMetadata
  risk: RiskAssessment
  components: ComponentResult[]
  anomalies: Anomaly[]
  insights: AIInsight[]
  completedAt: string
  modelVersion: string
}

export interface AIInsight {
  id: string
  category: 'finding' | 'recommendation' | 'warning'
  title: string
  description: string
  severity: RiskLevel
  relatedComponents: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  references?: string[]
}

export interface AnalysisStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'complete' | 'error'
}

export interface AnalysisAssistant {
  ask(question: string, context: AnalysisSummary): Promise<string>
}
