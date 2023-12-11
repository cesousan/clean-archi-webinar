import { Module } from '@nestjs/common';

import {
  IAuthenticator,
  I_AUTHENTICATOR,
} from '@webinar/users/services/authenticator';
import { UsersModule } from '@webinar/users/users.module';
import { WebinarsModule } from '@webinar/webinars/webinars.module';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { CommonModule } from './common.module';
import { AuthGuard } from './guards';

@Module({
  imports: [CommonModule, WebinarsModule, UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      inject: [I_AUTHENTICATOR],
      useFactory: (authenticator: IAuthenticator) =>
        new AuthGuard(authenticator),
    },
  ],
})
export class AppModule {}
