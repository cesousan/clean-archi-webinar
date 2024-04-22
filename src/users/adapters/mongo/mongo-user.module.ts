import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { MongoUser } from './mongo-user';
import { I_USER_REPOSITORY } from '@webinar/users/ports';
import { MongoUserRepository } from './user-repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.CollectionName,
        schema: MongoUser.Schema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      inject: [getModelToken(MongoUser.CollectionName)],
      useFactory: (model) => new MongoUserRepository(model),
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class MongoUserModule {}
