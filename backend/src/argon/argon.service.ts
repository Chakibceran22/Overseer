import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm, hash, Options, verify } from '@node-rs/argon2';

@Injectable()
export class ArgonService {
    private readonly options: Options;

    constructor(configService: ConfigService) {
        this.options = {
            algorithm: Algorithm.Argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,
            secret: Buffer.from(configService.getOrThrow<string>('HASH_SECRET'))

        }
    }

    hashPlain(plain: string) {
        return hash(plain, this.options)
    }

    verifyHash(plain: string, digest: string) {
        return verify(digest, plain, { secret: this.options.secret });
    }


}
