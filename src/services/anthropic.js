import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';

class AnthropicService {
  constructor() {
    this.client = null;
  }

  initialize() {
    if (!config.anthropic.apiKey) {
      console.warn('⚠ Anthropic API key not configured');
      return;
    }

    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
    console.log('✓ Anthropic client initialized');
  }

  async sendMessage(systemPrompt, userMessage, options = {}) {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Check API key.');
    }

    try {
      const response = await this.client.messages.create({
        model: options.model || config.anthropic.model,
        max_tokens: options.maxTokens || config.anthropic.maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error.message);
      throw error;
    }
  }

  async sendConversation(systemPrompt, messages, options = {}) {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Check API key.');
    }

    try {
      const response = await this.client.messages.create({
        model: options.model || config.anthropic.model,
        max_tokens: options.maxTokens || config.anthropic.maxTokens,
        system: systemPrompt,
        messages: messages,
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error.message);
      throw error;
    }
  }
}

export const anthropicService = new AnthropicService();
