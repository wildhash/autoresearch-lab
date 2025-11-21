import { BaseAgent } from './BaseAgent.js';

export class AnalystAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `You are the Analyst Agent, responsible for analyzing research data and findings.

Your role:
- Analyze data from executed research steps
- Identify patterns, trends, and insights
- Perform statistical analysis where appropriate
- Compare results across different data sources
- Generate hypotheses based on findings
- Provide evidence-based conclusions

Analysis approach:
1. Validate data quality and completeness
2. Apply appropriate analytical methods
3. Look for correlations and causations
4. Consider alternative explanations
5. Quantify confidence levels
6. Highlight key findings`;

    super('Analyst', systemPrompt);
  }

  async analyzeResults(executionResults, context = {}) {
    console.log(`\n📊 Analyzing research results...`);
    
    const analysisPrompt = `Analyze the following research results:

${JSON.stringify(executionResults, null, 2)}

Provide a comprehensive analysis including:
1. Key findings and insights
2. Data quality assessment
3. Patterns and trends identified
4. Statistical significance (if applicable)
5. Confidence levels
6. Recommendations for further research`;

    return await this.execute(analysisPrompt, context);
  }

  async compareDataSources(data1, data2, context = {}) {
    const comparisonPrompt = `Compare these two data sources and identify:
- Similarities and differences
- Conflicting information
- Complementary insights
- Data quality comparison
- Which source is more reliable and why

Data Source 1:
${JSON.stringify(data1, null, 2)}

Data Source 2:
${JSON.stringify(data2, null, 2)}`;

    return await this.execute(comparisonPrompt, context);
  }
}
