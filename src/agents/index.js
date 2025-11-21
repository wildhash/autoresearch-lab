/**
 * Agent Wrapper Functions
 * Provides convenient function-based interface to agents
 */

import { anthropicService } from '../services/anthropic.js';
import { redisService } from '../services/redis.js';
import { apiService } from '../services/api.js';
import { getMockData } from '../services/mockData.js';
import * as prompts from './prompts.js';

/**
 * Run the Planner agent to create a research plan
 * @param {string} question - The research question
 * @param {string} pastLearnings - Past learnings context
 * @returns {Promise<string>} - Research plan (JSON)
 */
export async function runPlanner(question, pastLearnings = '') {
  console.log('🧠 Planner is thinking...');
  
  const userMessage = `Research Question: ${question}

${pastLearnings ? `Past Learnings:\n${pastLearnings}\n` : ''}

Create a comprehensive research plan to answer this question. Consider the available APIs:
- trmlabs: Blockchain intelligence, crypto risk, bridge security
- finsterai: AI-powered financial analysis, sector insights, risk factors  
- senso: Market sentiment, credit risk, social signals

Provide a detailed, actionable plan in JSON format.`;

  try {
    const response = await anthropicService.callClaude(
      prompts.PLANNER,
      userMessage
    );
    return response;
  } catch (error) {
    console.error('Planner error:', error.message);
    throw error;
  }
}

/**
 * Run the Executor agent to execute a research plan
 * @param {string|object} plan - The research plan
 * @returns {Promise<object>} - Execution results
 */
export async function runExecutor(plan) {
  console.log('⚡️ Executor is working...');
  
  try {
    let planObj;
    try {
      planObj = typeof plan === 'string' ? JSON.parse(plan) : plan;
    } catch (parseError) {
      console.error('Failed to parse plan:', parseError.message);
      return {
        completed: false,
        error: 'Invalid plan format: ' + parseError.message,
        results: [],
      };
    }
    
    const results = [];

    for (const step of planObj.steps || []) {
      console.log(`  📍 Step ${step.step}: ${step.action}`);
      
      if (step.api) {
        // Check Redis cache first
        const cacheKey = `api:${step.api}:${step.endpoint || 'default'}`;
        let data = await redisService.getCachedResult(cacheKey);
        
        if (data) {
          console.log(`    ✓ Using cached data`);
          results.push({
            step: step.step,
            action: step.action,
            data,
            source: 'cache',
            success: true,
            timestamp: new Date().toISOString(),
          });
        } else {
          // Try real API, fallback to mock data
          try {
            data = await apiService.query(step.api, step.endpoint || '/', step.params || {});
            
            // If API returns error or not configured, use mock data
            if (data.error || !data || Object.keys(data).length === 0) {
              console.log(`    ⚠ API unavailable, using mock data`);
              data = getMockData(step.api, step.endpoint);
            }
            
            // Cache the result
            await redisService.cacheResult(cacheKey, data);
            
            results.push({
              step: step.step,
              action: step.action,
              data,
              source: data.source || 'api',
              success: true,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.log(`    ⚠ Error, using mock data`);
            data = getMockData(step.api, step.endpoint);
            results.push({
              step: step.step,
              action: step.action,
              data,
              source: 'mock',
              success: true,
              timestamp: new Date().toISOString(),
              note: 'Fallback to mock data due to API error',
            });
          }
        }
      } else {
        // Non-API task
        results.push({
          step: step.step,
          action: step.action,
          data: { completed: true },
          source: 'task',
          success: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return {
      completed: true,
      results,
      summary: `Completed ${results.length} steps successfully`,
    };
  } catch (error) {
    console.error('Executor error:', error.message);
    return {
      completed: false,
      error: error.message,
      results: [],
    };
  }
}

/**
 * Run the Analyst agent to analyze execution results
 * @param {object} data - Execution results
 * @returns {Promise<string>} - Analysis (JSON)
 */
export async function runAnalyst(data) {
  console.log('🔍 Analyst is analyzing...');
  
  const userMessage = `Analyze the following research data:

${JSON.stringify(data, null, 2)}

Provide a comprehensive analysis identifying:
- Key findings and insights
- Patterns and trends
- Anomalies or concerns
- Data quality assessment
- Confidence levels
- Actionable recommendations

Respond in JSON format.`;

  try {
    const response = await anthropicService.callClaude(
      prompts.ANALYST,
      userMessage
    );
    return response;
  } catch (error) {
    console.error('Analyst error:', error.message);
    throw error;
  }
}

/**
 * Run the Critic agent to evaluate the research
 * @param {string} report - The research findings
 * @returns {Promise<string>} - Critique with learning_for_memory (JSON)
 */
export async function runCritic(report) {
  console.log('🧐 Critic is reviewing...');
  
  const userMessage = `Critically evaluate this research:

${typeof report === 'string' ? report : JSON.stringify(report, null, 2)}

Provide a thorough critique including:
- Strengths and weaknesses
- Limitations and biases
- Alternative interpretations
- Unanswered questions
- Suggestions for improvement
- **MOST IMPORTANT**: learning_for_memory - What key lesson should we remember for next time?

**You MUST include a "learning_for_memory" field with a clear, actionable insight.**

Respond in JSON format.`;

  try {
    const response = await anthropicService.callClaude(
      prompts.CRITIC,
      userMessage
    );
    return response;
  } catch (error) {
    console.error('Critic error:', error.message);
    throw error;
  }
}

/**
 * Run the Reporter agent to generate final report
 * @param {object} findings - All research findings
 * @returns {Promise<string>} - Comprehensive report
 */
export async function runReporter(findings) {
  console.log('📝 Reporter is writing...');
  
  const userMessage = `Generate a comprehensive research report based on:

${JSON.stringify(findings, null, 2)}

Create a well-structured, professional report that includes:
1. Executive Summary
2. Research Objectives
3. Methodology
4. Key Findings
5. Analysis and Insights
6. Critical Assessment
7. Recommendations
8. Conclusion

Make it clear, actionable, and professional.`;

  try {
    const response = await anthropicService.callClaude(
      prompts.REPORTER,
      userMessage
    );
    return response;
  } catch (error) {
    console.error('Reporter error:', error.message);
    throw error;
  }
}
