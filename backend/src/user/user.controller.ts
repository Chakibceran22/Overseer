import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthResponseDTO } from './dto/auth-reponse.dto';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }
    @Post('/login')
    async login(
        @Body() loginDTO: AuthDTO,
        @Res({ passthrough: true }) res: Response
    ): Promise<AuthResponseDTO> {
        const { accessToken, refreshToken } = await this.userService.login(loginDTO.email, loginDTO.password)
        this.setRefreshCookie(res, refreshToken)
        return {
            accessToken,
            success: true,
            message: "Login successful"
        }

    }

    @Post('/signup')
    async signup(@Body() signupDTO: AuthDTO,
        @Res({ passthrough: true }) res: Response): Promise<AuthResponseDTO> {
        const { accessToken, refreshToken } = await this.userService.signup(signupDTO.email, signupDTO.password)
        this.setRefreshCookie(res, refreshToken)
        return {
            accessToken,
            success: true,
            message: "Signup Successful"
        }
    }

    @Post('/refresh')
    async refeshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ): Promise<AuthResponseDTO> {
        const token = req.cookies?.['refreshToken'];
        const { accessToken, refreshToken } = await this.userService.refreshToken(token)
        this.setRefreshCookie(res, refreshToken)
        return {
            accessToken,
            success: true,
            message: "Token refreshed successfully"
        }
    }

    @Post('/logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ): Promise<AuthResponseDTO> {
        const token = req.cookies?.['refreshToken'];
        await this.userService.logout(token)
        this.clearCookie(res)
        return { accessToken: '', success: true, message: 'Logged out' };
    }


    private setRefreshCookie(res: Response, token: string) {
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/user',
            maxAge: 24 * 60 * 60 * 1000,
        });
    }

    private clearCookie(res: Response ) {
         res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/user',
        });
    }

}
