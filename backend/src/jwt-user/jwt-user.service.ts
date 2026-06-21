import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUserService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ){}

    async signToken(userId: string, username: string) {
        const payload = { sub: userId, username};

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload,{
                secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn:'24h'
            }),
            this.jwt.signAsync(payload,{
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn:'24h'
            })
        ])
        return {
            accessToken,
            refreshToken
        }
    }
}
