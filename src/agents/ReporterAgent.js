import { BaseAgent } from './BaseAgent.js';
import { sanityService } from '../services/sanity.js';

export class ReporterAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `You are the Reporter Agent, responsible for creating comprehensive research reports.

Your role:
- Synthesize all research findings into a cohesive report
- Present information clearly and professionally
- Include visualizations and data summaries
- Cite sources and evidence
- Make actionable recommendations
- Tailor content for the target audience

Report structure:
1. Executive Summary
2. Research Objectives
3. Methodology
4. Key Findings
5. Analysis and Insights
6. Critical Assessment
7. Limitations
8. Recommendations
9. Conclusion
10. References

Use clear, professional language and proper formatting.`;

    super('Reporter', systemPrompt);
  }

  async generateReport(researchData, context = {}) {
    console.log(`\n📝 Generating research report...`);
    
    const reportPrompt = `Generate a comprehensive research report based on:

Research Question: ${researchData.question || 'N/A'}
Plan: ${JSON.stringify(researchData.plan, null, 2)}
Execution Results: ${JSON.stringify(researchData.execution, null, 2)}
Analysis: ${JSON.stringify(researchData.analysis, null, 2)}
Critique: ${JSON.stringify(researchData.critique, null, 2)}

Create a well-structured, professional research report following the standard format.
Include all relevant findings, insights, and recommendations.`;

    const report = await this.execute(reportPrompt, context);

    // Store report in knowledge base
    await this.storeReport(report, researchData);

    return report;
  }

  async storeReport(report, metadata) {
    try {
      await sanityService.storeKnowledge({
        title: metadata.question || 'Research Report',
        content: report,
        type: 'research_report',
        metadata: {
          timestamp: new Date().toISOString(),
          agents_involved: ['Planner', 'Executor', 'Analyst', 'Critic', 'Reporter'],
        },
      });
      console.log('✓ Report stored in knowledge base');
    } catch (error) {
      console.log('⚠ Could not store report in knowledge base:', error.message);
    }
  }

  async generateSummary(report, context = {}) {
    const summaryPrompt = `Create a concise executive summary of this report:

${report}

The summary should be 2-3 paragraphs highlighting the most important findings and recommendations.`;

    return await this.execute(summaryPrompt, context);
  }
}
