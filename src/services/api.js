import axios from 'axios';
import { config } from '../../config/index.js';

class APIService {
  constructor() {
    this.trmLabs = null;
    this.finsterAi = null;
    this.senso = null;
  }

  initialize() {
    // TRM Labs API client
    if (config.apis.trmLabs.apiKey) {
      this.trmLabs = axios.create({
        baseURL: config.apis.trmLabs.baseUrl,
        headers: {
          'Authorization': `Bearer ${config.apis.trmLabs.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('✓ TRM Labs API initialized');
    }

    // Finster AI API client
    if (config.apis.finsterAi.apiKey) {
      this.finsterAi = axios.create({
        baseURL: config.apis.finsterAi.baseUrl,
        headers: {
          'Authorization': `Bearer ${config.apis.finsterAi.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('✓ Finster AI API initialized');
    }

    // Senso API client (via Postman)
    if (config.apis.senso.apiKey) {
      this.senso = axios.create({
        baseURL: config.apis.senso.baseUrl,
        headers: {
          'X-Api-Key': config.apis.senso.apiKey,
          'X-Postman-Key': config.apis.senso.postmanKey,
          'Content-Type': 'application/json',
        },
      });
      console.log('✓ Senso API initialized');
    }
  }

  // TRM Labs Methods
  async queryTRMLabs(endpoint, params = {}) {
    if (!this.trmLabs) {
      console.warn('TRM Labs API not configured');
      return { error: 'API not configured' };
    }

    try {
      const response = await this.trmLabs.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('TRM Labs API error:', error.message);
      return { error: error.message };
    }
  }

  // Finster AI Methods
  async queryFinsterAI(endpoint, data = {}) {
    if (!this.finsterAi) {
      console.warn('Finster AI API not configured');
      return { error: 'API not configured' };
    }

    try {
      const response = await this.finsterAi.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Finster AI API error:', error.message);
      return { error: error.message };
    }
  }

  // Senso Methods
  async querySenso(endpoint, params = {}) {
    if (!this.senso) {
      console.warn('Senso API not configured');
      return { error: 'API not configured' };
    }

    try {
      const response = await this.senso.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Senso API error:', error.message);
      return { error: error.message };
    }
  }

  // General query method that can route to appropriate API
  async query(apiName, endpoint, params = {}) {
    switch (apiName.toLowerCase()) {
      case 'trmlabs':
        return await this.queryTRMLabs(endpoint, params);
      case 'finsterai':
        return await this.queryFinsterAI(endpoint, params);
      case 'senso':
        return await this.querySenso(endpoint, params);
      default:
        return { error: `Unknown API: ${apiName}` };
    }
  }
}

export const apiService = new APIService();
