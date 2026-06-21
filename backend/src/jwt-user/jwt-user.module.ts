import { Module } from '@nestjs/common';
import { JwtUserService } from './jwt-user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [JwtUserService],
  exports: [JwtUserService],
  imports:[JwtModule]
})
export class JwtUserModule {}
