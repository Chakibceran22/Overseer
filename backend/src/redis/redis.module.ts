import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.contant';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session.service';
import Redis from 'ioredis';


@Global()
@Module({
    providers:[{
        provide: REDIS_CLIENT,
        inject:[ConfigService],
        useFactory: (config: ConfigService) => {
            return new Redis(config.getOrThrow<string>('REDIS_URL'));
        }
    }, SessionService],
    exports:[REDIS_CLIENT, SessionService]

})
export class RedisModule implements OnApplicationShutdown {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

    async onApplicationShutdown() {
        await this.redis.quit()
    }
}
