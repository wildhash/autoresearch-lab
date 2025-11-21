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

      // Suppress error events during connection attempt
      // Errors are handled by the catch block below
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
    // In-memory storage for mock mode
    const storage = new Map();
    const lists = new Map();
    
    return {
      get: async (key) => storage.get(key) || null,
      set: async (key, value) => {
        storage.set(key, value);
        return 'OK';
      },
      setEx: async (key, ttl, value) => {
        storage.set(key, value);
        return 'OK';
      },
      del: async (key) => {
        storage.delete(key);
        return 1;
      },
      exists: async (key) => storage.has(key) ? 1 : 0,
      expire: async (key, seconds) => 1,
      keys: async (pattern) => {
        // Use global replace to handle all asterisks, not just the first one
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return Array.from(storage.keys()).filter(key => regex.test(key));
      },
      lPush: async (key, ...values) => {
        if (!lists.has(key)) lists.set(key, []);
        const list = lists.get(key);
        // Reverse and push individually for better performance with large arrays
        for (let i = values.length - 1; i >= 0; i--) {
          list.unshift(values[i]);
        }
        return list.length;
      },
      lRange: async (key, start, stop) => {
        const list = lists.get(key) || [];
        if (stop === -1) return list.slice(start);
        return list.slice(start, stop + 1);
      },
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

  // Topic-based learning methods for Reflexion Loop
  async getLearnings(topic) {
    try {
      const key = `learnings:${topic}`;
      const learnings = await this.client.lRange(key, 0, -1);
      return learnings.map(l => {
        try {
          return JSON.parse(l);
        } catch {
          return l;
        }
      });
    } catch (error) {
      console.error('Get learnings error:', error.message);
      return [];
    }
  }

  async saveLearning(topic, insight) {
    try {
      const key = `learnings:${topic}`;
      const learning = {
        insight,
        timestamp: new Date().toISOString(),
      };
      await this.client.lPush(key, JSON.stringify(learning));
      console.log(`💾 Saved learning for topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Save learning error:', error.message);
      return false;
    }
  }

  // Cache result with key and data
  async cacheResult(key, data) {
    await this.cache(key, data, 3600);
  }

  async getCachedResult(key) {
    return await this.getCached(key);
  }
}

export const redisService = new RedisService();
