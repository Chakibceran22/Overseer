import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ArgonModule } from 'src/argon/argon.module';
import { JwtUserModule } from 'src/jwt-user/jwt-user.module';
import { UserRepo } from './user.repo';

@Module({
  providers: [UserService, UserRepo],
  controllers: [UserController],
  imports : [ArgonModule, JwtUserModule]
})
export class UserModule {}
