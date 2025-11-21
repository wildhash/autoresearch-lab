import { BaseAgent } from './BaseAgent.js';
import { apiService } from '../services/api.js';

export class ExecutorAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `You are the Executor Agent, responsible for executing research plans.

Your role:
- Execute API calls according to the plan
- Handle data retrieval and processing
- Manage errors and retries
- Collect and organize results
- Report progress and issues

When executing:
1. Follow the plan step by step
2. Validate data before proceeding
3. Handle errors gracefully
4. Document all actions taken
5. Provide clear status updates`;

    super('Executor', systemPrompt);
  }

  async executePlan(plan, context = {}) {
    console.log(`\n⚡ Executing research plan...`);
    
    try {
      const planObj = typeof plan === 'string' ? JSON.parse(plan) : plan;
      const results = [];

      for (const step of planObj.steps || []) {
        console.log(`  Step ${step.step}: ${step.action}`);
        
        // Execute API call if specified
        if (step.api) {
          const apiResult = await this.executeAPICall(step);
          results.push({
            step: step.step,
            action: step.action,
            result: apiResult,
            success: !apiResult.error,
          });
        } else {
          // Execute analysis or other non-API task
          const taskResult = await this.execute(
            `Execute: ${step.action}\nContext: ${JSON.stringify(context)}`,
            { ...context, step }
          );
          results.push({
            step: step.step,
            action: step.action,
            result: taskResult,
            success: true,
          });
        }
      }

      return {
        completed: true,
        results,
        summary: await this.summarizeResults(results),
      };
    } catch (error) {
      console.error('Execution error:', error.message);
      return {
        completed: false,
        error: error.message,
        results: [],
      };
    }
  }

  async executeAPICall(step) {
    const { api, endpoint = '/', params = {} } = step;
    
    try {
      const result = await apiService.query(api, endpoint, params);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  async summarizeResults(results) {
    const successCount = results.filter(r => r.success).length;
    return `Completed ${results.length} steps with ${successCount} successful executions`;
  }
}
