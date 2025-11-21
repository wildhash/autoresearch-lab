import { PlannerAgent } from './agents/PlannerAgent.js';
import { ExecutorAgent } from './agents/ExecutorAgent.js';
import { AnalystAgent } from './agents/AnalystAgent.js';
import { CriticAgent } from './agents/CriticAgent.js';
import { ReporterAgent } from './agents/ReporterAgent.js';
import { redisService } from './services/redis.js';

export class ResearchOrchestrator {
  constructor() {
    this.planner = new PlannerAgent();
    this.executor = new ExecutorAgent();
    this.analyst = new AnalystAgent();
    this.critic = new CriticAgent();
    this.reporter = new ReporterAgent();
  }

  async conductResearch(researchQuestion, options = {}) {
    console.log('\n' + '='.repeat(80));
    console.log(`🔬 AutoResearch Lab - Starting Research`);
    console.log('='.repeat(80));
    console.log(`Question: ${researchQuestion}\n`);

    try {
      // Phase 1: Planning
      console.log('📋 PHASE 1: Planning');
      const plan = await this.planner.createPlan(researchQuestion, {
        useCache: options.useCache,
      });

      // Phase 2: Execution
      console.log('\n⚡ PHASE 2: Execution');
      const execution = await this.executor.executePlan(plan, {
        plan,
      });

      // Phase 3: Analysis
      console.log('\n📊 PHASE 3: Analysis');
      const analysis = await this.analyst.analyzeResults(execution.results, {
        plan,
        execution,
      });

      // Phase 4: Critique (Reflexion Loop)
      console.log('\n🔍 PHASE 4: Critical Review');
      const critique = await this.critic.critique(analysis, {
        plan,
        execution,
        analysis,
      });

      // Check if reflexion suggests improvements
      if (options.enableReflexion && this.shouldIterateBasedOnCritique(critique)) {
        console.log('\n🔄 Reflexion: Critique suggests iteration...');
        // Could implement additional iteration here
      }

      // Phase 5: Reporting
      console.log('\n📝 PHASE 5: Report Generation');
      const report = await this.reporter.generateReport({
        question: researchQuestion,
        plan,
        execution,
        analysis,
        critique,
      });

      console.log('\n' + '='.repeat(80));
      console.log('✅ Research Complete!');
      console.log('='.repeat(80));

      return {
        success: true,
        question: researchQuestion,
        plan,
        execution,
        analysis,
        critique,
        report,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('\n❌ Research failed:', error.message);
      return {
        success: false,
        error: error.message,
        question: researchQuestion,
        timestamp: new Date().toISOString(),
      };
    }
  }

  shouldIterateBasedOnCritique(critique) {
    // Simple heuristic - could be more sophisticated
    const critiqueLower = critique.toLowerCase();
    return (
      critiqueLower.includes('significant gap') ||
      critiqueLower.includes('major limitation') ||
      critiqueLower.includes('insufficient data')
    );
  }

  async getResearchHistory() {
    return await redisService.getAllLearnings();
  }
}
