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

  /**
   * Helper function to call Claude with system prompt and user message
   * Extracts JSON content reliably from the response
   * @param {string} systemPrompt - System instructions for Claude
   * @param {string} userMessage - User message/query
   * @param {string} model - Model to use (defaults to config)
   * @returns {Promise<string>} - Claude's response
   */
  async callClaude(systemPrompt, userMessage, model = null) {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Check API key.');
    }

    try {
      const response = await this.client.messages.create({
        model: model || config.anthropic.model,
        max_tokens: config.anthropic.maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      let content = response.content[0].text;

      // Try to extract JSON if present in the response
      // Claude often wraps JSON in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          // Validate it's proper JSON
          JSON.parse(jsonMatch[1]);
          return jsonMatch[1].trim();
        } catch {
          // If not valid JSON, return original content
        }
      }

      // Try to find JSON object in the content
      const jsonObjMatch = content.match(/\{[\s\S]*\}/);
      if (jsonObjMatch) {
        try {
          // Validate it's proper JSON
          JSON.parse(jsonObjMatch[0]);
          return jsonObjMatch[0];
        } catch {
          // If not valid JSON, return original content
        }
      }

      // Return as-is if no JSON extraction needed
      return content;
    } catch (error) {
      console.error('Anthropic API error:', error.message);
      throw error;
    }
  }
}

export const anthropicService = new AnthropicService();
