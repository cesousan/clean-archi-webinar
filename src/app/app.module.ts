import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { APP_DEPENDENCIES, FEATURES_PROVIDERS } from './providers';
import { organizeWebinarProvider } from './providers/organize-webinar.provider';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [...APP_DEPENDENCIES, organizeWebinarProvider],
})
export class AppModule {}
