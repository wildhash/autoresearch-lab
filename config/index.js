import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Anthropic Configuration
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // API Keys
  apis: {
    trmLabs: {
      apiKey: process.env.TRM_LABS_API_KEY,
      baseUrl: 'https://api.trmlabs.com',
    },
    finsterAi: {
      apiKey: process.env.FINSTER_AI_API_KEY,
      baseUrl: 'https://api.finster.ai',
    },
    senso: {
      apiKey: process.env.SENSO_API_KEY,
      postmanKey: process.env.POSTMAN_API_KEY,
      baseUrl: 'https://api.senso.com',
    },
  },

  // Skyflow Security
  skyflow: {
    vaultId: process.env.SKYFLOW_VAULT_ID,
    vaultUrl: process.env.SKYFLOW_VAULT_URL,
    apiKey: process.env.SKYFLOW_API_KEY,
  },

  // Sanity CMS
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
  },

  // AWS Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  // Application Configuration
  app: {
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};
