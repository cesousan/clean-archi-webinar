import { Module } from '@nestjs/common';

import { MongoUserModule } from './adapters/mongo/mongo-user.module';

@Module({
  imports: [MongoUserModule],
  exports: [MongoUserModule],
})
export class UsersModule {}
