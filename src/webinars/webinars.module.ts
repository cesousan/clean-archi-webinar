import { Module } from '@nestjs/common';

import { CommonModule } from '@webinar/core/common.module';
import {
  IDateGenerator,
  IIDGenerator,
  I_DATE_GENERATOR,
  I_ID_GENERATOR,
} from '@webinar/core/ports';

import { InMemoryWebinarRepository } from './adapters/webinar-repository.in-memory';
import { WebinarsController } from './controllers/webinars.controller';
import { IWebinarRepository, I_WEBINAR_REPOSITORY } from './ports';
import { OrganizeWebinar } from './usecases/organize-webinar';
import { ChangeSeats } from './usecases/change-seats';

@Module({
  imports: [CommonModule],
  controllers: [WebinarsController],
  providers: [
    {
      provide: I_WEBINAR_REPOSITORY,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: OrganizeWebinar,
      inject: [I_WEBINAR_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (
        repository: IWebinarRepository,
        idGenerator: IIDGenerator,
        dateGenerator: IDateGenerator,
      ) => new OrganizeWebinar(repository, idGenerator, dateGenerator),
    },
    {
      provide: ChangeSeats,
      inject: [I_WEBINAR_REPOSITORY],
      useFactory: (repository: IWebinarRepository) =>
        new ChangeSeats(repository),
    },
  ],
  exports: [I_WEBINAR_REPOSITORY],
})
export class WebinarsModule {}
