import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-user.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtUserService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async signToken(userId: string, email: string) {
        const jti = randomUUID();
        const accessPayload = { sub: userId, email };
        const refreshPayload = { sub: userId, email, jti };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(accessPayload, {
                secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: this.config.getOrThrow<number>('JWT_ACCESS_TTL')
            }),
            this.jwt.signAsync(refreshPayload, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.config.getOrThrow<number>('JWT_REFRESH_TTL')
            })
        ])
        return {
            accessToken,
            refreshToken,
            jti
        }
    }

    async verifyAccess(token: string) {
        return this.jwt.verifyAsync(token, {
            secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        });
    }

    async verifyRefresh(token: string):Promise<JwtPayload> {
        return this.jwt.verifyAsync<JwtPayload>(token, {
            secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        });
    }



}
