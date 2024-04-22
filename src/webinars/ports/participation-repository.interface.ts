import { InjectionToken } from '@nestjs/common';
import { Participation } from '../entities/participation.entity';

export const I_PARTICIPATION_REPOSITORY: InjectionToken<IParticipationRepository> =
  Symbol('I_PARTICIPATION_REPOSITORY');

export interface IParticipationRepository {
  create(participation: Participation): Promise<void>;
  cancel(participation: Participation): Promise<void>;
  findOneParticipant(
    userId: string,
    webinarId: string,
  ): Promise<Participation | null>;
  findByWebinarId(webinarId: string): Promise<Participation[]>;
  findParticipationCount(webinarId: string): Promise<number>;
}
