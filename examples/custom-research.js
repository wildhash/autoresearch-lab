/**
 * Custom Research Example
 * 
 * This example shows how to conduct a custom research query
 * using the AutoResearch Lab system.
 */

import { ResearchOrchestrator } from '../src/orchestrator.js';
import { anthropicService } from '../src/services/anthropic.js';
import { redisService } from '../src/services/redis.js';
import { apiService } from '../src/services/api.js';

async function initialize() {
  // Initialize all services
  anthropicService.initialize();
  await redisService.connect();
  apiService.initialize();
  console.log('✓ Services initialized\n');
}

async function runCustomResearch() {
  const orchestrator = new ResearchOrchestrator();
  
  // Define your research question
  const researchQuestion = 'What are the latest developments in sustainable energy technology?';
  
  console.log('Starting research...\n');
  console.log(`Question: ${researchQuestion}\n`);
  
  // Conduct the research
  const result = await orchestrator.conductResearch(researchQuestion, {
    useCache: true,          // Use cached results when available
    enableReflexion: true,   // Enable self-improvement loops
  });
  
  if (result.success) {
    console.log('\n' + '='.repeat(80));
    console.log('RESEARCH COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    
    // Display the plan
    console.log('\n📋 RESEARCH PLAN:');
    console.log('-'.repeat(80));
    console.log(result.plan);
    
    // Display execution summary
    console.log('\n⚡ EXECUTION SUMMARY:');
    console.log('-'.repeat(80));
    console.log(result.execution.summary);
    
    // Display analysis
    console.log('\n📊 ANALYSIS:');
    console.log('-'.repeat(80));
    console.log(result.analysis);
    
    // Display critique
    console.log('\n🔍 CRITICAL REVIEW:');
    console.log('-'.repeat(80));
    console.log(result.critique);
    
    // Display final report
    console.log('\n📝 FINAL REPORT:');
    console.log('='.repeat(80));
    console.log(result.report);
    console.log('='.repeat(80));
    
    // Save report to file (optional)
    // const fs = await import('fs/promises');
    // await fs.writeFile('research-report.txt', result.report);
    // console.log('\n✓ Report saved to research-report.txt');
    
  } else {
    console.error('Research failed:', result.error);
  }
}

async function main() {
  try {
    await initialize();
    await runCustomResearch();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await redisService.disconnect();
  }
}

main();
