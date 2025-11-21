#!/usr/bin/env node
/**
 * Test script to verify mock data and basic functionality
 */

import { getMockData, MOCK_DB } from '../src/services/mockData.js';
import { redisService } from '../src/services/redis.js';
import chalk from 'chalk';

console.log(chalk.cyan('\n🧪 Running AutoResearch Lab Tests\n'));
console.log(chalk.gray('='.repeat(60)));

let testsPass = 0;
let testsFail = 0;

// Test 1: Mock Data - TRM Labs
try {
  console.log(chalk.yellow('\n📋 Test 1: TRM Labs Mock Data'));
  const trmData = getMockData('trmlabs');
  if (trmData.success && trmData.data.risk_score === 85) {
    console.log(chalk.green('  ✓ TRM Labs data structure correct'));
    console.log(chalk.gray(`    - Risk Score: ${trmData.data.risk_score}`));
    console.log(chalk.gray(`    - Flagged Wallets: ${trmData.data.flagged_wallets.length}`));
    testsPass++;
  } else {
    throw new Error('Invalid data structure');
  }
} catch (error) {
  console.log(chalk.red('  ✗ TRM Labs test failed:', error.message));
  testsFail++;
}

// Test 2: Mock Data - Finster AI
try {
  console.log(chalk.yellow('\n📋 Test 2: Finster AI Mock Data'));
  const finsterData = getMockData('finsterai');
  if (finsterData.success && finsterData.data.sector === 'DeFi') {
    console.log(chalk.green('  ✓ Finster AI data structure correct'));
    console.log(chalk.gray(`    - Sector: ${finsterData.data.sector}`));
    console.log(chalk.gray(`    - Volatility: ${finsterData.data.volatility}`));
    testsPass++;
  } else {
    throw new Error('Invalid data structure');
  }
} catch (error) {
  console.log(chalk.red('  ✗ Finster AI test failed:', error.message));
  testsFail++;
}

// Test 3: Mock Data - Senso
try {
  console.log(chalk.yellow('\n📋 Test 3: Senso Mock Data'));
  const sensoData = getMockData('senso');
  if (sensoData.success && sensoData.data.sentiment === 'Negative') {
    console.log(chalk.green('  ✓ Senso data structure correct'));
    console.log(chalk.gray(`    - Sentiment: ${sensoData.data.sentiment}`));
    console.log(chalk.gray(`    - Credit Risk: ${sensoData.data.credit_risk}`));
    testsPass++;
  } else {
    throw new Error('Invalid data structure');
  }
} catch (error) {
  console.log(chalk.red('  ✗ Senso test failed:', error.message));
  testsFail++;
}

// Test 4: Redis Mock Client
try {
  console.log(chalk.yellow('\n📋 Test 4: Redis Mock Client'));
  await redisService.connect();
  await redisService.saveLearning('test_topic', 'This is a test learning');
  const learnings = await redisService.getLearnings('test_topic');
  if (learnings.length > 0 && learnings[0].insight === 'This is a test learning') {
    console.log(chalk.green('  ✓ Redis mock client working'));
    console.log(chalk.gray(`    - Saved and retrieved learning successfully`));
    testsPass++;
  } else {
    throw new Error('Learning not saved/retrieved correctly');
  }
} catch (error) {
  console.log(chalk.red('  ✗ Redis test failed:', error.message));
  testsFail++;
}

// Test 5: Cache functionality
try {
  console.log(chalk.yellow('\n📋 Test 5: Cache Functionality'));
  await redisService.cacheResult('test_key', { data: 'test_value' });
  const cached = await redisService.getCachedResult('test_key');
  if (cached && cached.data === 'test_value') {
    console.log(chalk.green('  ✓ Cache working correctly'));
    console.log(chalk.gray(`    - Cached and retrieved data successfully`));
    testsPass++;
  } else {
    throw new Error('Cache not working correctly');
  }
} catch (error) {
  console.log(chalk.red('  ✗ Cache test failed:', error.message));
  testsFail++;
}

// Test 6: Mock DB structure
try {
  console.log(chalk.yellow('\n📋 Test 6: Mock DB Structure'));
  if (MOCK_DB.TRM_Labs && MOCK_DB.Finster_AI && MOCK_DB.Senso) {
    console.log(chalk.green('  ✓ Mock DB has all required APIs'));
    console.log(chalk.gray(`    - TRM_Labs: ✓`));
    console.log(chalk.gray(`    - Finster_AI: ✓`));
    console.log(chalk.gray(`    - Senso: ✓`));
    testsPass++;
  } else {
    throw new Error('Mock DB missing required APIs');
  }
} catch (error) {
  console.log(chalk.red('  ✗ Mock DB test failed:', error.message));
  testsFail++;
}

// Summary
console.log(chalk.cyan('\n' + '='.repeat(60)));
console.log(chalk.bold(`\n📊 Test Results: ${testsPass} passed, ${testsFail} failed\n`));

if (testsFail === 0) {
  console.log(chalk.green('✅ All tests passed!\n'));
  process.exit(0);
} else {
  console.log(chalk.red('❌ Some tests failed!\n'));
  process.exit(1);
}
