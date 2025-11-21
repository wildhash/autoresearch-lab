/**
 * Multiple Research Queries Example
 * 
 * This example shows how to run multiple research queries
 * in sequence, building on previous learnings.
 */

import { ResearchOrchestrator } from '../src/orchestrator.js';
import { anthropicService } from '../src/services/anthropic.js';
import { redisService } from '../src/services/redis.js';

async function initialize() {
  anthropicService.initialize();
  await redisService.connect();
  console.log('✓ Services initialized\n');
}

async function runMultipleResearch() {
  const orchestrator = new ResearchOrchestrator();
  
  // Define a series of related research questions
  const questions = [
    'What are the current trends in artificial intelligence?',
    'How is AI being applied in healthcare?',
    'What are the ethical concerns around AI in medical diagnosis?',
  ];
  
  const results = [];
  
  for (const [index, question] of questions.entries()) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`RESEARCH ${index + 1} of ${questions.length}`);
    console.log('='.repeat(80));
    console.log(`Question: ${question}\n`);
    
    const result = await orchestrator.conductResearch(question, {
      useCache: true,
      enableReflexion: true,
    });
    
    results.push(result);
    
    if (result.success) {
      console.log('\n✓ Research completed');
      console.log(`Plan: ${result.plan.substring(0, 200)}...`);
    } else {
      console.error('\n✗ Research failed:', result.error);
    }
    
    // Small delay between queries
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Display summary of all research
  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH SERIES SUMMARY');
  console.log('='.repeat(80));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${questions[index]}`);
    console.log(`   Status: ${result.success ? '✓ Success' : '✗ Failed'}`);
    if (result.success) {
      console.log(`   Timestamp: ${result.timestamp}`);
    }
  });
  
  // Get all learnings from memory
  const learnings = await redisService.getAllLearnings();
  console.log(`\n✓ Total learnings stored: ${learnings.length}`);
}

async function main() {
  try {
    await initialize();
    await runMultipleResearch();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await redisService.disconnect();
  }
}

main();
