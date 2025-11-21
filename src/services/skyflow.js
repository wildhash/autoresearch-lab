import axios from 'axios';
import { config } from '../../config/index.js';

class SkyflowService {
  constructor() {
    this.client = null;
  }

  initialize() {
    if (!config.skyflow.vaultUrl || !config.skyflow.apiKey) {
      console.warn('⚠ Skyflow not configured');
      return;
    }

    this.client = axios.create({
      baseURL: config.skyflow.vaultUrl,
      headers: {
        'Authorization': `Bearer ${config.skyflow.apiKey}`,
        'Content-Type': 'application/json',
        'X-Skyflow-Vault-Id': config.skyflow.vaultId,
      },
    });

    console.log('✓ Skyflow security initialized');
  }

  async secureData(data, tableName = 'secure_data') {
    if (!this.client) {
      console.warn('Skyflow client not initialized');
      return { success: false, error: 'Not configured' };
    }

    try {
      const response = await this.client.post(`/v1/vaults/${config.skyflow.vaultId}/${tableName}`, {
        records: [{ fields: data }],
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Skyflow secure error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async retrieveData(skyflowId, tableName = 'secure_data') {
    if (!this.client) {
      console.warn('Skyflow client not initialized');
      return null;
    }

    try {
      const response = await this.client.get(`/v1/vaults/${config.skyflow.vaultId}/${tableName}/${skyflowId}`);
      return response.data;
    } catch (error) {
      console.error('Skyflow retrieve error:', error.message);
      return null;
    }
  }

  async tokenize(data) {
    if (!this.client) {
      console.warn('Skyflow client not initialized');
      return null;
    }

    try {
      const response = await this.client.post(`/v1/vaults/${config.skyflow.vaultId}/tokenize`, data);
      return response.data;
    } catch (error) {
      console.error('Skyflow tokenize error:', error.message);
      return null;
    }
  }

  async detokenize(token) {
    if (!this.client) {
      console.warn('Skyflow client not initialized');
      return null;
    }

    try {
      const response = await this.client.post(`/v1/vaults/${config.skyflow.vaultId}/detokenize`, { token });
      return response.data;
    } catch (error) {
      console.error('Skyflow detokenize error:', error.message);
      return null;
    }
  }
}

export const skyflowService = new SkyflowService();
