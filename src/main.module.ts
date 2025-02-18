import { Module } from '@nestjs/common';
import { AppModule } from './core/app.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AppModule, ConfigModule.forRoot({})],
})
export class MainModule {}
