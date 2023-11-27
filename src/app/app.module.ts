import { Module } from '@nestjs/common';

import {
  CurrentDateGenerator,
  InMemoryWebinarRepository,
  RandomIDGenerator,
} from '../adapters';
import { OrganizeWebinar } from '../usecases/organize-webinar';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    CurrentDateGenerator,
    RandomIDGenerator,
    InMemoryWebinarRepository,
    {
      provide: OrganizeWebinar,
      inject: [
        InMemoryWebinarRepository,
        RandomIDGenerator,
        CurrentDateGenerator,
      ],
      useFactory: (
        repository: InMemoryWebinarRepository,
        idGenerator: RandomIDGenerator,
        dateGenerator: CurrentDateGenerator,
      ) => new OrganizeWebinar(repository, idGenerator, dateGenerator),
    },
  ],
})
export class AppModule {}
