import Redis from 'ioredis';

import { redis } from '@config/redis';

import { ISetRedisDto } from '../dtos/ISetRedisDto';
import { IRedisProvider } from '../model/IRedisProvider';

export class RedisProvider implements IRedisProvider {
  private redis: Redis.Redis = new Redis(redis);

  public async get(key: string): Promise<string | undefined> {
    return (await this.redis.get(key)) || undefined;
  }

  public async set({
    key,
    value,
    time,
    option,
  }: ISetRedisDto): Promise<string> {
    await this.redis.set(key, value, option, time);
    return key;
  }

  public async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key) && key.length === 0) return;
    await this.redis.del(key);
  }

  public async keys(pattern: string): Promise<string[]> {
    const keys = await this.redis.keys(`${redis.keyPrefix}${pattern}*`);
    return keys.map(key => key.replace(`${redis.keyPrefix}`, ''));
  }
}
