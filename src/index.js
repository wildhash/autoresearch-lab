import { ResearchOrchestrator } from './orchestrator.js';
import { anthropicService } from './services/anthropic.js';
import { redisService } from './services/redis.js';
import { apiService } from './services/api.js';
import { sanityService } from './services/sanity.js';
import { skyflowService } from './services/skyflow.js';
import { config } from '../config/index.js';

async function initialize() {
  console.log('\n🚀 AutoResearch Lab - Initializing...\n');

  // Initialize services
  anthropicService.initialize();
  await redisService.connect();
  apiService.initialize();
  sanityService.initialize();
  skyflowService.initialize();

  console.log('\n✓ All services initialized\n');
}

async function runDemo() {
  console.log('🧪 Running demo research...\n');

  const orchestrator = new ResearchOrchestrator();
  
  const demoQuestion = 'What are the emerging trends in blockchain security for 2024?';
  
  const result = await orchestrator.conductResearch(demoQuestion, {
    useCache: true,
    enableReflexion: true,
  });

  if (result.success) {
    console.log('\n📊 RESEARCH RESULTS:');
    console.log('-------------------');
    console.log('\n📋 PLAN:');
    console.log(result.plan);
    console.log('\n📝 REPORT:');
    console.log(result.report);
  } else {
    console.log('\n❌ Research failed:', result.error);
  }
}

async function main() {
  try {
    await initialize();

    // Check if Anthropic API key is configured
    if (!config.anthropic.apiKey) {
      console.log('⚠️  CONFIGURATION REQUIRED');
      console.log('━'.repeat(80));
      console.log('\nTo use AutoResearch Lab, you need to configure your environment:');
      console.log('\n1. Copy .env.example to .env');
      console.log('2. Add your Anthropic API key and other credentials');
      console.log('3. Run "npm run dev" again\n');
      console.log('The system will work with minimal configuration (just Anthropic API key).');
      console.log('Other services (Redis, APIs, etc.) will use mock implementations if not configured.\n');
      console.log('━'.repeat(80));
      console.log('\n✓ System is ready! Configure .env and restart to enable full functionality.\n');
      return;
    }

    // Run demo if configured
    await runDemo();

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    await redisService.disconnect();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await redisService.disconnect();
  process.exit(0);
});

main();
