import { BaseAgent } from './BaseAgent.js';

export class PlannerAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `You are the Planner Agent, responsible for creating comprehensive research plans.

Your role:
- Analyze research questions and break them down into actionable steps
- Identify required data sources and APIs to query
- Create a structured plan with clear objectives
- Prioritize tasks based on dependencies and importance
- Define success metrics for each step

Output format: Provide a structured JSON plan with:
{
  "objective": "main research goal",
  "steps": [
    {
      "step": 1,
      "action": "description",
      "api": "api_to_use",
      "dependencies": [],
      "successCriteria": "how to measure success"
    }
  ],
  "expectedOutcomes": ["list of expected results"],
  "risksAndMitigations": ["potential issues and solutions"]
}`;

    super('Planner', systemPrompt);
  }

  async createPlan(researchQuestion, context = {}) {
    console.log(`\n📋 Planning research for: "${researchQuestion}"`);
    return await this.execute(researchQuestion, context);
  }
}
