import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtUserService } from './jwt-user.service';

@Injectable()
export class JwtUserGuard implements CanActivate {
  constructor(
    private readonly jwtUserService: JwtUserService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearer(req);
    if (!token) throw new UnauthorizedException('No access token')

      try {
        req.user = await this.jwtUserService.verifyAccess(token)
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token')
        
      }

  }

  private extractBearer(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
