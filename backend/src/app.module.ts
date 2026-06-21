// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { ArgonModule } from './argon/argon.module';
import * as Joi from 'joi';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        
        //postgres specific keys
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),

        //minio specific keys
        MINIO_ROOT_USER:Joi.string().required(),
        MINIO_ROOT_PASSWORD:Joi.string().required(),
        MINIO_DEFAULT_BUCKETS: Joi.string().required(),

        //hashing options
        HASH_SECRET: Joi.string().required(),// generate by this command openssl rand -base64 32
        
      }),
      validationOptions: {
        abortEarly: false,   
        allowUnknown: true,  
      }
     }),
    DbModule,
    UserModule,
    ArgonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
