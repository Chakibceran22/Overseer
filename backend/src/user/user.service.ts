import { HttpException, Inject, Injectable, InternalServerErrorException, LoggerService, UnauthorizedException } from '@nestjs/common';
import { ArgonService } from 'src/argon/argon.service';
import { UserRepo } from './user.repo';
import { JwtUserService } from 'src/jwt-user/jwt-user.service';
import { NewUser } from 'src/db/schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SessionService } from 'src/redis/session.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
    constructor(
        private readonly argonService: ArgonService,
        private readonly userRepo: UserRepo,
        private readonly jwtUserService: JwtUserService,
        private readonly session: SessionService,
        private readonly config: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    private get refreshTtl(): number {
        return this.config.getOrThrow<number>('JWT_REFRESH_TTL');
    }

    async login(email: string, password: string) {
        try {
            const user = await this.userRepo.findByEmail(email)
            if (!user) {
                throw new UnauthorizedException('Invalid Credentials')
            }
            const hash = user?.password

            const verificationResponse = await this.argonService.verifyHash(password, hash)

            if (!verificationResponse) {
                throw new UnauthorizedException('Invalid Credentials')
            }

            const { accessToken, refreshToken, jti } = await this.jwtUserService.signToken(user.id, user.email)
            await this.session.create(user.id, jti, this.refreshTtl)
            return { accessToken, refreshToken }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(error);
            throw new InternalServerErrorException();
        }

    }

    async signup(email: string, password: string) {
        try {
            const hashedPassword = await this.argonService.hashPlain(password);
            const data: NewUser = {
                email: email,
                password: hashedPassword
            }
            
            const user = await this.userRepo.createUser(data)

            const { accessToken, refreshToken, jti } = await this.jwtUserService.signToken(user.id, user.email)
            await this.session.create(user.id, jti, this.refreshTtl)
            return { accessToken, refreshToken }

        } catch (error: any) {
            if (error?.code === '23505') {
                this.logger.warn(`Signup blocked: duplicate email "${email}"`);
                throw new InternalServerErrorException();
            }
            this.logger.error(error);
            throw new InternalServerErrorException();
        }

    }

    async refreshToken(token: string) {
        if (!token) {
            throw new UnauthorizedException("No Refresh token found")
        }

        try {
            const payload = await this.jwtUserService.verifyRefresh(token);

            // is this session still alive? (revoked by logout, or already rotated away)
            if (!(await this.session.exists(payload.sub, payload.jti))) {
                throw new UnauthorizedException('Session revoked');
            }

            // rotate: kill the old jti, mint + store a new one
            await this.session.revoke(payload.sub, payload.jti);
            const { accessToken, refreshToken, jti } = await this.jwtUserService.signToken(payload.sub, payload.email);
            await this.session.create(payload.sub, jti, this.refreshTtl);

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new UnauthorizedException('Invalid or expired token')
        }

    }

    async logout(token?: string) {
        if (!token) return;
        try {
            const payload = await this.jwtUserService.verifyRefresh(token);
            await this.session.revoke(payload.sub, payload.jti)
        } catch (error) {
            this.logger.warn('Logout: could not revoke session (invalid or expired token)');
        }
    }


}
