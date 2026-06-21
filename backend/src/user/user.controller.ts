import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthResponseDTO } from './dto/auth-reponse.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    
    constructor (private readonly userService: UserService){}
    @Post('/login')
    async login(@Body() loginDTO: AuthDTO):Promise<AuthResponseDTO>{
        return await this.userService.login(loginDTO.username, loginDTO.password)

    }

    @Post('/signup')
    async signup(@Body() signupDTO: AuthDTO): Promise<AuthResponseDTO> {
        return await this.userService.signup(signupDTO.username, signupDTO.password)
    }
}
