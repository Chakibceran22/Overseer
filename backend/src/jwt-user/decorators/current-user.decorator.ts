import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessUser } from '../../types/express';


export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessUser | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user;
  },
);
