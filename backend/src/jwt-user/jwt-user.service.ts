import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-user.interface';

@Injectable()
export class JwtUserService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async signToken(userId: string, username: string) {
        const payload = { sub: userId, username };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: '15m'
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: '24h'
            })
        ])
        return {
            accessToken,
            refreshToken
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
