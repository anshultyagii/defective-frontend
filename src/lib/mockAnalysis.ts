import type { ScreeningDataset, AnalysisSummary, AnalysisStep } from '#/types/screening'
import { generateMockAnalysis } from '#/lib/mockData'

export async function runMockAnalysis(
  dataset: ScreeningDataset,
  onProgress?: (step: AnalysisStep, progress: number) => void
): Promise<AnalysisSummary> {
  const steps: AnalysisStep[] = [
    { id: 'validate', label: 'Validating dataset', status: 'pending' },
    { id: 'normalize', label: 'Normalizing signals', status: 'pending' },
    { id: 'baseline', label: 'Establishing baselines', status: 'pending' },
    { id: 'anomaly', label: 'Detecting anomalies', status: 'pending' },
    { id: 'failure', label: 'Estimating failure probabilities', status: 'pending' },
    { id: 'report', label: 'Generating insights report', status: 'pending' }
  ]

  let currentProgress = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    step.status = 'running'
    if (onProgress) onProgress(step, currentProgress)

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500))

    step.status = 'complete'
    currentProgress = Math.round(((i + 1) / steps.length) * 100)
    if (onProgress) onProgress(step, currentProgress)
  }

  return generateMockAnalysis()
}
