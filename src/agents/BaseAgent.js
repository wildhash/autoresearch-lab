import { anthropicService } from '../services/anthropic.js';
import { redisService } from '../services/redis.js';

export class BaseAgent {
  constructor(name, systemPrompt) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.conversationHistory = [];
  }

  async execute(input, context = {}) {
    console.log(`\n🤖 ${this.name} executing...`);
    
    try {
      // Check cache for similar queries
      const cacheKey = `agent:${this.name}:${this.hashInput(input)}`;
      const cached = await redisService.getCached(cacheKey);
      
      if (cached && context.useCache !== false) {
        console.log(`✓ ${this.name} using cached response`);
        return cached;
      }

      // Prepare message with context
      const message = this.prepareMessage(input, context);
      
      // Send to Claude
      const response = await anthropicService.sendMessage(
        this.systemPrompt,
        message
      );

      // Store learning
      await this.storeLearning(input, response, context);

      // Cache response
      await redisService.cache(cacheKey, response, 3600);

      console.log(`✓ ${this.name} completed`);
      return response;
    } catch (error) {
      console.error(`✗ ${this.name} error:`, error.message);
      throw error;
    }
  }

  prepareMessage(input, context) {
    let message = input;
    
    if (context.previousResults) {
      message += `\n\nPrevious Results:\n${JSON.stringify(context.previousResults, null, 2)}`;
    }
    
    if (context.learnings && context.learnings.length > 0) {
      message += `\n\nRelevant Learnings:\n${context.learnings.join('\n')}`;
    }

    return message;
  }

  async storeLearning(input, output, context) {
    const learning = {
      agent: this.name,
      input,
      output,
      context,
      timestamp: new Date().toISOString(),
    };

    const learningId = `${this.name}_${Date.now()}`;
    await redisService.storeLearning(learningId, learning);
  }

  hashInput(input) {
    // Simple hash function for caching
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  async getLearnings() {
    const allLearnings = await redisService.getAllLearnings();
    return allLearnings.filter(l => l.agent === this.name);
  }
}
