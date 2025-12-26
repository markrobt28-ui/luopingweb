import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis | null = null;
  private enabled: boolean = true;

  constructor(private configService: ConfigService) {
    const redisEnabled = this.configService.get<string>('REDIS_ENABLED', 'true');
    if (redisEnabled === 'false') {
      this.enabled = false;
      console.log('Redis is disabled (REDIS_ENABLED=false)');
      return;
    }

    const host = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = this.configService.get<number>('REDIS_DB', 0);

    this.client = new Redis({
      host,
      port,
      password,
      db,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 500);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err.message);
      // 不抛出错误，让应用继续运行
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err) {
      console.error('Redis set error:', err);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;
    try {
      const value = await this.client.get(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (err) {
      console.error('Redis get error:', err);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis del error:', err);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.enabled || !this.client) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (err) {
      console.error('Redis exists error:', err);
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.expire(key, seconds);
    } catch (err) {
      console.error('Redis expire error:', err);
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.enabled || !this.client) return -1;
    try {
      return await this.client.ttl(key);
    } catch (err) {
      console.error('Redis ttl error:', err);
      return -1;
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }
}
