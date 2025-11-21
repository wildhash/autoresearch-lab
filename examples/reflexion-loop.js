/**
 * Reflexion Loop Example
 * 
 * This example demonstrates the Reflexion Loop - how the system learns
 * from past research and improves over time by storing and retrieving learnings.
 */

import chalk from 'chalk';
import { ResearchOrchestrator } from '../src/orchestrator.js';
import { anthropicService } from '../src/services/anthropic.js';
import { redisService } from '../src/services/redis.js';

async function runReflexionExample() {
  console.log(chalk.cyan('\n🔄 Reflexion Loop Example\n'));
  console.log(chalk.gray('This demonstrates how the system learns from past research\n'));

  try {
    // Initialize services
    console.log(chalk.yellow('Initializing services...'));
    anthropicService.initialize();
    await redisService.connect();
    console.log(chalk.green('✓ Services initialized\n'));

    const orchestrator = new ResearchOrchestrator();

    // First Research: Initial exploration
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold('FIRST RESEARCH: Initial DeFi Bridge Security Analysis'));
    console.log(chalk.cyan('═'.repeat(80)));

    const firstResult = await orchestrator.conductResearch(
      'What are the main security risks in DeFi bridges?',
      { useCache: false, enableReflexion: true }
    );

    if (firstResult.success) {
      console.log(chalk.green('\n✓ First research completed successfully'));
    }

    // Wait a moment for visibility
    console.log(chalk.yellow('\n⏳ Waiting before second research...\n'));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second Research: Building on learnings
    console.log(chalk.cyan('\n═'.repeat(80)));
    console.log(chalk.cyan.bold('SECOND RESEARCH: Focused Follow-up'));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.gray('This research will use learnings from the first research\n'));

    const secondResult = await orchestrator.conductResearch(
      'How can DeFi bridge security be improved?',
      { useCache: true, enableReflexion: true }
    );

    if (secondResult.success) {
      console.log(chalk.green('\n✓ Second research completed successfully'));
    }

    // Show the learnings accumulated
    console.log(chalk.magenta('\n═'.repeat(80)));
    console.log(chalk.magenta.bold('📚 ACCUMULATED LEARNINGS'));
    console.log(chalk.magenta('═'.repeat(80)));

    const defiLearnings = await redisService.getLearnings('defi');
    const securityLearnings = await redisService.getLearnings('security');
    
    console.log(chalk.cyan('\n🔐 DeFi Learnings:'));
    if (defiLearnings.length > 0) {
      defiLearnings.forEach((learning, i) => {
        console.log(chalk.yellow(`  ${i + 1}. ${learning.insight || learning}`));
        if (learning.timestamp) {
          console.log(chalk.gray(`     Saved: ${new Date(learning.timestamp).toLocaleString()}`));
        }
      });
    } else {
      console.log(chalk.gray('  No learnings stored yet'));
    }

    console.log(chalk.cyan('\n🛡️  Security Learnings:'));
    if (securityLearnings.length > 0) {
      securityLearnings.forEach((learning, i) => {
        console.log(chalk.yellow(`  ${i + 1}. ${learning.insight || learning}`));
        if (learning.timestamp) {
          console.log(chalk.gray(`     Saved: ${new Date(learning.timestamp).toLocaleString()}`));
        }
      });
    } else {
      console.log(chalk.gray('  No learnings stored yet'));
    }

    // Show how Reflexion improves research
    console.log(chalk.green('\n═'.repeat(80)));
    console.log(chalk.green.bold('💡 KEY INSIGHTS'));
    console.log(chalk.green('═'.repeat(80)));
    console.log(chalk.white('\nThe Reflexion Loop provides:'));
    console.log(chalk.gray('  • Memory of past research and insights'));
    console.log(chalk.gray('  • Contextual learning that improves over time'));
    console.log(chalk.gray('  • Avoidance of repeated mistakes'));
    console.log(chalk.gray('  • Building knowledge base automatically'));
    console.log(chalk.gray('  • Self-improvement through critical reflection\n'));

  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
  } finally {
    // Cleanup
    await redisService.disconnect();
    console.log(chalk.gray('\n👋 Example completed\n'));
  }
}

// Run the example
runReflexionExample();
