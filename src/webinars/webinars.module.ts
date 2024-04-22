import { Module } from '@nestjs/common';

import { CommonModule } from '@webinar/core/common.module';
import {
  IDateGenerator,
  IIDGenerator,
  I_DATE_GENERATOR,
  I_ID_GENERATOR,
  IEmailer,
  I_EMAILER,
} from '@webinar/core/ports';
import { IUserRepository, I_USER_REPOSITORY } from '@webinar/users/ports';
import { UsersModule } from '@webinar/users/users.module';

import { MongoParticipationModule, MongoWebinarModule } from './adapters/mongo';
import { WebinarsController } from './controllers/webinars.controller';
import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from './ports';
import {
  CancelReservation,
  CancelWebinar,
  ChangeDate,
  ChangeSeats,
  OrganizeWebinar,
  ReserveSeat,
} from './usecases';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    MongoWebinarModule,
    MongoParticipationModule,
  ],
  controllers: [WebinarsController],
  providers: [
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
    {
      provide: ChangeDate,
      inject: [
        I_WEBINAR_REPOSITORY,
        I_DATE_GENERATOR,
        I_PARTICIPATION_REPOSITORY,
        I_EMAILER,
        I_USER_REPOSITORY,
      ],
      useFactory: (
        repository: IWebinarRepository,
        dateGenerator: IDateGenerator,
        participationRepository: IParticipationRepository,
        mailer: IEmailer,
        userRepository: IUserRepository,
      ) =>
        new ChangeDate(
          repository,
          dateGenerator,
          participationRepository,
          mailer,
          userRepository,
        ),
    },
    {
      provide: CancelWebinar,
      inject: [
        I_WEBINAR_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_EMAILER,
        I_USER_REPOSITORY,
      ],
      useFactory: (
        repository: IWebinarRepository,
        participationRepository: IParticipationRepository,
        mailer: IEmailer,
        userRepository: IUserRepository,
      ) =>
        new CancelWebinar(
          repository,
          mailer,
          participationRepository,
          userRepository,
        ),
    },
    {
      provide: ReserveSeat,
      inject: [
        I_PARTICIPATION_REPOSITORY,
        I_DATE_GENERATOR,
        I_WEBINAR_REPOSITORY,
        I_USER_REPOSITORY,
        I_EMAILER,
      ],
      useFactory: (
        participationRepository: IParticipationRepository,
        dateProvider: IDateGenerator,
        webinarRepository: IWebinarRepository,
        userRepository: IUserRepository,
        mailer: IEmailer,
      ) =>
        new ReserveSeat(
          participationRepository,
          dateProvider,
          webinarRepository,
          userRepository,
          mailer,
        ),
    },
    {
      provide: CancelReservation,
      inject: [
        I_PARTICIPATION_REPOSITORY,
        I_EMAILER,
        I_WEBINAR_REPOSITORY,
        I_USER_REPOSITORY,
      ],
      useFactory: (
        participationRepository: IParticipationRepository,
        mailer: IEmailer,
        webinarRepository: IWebinarRepository,
        userRepository: IUserRepository,
      ) =>
        new CancelReservation(
          participationRepository,
          mailer,
          webinarRepository,
          userRepository,
        ),
    },
  ],
})
export class WebinarsModule {}
