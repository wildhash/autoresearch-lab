import chalk from 'chalk';
import { redisService } from './services/redis.js';
import * as agentFunctions from './agents/index.js';

export class ResearchOrchestrator {
  constructor() {
    // Agent functions are imported from agents/index.js
  }

  async conductResearch(researchQuestion, options = {}) {
    console.log('\n' + chalk.cyan('='.repeat(80)));
    console.log(chalk.cyan.bold('🔬 AutoResearch Lab - Starting Research'));
    console.log(chalk.cyan('='.repeat(80)));
    console.log(chalk.yellow(`Question: ${researchQuestion}\n`));

    try {
      // Phase 0: Memory - Check past learnings
      console.log(chalk.magenta('💾 PHASE 0: Memory'));
      console.log(chalk.gray('[Memory] Fetching past learnings for context...'));
      
      const topic = this.extractTopic(researchQuestion);
      const learnings = await redisService.getLearnings(topic);
      const learningsText = learnings.length > 0 
        ? learnings.map(l => `- ${l.insight || l}`).join('\n')
        : 'No past learnings found for this topic.';
      
      console.log(chalk.gray(`[Memory] Found ${learnings.length} past learning(s)`));

      // Phase 1: Planning
      console.log(chalk.blue('\n📋 PHASE 1: Planning'));
      console.log(chalk.blue('[Planner] 🧠 Designing research strategy...'));
      
      const plan = await agentFunctions.runPlanner(researchQuestion, learningsText);
      console.log(chalk.green('✓ Plan created'));

      // Phase 2: Execution
      console.log(chalk.yellow('\n⚡ PHASE 2: Execution'));
      console.log(chalk.yellow('[Executor] ⚡️ Executing research plan...'));
      
      const execution = await agentFunctions.runExecutor(plan);
      console.log(chalk.green('✓ Execution completed'));

      // Phase 3: Analysis
      console.log(chalk.cyan('\n📊 PHASE 3: Analysis'));
      console.log(chalk.cyan('[Analyst] 🔍 Detecting patterns and anomalies...'));
      
      const analysis = await agentFunctions.runAnalyst(execution.results);
      console.log(chalk.green('✓ Analysis completed'));

      // Phase 4: Reporting
      console.log(chalk.magenta('\n📝 PHASE 4: Report Generation'));
      console.log(chalk.magenta('[Reporter] 📝 Writing final report...'));
      
      const report = await agentFunctions.runReporter({
        question: researchQuestion,
        plan,
        execution,
        analysis,
      });
      console.log(chalk.green('✓ Report generated'));

      // Phase 5: Critique (Reflexion Loop - CRITICAL)
      console.log(chalk.red('\n🔍 PHASE 5: Critical Review (Reflexion)'));
      console.log(chalk.red('[Critic] 🧐 Reviewing performance and extracting learnings...'));
      
      const critique = await agentFunctions.runCritic({
        question: researchQuestion,
        plan,
        execution,
        analysis,
        report,
      });
      console.log(chalk.green('✓ Critique completed'));

      // Phase 6: Save Learning (Complete Reflexion Loop)
      console.log(chalk.magenta('\n💾 PHASE 6: Saving Learnings'));
      console.log(chalk.magenta('[Memory] Extracting and saving key lessons...'));
      
      await this.extractAndSaveLearning(critique, topic);

      console.log('\n' + chalk.green('='.repeat(80)));
      console.log(chalk.green.bold('✅ Research Complete!'));
      console.log(chalk.green('='.repeat(80)));

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
      console.error(chalk.red('\n❌ Research failed:'), error.message);
      return {
        success: false,
        error: error.message,
        question: researchQuestion,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Extract topic from research question for learning categorization
   */
  extractTopic(question) {
    const lowerQ = question.toLowerCase();
    
    // Simple keyword matching for topic extraction
    if (lowerQ.includes('defi') || lowerQ.includes('bridge')) return 'defi';
    if (lowerQ.includes('security') || lowerQ.includes('risk')) return 'security';
    if (lowerQ.includes('blockchain') || lowerQ.includes('crypto')) return 'blockchain';
    if (lowerQ.includes('market') || lowerQ.includes('sentiment')) return 'market';
    
    return 'general';
  }

  /**
   * Extract learning from critique and save to memory (Reflexion Loop)
   */
  async extractAndSaveLearning(critique, topic) {
    try {
      // Try to parse critique as JSON
      let critiqueObj;
      try {
        critiqueObj = typeof critique === 'string' ? JSON.parse(critique) : critique;
      } catch {
        // If not JSON, use the whole critique as learning
        await redisService.saveLearning(topic, critique);
        console.log(chalk.green(`[Memory] Saved learning for topic: ${topic}`));
        return;
      }

      // Extract the learning_for_memory field
      const learning = critiqueObj.learning_for_memory 
        || critiqueObj.learningForMemory
        || critiqueObj.keyLearning
        || (critiqueObj.suggestionsForImprovement && critiqueObj.suggestionsForImprovement[0])
        || 'Review completed - continue monitoring similar patterns';

      await redisService.saveLearning(topic, learning);
      console.log(chalk.green(`[Memory] Saved new learning: "${learning}"`));
    } catch (error) {
      console.error(chalk.red('[Memory] Failed to save learning:'), error.message);
    }
  }

  async getResearchHistory() {
    return await redisService.getAllLearnings();
  }
}
