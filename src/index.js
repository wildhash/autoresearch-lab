import chalk from 'chalk';
import { ResearchOrchestrator } from './orchestrator.js';
import { anthropicService } from './services/anthropic.js';
import { redisService } from './services/redis.js';
import { apiService } from './services/api.js';
import { sanityService } from './services/sanity.js';
import { skyflowService } from './services/skyflow.js';
import { config } from '../config/index.js';

async function initialize() {
  console.log(chalk.cyan('\n🚀 AutoResearch Lab - Initializing...\n'));

  // Initialize services
  anthropicService.initialize();
  await redisService.connect();
  apiService.initialize();
  sanityService.initialize();
  skyflowService.initialize();

  console.log(chalk.green('\n✓ All services initialized\n'));
}

async function runResearch(question) {
  console.log(chalk.cyan('🧪 Starting research...\n'));

  const orchestrator = new ResearchOrchestrator();
  
  const result = await orchestrator.conductResearch(question, {
    useCache: true,
    enableReflexion: true,
  });

  if (result.success) {
    console.log(chalk.cyan('\n📊 RESEARCH RESULTS:'));
    console.log(chalk.cyan('-------------------'));
    console.log(chalk.yellow('\n📋 PLAN:'));
    console.log(result.plan);
    console.log(chalk.green('\n📝 REPORT:'));
    console.log(result.report);
  } else {
    console.log(chalk.red('\n❌ Research failed:'), result.error);
  }
}

async function main() {
  try {
    await initialize();

    // Check if Anthropic API key is configured
    if (!config.anthropic.apiKey) {
      console.log(chalk.yellow('⚠️  CONFIGURATION REQUIRED'));
      console.log(chalk.gray('━'.repeat(80)));
      console.log('\nTo use AutoResearch Lab, you need to configure your environment:');
      console.log(chalk.cyan('\n1. Copy .env.example to .env'));
      console.log(chalk.cyan('2. Add your Anthropic API key and other credentials'));
      console.log(chalk.cyan('3. Run "npm run dev" or "node src/index.js <question>" again\n'));
      console.log('The system will work with minimal configuration (just Anthropic API key).');
      console.log('Other services (Redis, APIs, etc.) will use mock implementations if not configured.\n');
      console.log(chalk.gray('━'.repeat(80)));
      console.log(chalk.green('\n✓ System is ready! Configure .env and restart to enable full functionality.\n'));
      return;
    }

    // Get question from command line or use default
    const question = process.argv[2] || 'What are the emerging trends in blockchain security for 2024?';
    
    if (process.argv[2]) {
      console.log(chalk.green('✓ Using question from command line\n'));
    } else {
      console.log(chalk.yellow('⚠ No question provided, using default demo question\n'));
      console.log(chalk.gray('Usage: node src/index.js "Your research question here"\n'));
    }

    // Run research with the question
    await runResearch(question);

  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error.message);
    process.exit(1);
  } finally {
    // Cleanup
    await redisService.disconnect();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\n👋 Shutting down gracefully...'));
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n\n👋 Shutting down gracefully...'));
  await redisService.disconnect();
  process.exit(0);
});

main();
