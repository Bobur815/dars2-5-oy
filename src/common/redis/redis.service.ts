
import {
  Injectable,
  Inject,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClientType,
  ) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ){
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }


  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis client...');
    await this.client.disconnect();
  }
}
