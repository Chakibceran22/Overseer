import { HttpException, Inject, Injectable, InternalServerErrorException, LoggerService, UnauthorizedException } from '@nestjs/common';
import { ArgonService } from 'src/argon/argon.service';
import { UserRepo } from './user.repo';
import { JwtUserService } from 'src/jwt-user/jwt-user.service';
import { NewUser } from 'src/db/schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
    constructor(
        private readonly argonService: ArgonService,
        private readonly userRepo: UserRepo,
        private readonly jwtUserService: JwtUserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }
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

            return await this.jwtUserService.signToken(user.id, user.email)
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

            return await this.jwtUserService.signToken(user.id, user.email)

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
            const { accessToken, refreshToken } = await this.jwtUserService.signToken(payload.sub, payload.email)
        return {
            accessToken,
            refreshToken
        }
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token')
        }

    }

    
}
