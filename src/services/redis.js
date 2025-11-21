import { createClient } from 'redis';
import { config } from '../../config/index.js';

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.useMock = false;
  }

  async connect() {
    if (this.isConnected) {
      return this.client;
    }

    // Check if Redis is configured
    if (!config.redis.host) {
      console.log('⚠ Redis not configured, using mock client');
      this.client = this.getMockClient();
      this.useMock = true;
      this.isConnected = true;
      return this.client;
    }

    try {
      const client = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
          connectTimeout: 3000,
        },
        password: config.redis.password,
      });

      // Suppress error events
      client.on('error', () => {});

      // Set a timeout for connection
      const connectPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      await Promise.race([connectPromise, timeoutPromise]);

      console.log('✓ Redis connected');
      this.client = client;
      this.isConnected = true;
      return this.client;
    } catch (error) {
      console.log('⚠ Redis not available, using mock client');
      
      // Clean up failed client
      if (this.client) {
        try {
          await this.client.quit();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      
      this.client = this.getMockClient();
      this.useMock = true;
      this.isConnected = true;
      return this.client;
    }
  }

  getMockClient() {
    return {
      get: async (key) => null,
      set: async (key, value) => 'OK',
      setEx: async (key, ttl, value) => 'OK',
      del: async (key) => 1,
      exists: async (key) => 0,
      expire: async (key, seconds) => 1,
      keys: async (pattern) => [],
      quit: async () => {},
    };
  }

  async disconnect() {
    if (this.client && this.isConnected && !this.useMock) {
      try {
        await this.client.quit();
        console.log('Redis disconnected');
      } catch (error) {
        // Ignore errors during disconnect
      }
    }
    this.isConnected = false;
  }

  // Cache operations
  async cache(key, value, ttl = 3600) {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error.message);
    }
  }

  async getCached(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  }

  // Learning storage
  async storeLearning(id, learning) {
    const key = `learning:${id}`;
    await this.cache(key, learning, 86400); // 24 hours
  }

  async getLearning(id) {
    const key = `learning:${id}`;
    return await this.getCached(key);
  }

  async getAllLearnings() {
    try {
      const keys = await this.client.keys('learning:*');
      const learnings = [];
      for (const key of keys) {
        const learning = await this.getCached(key);
        if (learning) learnings.push(learning);
      }
      return learnings;
    } catch (error) {
      console.error('Get all learnings error:', error.message);
      return [];
    }
  }
}

export const redisService = new RedisService();
