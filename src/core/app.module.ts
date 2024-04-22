import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { I_USER_REPOSITORY } from '@webinar/users/ports';
import { Authenticator } from '@webinar/users/services/authenticator';
import { UsersModule } from '@webinar/users/users.module';
import { WebinarsModule } from '@webinar/webinars/webinars.module';

import { AppController } from './app.controller';
import { CommonModule } from './common.module';
import { AuthGuard } from './guards';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
    CommonModule,
    WebinarsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
      useFactory: (repository) => {
        return new Authenticator(repository);
      },
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => {
        return new AuthGuard(authenticator);
      },
    },
  ],
})
export class AppModule {}
