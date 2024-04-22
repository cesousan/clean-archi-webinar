import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { I_PARTICIPATION_REPOSITORY } from '@webinar/webinars/ports/participation-repository.interface';

import { MongoParticipation } from './mongo-participation';
import { MongoParticipationRepository } from './participation-repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoParticipation.CollectionName,
        schema: MongoParticipation.Schema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_PARTICIPATION_REPOSITORY,
      inject: [getModelToken(MongoParticipation.CollectionName)],
      useFactory: (model) => new MongoParticipationRepository(model),
    },
  ],
  exports: [I_PARTICIPATION_REPOSITORY],
})
export class MongoParticipationModule {}
