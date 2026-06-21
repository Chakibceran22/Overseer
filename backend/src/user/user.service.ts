import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ArgonService } from 'src/argon/argon.service';
import { UserRepo } from './user.repo';
import { JwtUserService } from 'src/jwt-user/jwt-user.service';
import { threadId } from 'worker_threads';
import { AuthResponseDTO } from './dto/auth-reponse.dto';
import { NewUser } from 'src/db/schema';

@Injectable()
export class UserService {
    constructor(
        private readonly argonService: ArgonService,
        private readonly userRepo: UserRepo,
        private readonly jwtUserService: JwtUserService
    ) { }
    async login(username: string, password: string) {
        try {
            const user = await this.userRepo.findByUsername(username)
            if (!user) {
                throw new UnauthorizedException('Invalid Credentials')
            }
            const hash = user?.password

            const verificationResponse = await this.argonService.verifyHash(password, hash)

            if (!verificationResponse) {
                throw new UnauthorizedException('Invalid Credentials')
            }

            return await this.jwtUserService.signToken(user.id, user.username)
        } catch (error) {
            throw new InternalServerErrorException()
        }

    }

    async signup(username: string, password: string) {
        try {
            const hashedPassword = await this.argonService.hashPlain(password);
            const data: NewUser = {
                username: username,
                password: hashedPassword
            }
            const user = await this.userRepo.createUser(data)

            return await this.jwtUserService.signToken(user.id, user.username)

        } catch (error) {
            throw new InternalServerErrorException();
        }

    }
}
