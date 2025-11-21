/**
 * Mock Data Example
 * 
 * This example demonstrates how the system uses mock data when API keys
 * are not configured, allowing for development and testing without credentials.
 */

import chalk from 'chalk';
import { getMockData, MOCK_DB } from '../src/services/mockData.js';
import * as agentFunctions from '../src/agents/index.js';
import { redisService } from '../src/services/redis.js';

async function demonstrateMockData() {
  console.log(chalk.cyan('\n📦 Mock Data System Demonstration\n'));
  console.log(chalk.gray('This shows how mock data enables development without API keys\n'));

  console.log(chalk.yellow('═'.repeat(80)));
  console.log(chalk.yellow.bold('1. AVAILABLE MOCK DATA SOURCES'));
  console.log(chalk.yellow('═'.repeat(80)));

  // Show TRM Labs mock data
  console.log(chalk.cyan('\n🔗 TRM Labs - Blockchain Intelligence'));
  const trmData = getMockData('trmlabs');
  console.log(chalk.white('  Risk Analysis:'));
  console.log(chalk.gray(`    • Risk Score: ${trmData.data.risk_score}/100`));
  console.log(chalk.gray(`    • Risk Level: ${trmData.data.risk_level}`));
  console.log(chalk.gray(`    • Flagged Wallets: ${trmData.data.flagged_wallets.length}`));
  console.log(chalk.white('  Bridge Security:'));
  console.log(chalk.gray(`    • Bridge TVL: ${trmData.data.bridge_risks.total_tvl}`));
  console.log(chalk.gray(`    • Vulnerability Score: ${trmData.data.bridge_risks.vulnerability_score}`));
  console.log(chalk.gray(`    • Key Risks: ${trmData.data.bridge_risks.key_risks.length} identified`));

  // Show Finster AI mock data
  console.log(chalk.cyan('\n🤖 Finster AI - Financial Analysis'));
  const finsterData = getMockData('finsterai');
  console.log(chalk.white('  Market Analysis:'));
  console.log(chalk.gray(`    • Sector: ${finsterData.data.sector}`));
  console.log(chalk.gray(`    • Volatility: ${finsterData.data.volatility}`));
  console.log(chalk.gray(`    • Sentiment Score: ${finsterData.data.market_sentiment.score}/100`));
  console.log(chalk.white('  Sector Metrics:'));
  console.log(chalk.gray(`    • Market Cap: ${finsterData.data.sector_analysis.market_cap}`));
  console.log(chalk.gray(`    • Monthly Change: ${finsterData.data.sector_analysis.monthly_change}`));

  // Show Senso mock data
  console.log(chalk.cyan('\n📊 Senso - Market Sentiment'));
  const sensoData = getMockData('senso');
  console.log(chalk.white('  Sentiment Metrics:'));
  console.log(chalk.gray(`    • Overall Sentiment: ${sensoData.data.sentiment}`));
  console.log(chalk.gray(`    • Credit Risk: ${sensoData.data.credit_risk}`));
  console.log(chalk.gray(`    • Sentiment Score: ${sensoData.data.market_data.overall_sentiment_score}/100`));
  console.log(chalk.white('  Social Signals:'));
  console.log(chalk.gray(`    • Twitter: ${sensoData.data.bridge_sentiment.social_signals.twitter_sentiment}`));
  console.log(chalk.gray(`    • Reddit: ${sensoData.data.bridge_sentiment.social_signals.reddit_sentiment}`));

  // Demonstrate mock data in action
  console.log(chalk.magenta('\n═'.repeat(80)));
  console.log(chalk.magenta.bold('2. MOCK DATA IN ACTION'));
  console.log(chalk.magenta('═'.repeat(80)));

  console.log(chalk.yellow('\nSimulating a research execution with mock data...'));
  
  await redisService.connect();
  
  // Create a simple plan
  const simplePlan = {
    objective: 'Assess DeFi bridge security',
    steps: [
      {
        step: 1,
        action: 'Query blockchain risk data',
        api: 'trmlabs',
        endpoint: '/risk-analysis',
      },
      {
        step: 2,
        action: 'Get market sentiment',
        api: 'senso',
        endpoint: '/sentiment',
      },
    ],
  };

  console.log(chalk.cyan('\nExecuting plan with mock data fallback...'));
  const execution = await agentFunctions.runExecutor(simplePlan);

  console.log(chalk.green('\n✓ Execution completed'));
  console.log(chalk.white(`  Steps completed: ${execution.results.length}`));
  execution.results.forEach(result => {
    const sourceColor = result.source === 'mock' ? chalk.yellow : chalk.green;
    console.log(sourceColor(`  • Step ${result.step}: ${result.action} (${result.source})`));
  });

  // Show benefits
  console.log(chalk.green('\n═'.repeat(80)));
  console.log(chalk.green.bold('3. BENEFITS OF MOCK DATA SYSTEM'));
  console.log(chalk.green('═'.repeat(80)));
  console.log(chalk.white('\nMock data enables:'));
  console.log(chalk.gray('  ✓ Development without API credentials'));
  console.log(chalk.gray('  ✓ Testing complete workflows offline'));
  console.log(chalk.gray('  ✓ Consistent, reproducible results'));
  console.log(chalk.gray('  ✓ Instant responses (no API latency)'));
  console.log(chalk.gray('  ✓ Cost-free experimentation'));
  console.log(chalk.gray('  ✓ Demos and presentations'));

  console.log(chalk.cyan('\n═'.repeat(80)));
  console.log(chalk.cyan.bold('4. TRANSITIONING TO REAL APIS'));
  console.log(chalk.cyan('═'.repeat(80)));
  console.log(chalk.white('\nTo use real APIs instead of mock data:'));
  console.log(chalk.gray('\n1. Add API keys to your .env file:'));
  console.log(chalk.yellow('   TRM_LABS_API_KEY=your_key_here'));
  console.log(chalk.yellow('   FINSTER_AI_API_KEY=your_key_here'));
  console.log(chalk.yellow('   SENSO_API_KEY=your_key_here'));
  console.log(chalk.gray('\n2. Restart the application'));
  console.log(chalk.gray('3. The system automatically uses real APIs when available'));
  console.log(chalk.gray('4. Falls back to mock data if APIs fail or are unavailable\n'));

  await redisService.disconnect();
  console.log(chalk.green('✅ Demo completed!\n'));
}

// Run the demonstration
demonstrateMockData();
