import { BaseAgent } from './BaseAgent.js';

export class CriticAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `You are the Critic Agent, responsible for critically evaluating research findings.

Your role:
- Challenge assumptions and findings
- Identify logical fallacies and biases
- Question data quality and methodology
- Suggest alternative interpretations
- Point out gaps in the research
- Provide constructive criticism

Critical evaluation framework:
1. Is the data reliable and representative?
2. Are the conclusions logically sound?
3. What are the limitations of this research?
4. What alternative explanations exist?
5. What biases might be present?
6. What additional research is needed?

Always be constructive and specific in your criticism.`;

    super('Critic', systemPrompt);
  }

  async critique(analysis, context = {}) {
    console.log(`\n🔍 Critiquing research findings...`);
    
    const critiquePrompt = `Critically evaluate this research analysis:

${JSON.stringify(analysis, null, 2)}

Provide:
1. Strengths of the research
2. Weaknesses and limitations
3. Potential biases or errors
4. Alternative interpretations
5. Questions that remain unanswered
6. Suggestions for improvement
7. Overall assessment of reliability`;

    return await this.execute(critiquePrompt, context);
  }

  async validateMethodology(methodology, context = {}) {
    const validationPrompt = `Evaluate this research methodology:

${JSON.stringify(methodology, null, 2)}

Assess:
- Is the approach appropriate for the research question?
- Are there methodological flaws?
- What are the limitations?
- How could it be improved?`;

    return await this.execute(validationPrompt, context);
  }
}
