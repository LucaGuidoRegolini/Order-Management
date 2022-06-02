import { ISetRedisDto } from '../dtos/ISetRedisDto';
import { IRedisProvider } from '../model/IRedisProvider';

interface IRedisKey {
  key: string;
  value: string;
}

export class FakeRedisProvider implements IRedisProvider {
  private cache: IRedisKey[] = [];

  public async get(key: string): Promise<string | undefined> {
    const resp = this.cache.find(cache => cache.key === key);

    return resp ? resp.value : undefined;
  }

  public async set({ key, value }: ISetRedisDto): Promise<string> {
    this.cache.push({ key, value });

    return key;
  }

  public async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      this.cache = this.cache.filter(cache => !key.includes(cache.key));
    } else {
      this.cache = this.cache.filter(cache => cache.key !== key);
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    const keys = this.cache.filter(cache => cache.key.includes(pattern));

    return keys.map(key => key.key);
  }
}
