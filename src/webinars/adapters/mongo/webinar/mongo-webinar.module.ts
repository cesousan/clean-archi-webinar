import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { MongoWebinar } from './mongo-webinar';
import { MongoWebinarRepository } from './webinar-repository.mongo';
import { I_WEBINAR_REPOSITORY } from '@webinar/webinars/ports';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoWebinar.CollectionName,
        schema: MongoWebinar.Schema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_WEBINAR_REPOSITORY,
      inject: [getModelToken(MongoWebinar.CollectionName)],
      useFactory: (model) => new MongoWebinarRepository(model),
    },
  ],
  exports: [I_WEBINAR_REPOSITORY],
})
export class MongoWebinarModule {}
