import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.contant';
import Redis from 'ioredis';

@Injectable()
export class SessionService {
    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) { }

    private key(userID: string, jti: string) {
        return `refresh:${userID}:${jti}`
    }

    async create(userID: string, jti: string, ttlSeconds: number) {
        await this.redis.set(this.key(userID, jti), '1', 'EX', ttlSeconds)
    }

    async exists(userID: string, jti: string) {
        return (await this.redis.exists(this.key(userID, jti))) === 1;
    }

    async revoke(userId: string, jti: string) {
        await this.redis.del(this.key(userId, jti));
    }
}
