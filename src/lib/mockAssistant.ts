import type { AnalysisAssistant, AnalysisSummary } from '#/types/screening'

class MockAnalysisAssistant implements AnalysisAssistant {
  async ask(question: string, context: AnalysisSummary): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const lowerQ = question.toLowerCase()

    if (lowerQ.includes('mosfet-1042') || lowerQ.includes('high risk')) {
      return `**MOSFET-1042** was classified as high risk due to a combination of factors:

• **Leakage current drift**: The leakage current has increased from 1.0 mA to 15.2 mA over the 118h burn-in period, exceeding the 10.0 mA threshold by 52%.
• **Anomaly score**: 0.94 — this places it in the top 1% of anomalous behavior across all components.
• **Failure probability**: 87% — the ${context.modelVersion} model estimates a high likelihood of field failure within the rated lifecycle.
• **Trend acceleration**: The degradation is non-linear and accelerating, suggesting gate oxide degradation.

**Recommendation**: Remove from batch and submit for secondary inspection and failure analysis.`
    }

    if (lowerQ.includes('inspect') || lowerQ.includes('first') || lowerQ.includes('priority')) {
      const criticalComps = context.components
        .filter(c => c.health === 'critical')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)

      const list = criticalComps.map((c, i) =>
        `${i + 1}. **${c.componentId}** — Risk: ${c.riskScore.toFixed(0)}%, Primary: ${c.primaryIndicator}`
      ).join('\n')

      return `Based on the current analysis, these components should be inspected first (ranked by risk score):\n\n${list}\n\nThese components show the highest probability of field failure and should undergo secondary screening before deployment clearance.`
    }

    if (lowerQ.includes('parameter') || lowerQ.includes('contributed') || lowerQ.includes('most')) {
      return `The parameter contributing most to the overall risk score is **leakage current**, accounting for approximately 42% of all detected anomalies.

Breakdown by parameter:
• Leakage Current: 42% of anomalies
• Temperature: 28% of anomalies
• Resistance: 18% of anomalies
• Voltage: 8% of anomalies
• Current: 4% of anomalies

Leakage current drift is particularly concerning because it often indicates gate oxide degradation or junction defects that accelerate under thermal stress.`
    }

    if (lowerQ.includes('latent') || lowerQ.includes('defect')) {
      return `Yes, there are indicators of potential latent defects in this batch:

• **6 components** exhibit behavior inconsistent with the expected aging profile — their degradation curves suggest manufacturing defects rather than normal wear-out.
• **BJT-3044 batch** shows correlated temperature anomalies, suggesting a possible wafer-level issue.
• **3 MOSFETs** in the at-risk category show early-stage leakage patterns similar to MOSFET-1042 but at lower severity.

The ${context.modelVersion} model assigns a 73% probability that at least 2 of these latent defects would manifest as field failures within the first 1,000 operating hours.`
    }

    if (lowerQ.includes('summar') || lowerQ.includes('overview') || lowerQ.includes('result')) {
      return `**Mission ${context.missionId} — Screening Summary**

• **${context.risk.totalComponents} components** analyzed over 118h burn-in cycle
• **Overall risk**: ${context.risk.overallScore}/100 (${context.risk.level})
• **${context.risk.healthy}** healthy, **${context.risk.atRisk}** at-risk, **${context.risk.critical}** critical
• **${context.risk.totalAnomalies}** anomalies detected across all parameters
• **Model confidence**: ${(context.risk.modelConfidence * 100).toFixed(1)}%

**Key findings**: Leakage current drift is the dominant failure mode. ${context.risk.critical} components require immediate attention and should be removed from the deployment batch.`
    }

    if (lowerQ.includes('risk') || lowerQ.includes('overall') || lowerQ.includes('score')) {
      return `The overall risk level for mission **${context.missionId}** is **${context.risk.level}** with a score of **${context.risk.overallScore}/100**.

Out of ${context.risk.totalComponents} components:
• ${context.risk.healthy} are healthy (${((context.risk.healthy / context.risk.totalComponents) * 100).toFixed(1)}%)
• ${context.risk.atRisk} are at-risk (${((context.risk.atRisk / context.risk.totalComponents) * 100).toFixed(1)}%)
• ${context.risk.critical} are critical (${((context.risk.critical / context.risk.totalComponents) * 100).toFixed(1)}%)

The elevated risk score is primarily driven by the ${context.risk.critical} critical components showing accelerated degradation patterns.`
    }

    if (lowerQ.includes('recommend') || lowerQ.includes('action') || lowerQ.includes('should')) {
      const rec = context.insights.find(i => i.category === 'recommendation')
      return `Based on the ${context.modelVersion} analysis, here are my recommendations:

1. **Immediate**: Remove all ${context.risk.critical} critical components from the deployment batch.
2. **Short-term**: Schedule secondary screening for the ${context.risk.atRisk} at-risk components.
3. **Monitoring**: ${rec ? rec.description : 'Continue monitoring parameter trends for the remaining healthy components.'}
4. **Process**: Review burn-in parameters for the next batch — consider extending duration for marginal components.

Would you like me to elaborate on any specific recommendation?`
    }

    // Default response
    return `Based on the ${context.modelVersion} analysis of mission ${context.missionId}, I can help you investigate specific components, parameters, or trends.

The batch shows ${context.risk.totalAnomalies} detected anomalies across ${context.risk.totalComponents} components, with an overall risk score of ${context.risk.overallScore}/100.

Try asking about specific components (e.g., "Why is MOSFET-1042 critical?") or broader questions like "What parameter contributes most to risk?"`
  }
}

// Singleton export for easy use
export const mockAssistant = new MockAnalysisAssistant()
