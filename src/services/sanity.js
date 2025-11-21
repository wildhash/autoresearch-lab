import { createClient } from '@sanity/client';
import { config } from '../../config/index.js';

class SanityService {
  constructor() {
    this.client = null;
  }

  initialize() {
    if (!config.sanity.projectId) {
      console.warn('⚠ Sanity CMS not configured');
      return;
    }

    this.client = createClient({
      projectId: config.sanity.projectId,
      dataset: config.sanity.dataset,
      token: config.sanity.token,
      apiVersion: config.sanity.apiVersion,
      useCdn: false,
    });

    console.log('✓ Sanity CMS initialized');
  }

  async storeKnowledge(document) {
    if (!this.client) {
      console.warn('Sanity client not initialized');
      return null;
    }

    try {
      const result = await this.client.create({
        _type: 'knowledge',
        ...document,
        createdAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      console.error('Sanity store error:', error.message);
      return null;
    }
  }

  async queryKnowledge(query) {
    if (!this.client) {
      console.warn('Sanity client not initialized');
      return [];
    }

    try {
      const results = await this.client.fetch(query);
      return results;
    } catch (error) {
      console.error('Sanity query error:', error.message);
      return [];
    }
  }

  async getRecentKnowledge(limit = 10) {
    const query = `*[_type == "knowledge"] | order(createdAt desc)[0...${limit}]`;
    return await this.queryKnowledge(query);
  }

  async searchKnowledge(searchTerm) {
    const query = `*[_type == "knowledge" && (title match "${searchTerm}*" || content match "${searchTerm}*")]`;
    return await this.queryKnowledge(query);
  }
}

export const sanityService = new SanityService();
