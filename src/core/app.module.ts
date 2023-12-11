import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { APP_DEPENDENCIES, FEATURES_PROVIDERS } from './providers';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [...APP_DEPENDENCIES, ...FEATURES_PROVIDERS],
})
export class AppModule {}
