import 'express';

// Payload attached by JwtUserGuard after verifying the access token.
// Access tokens carry only sub/email (no jti) — see JwtUserService.signToken.
export interface AccessUser {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

declare module 'express' {
  interface Request {
    user?: AccessUser;
  }
}
