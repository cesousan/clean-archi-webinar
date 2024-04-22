import { Participation } from '@webinar/webinars/entities/participation.entity';
import { IFixture } from '../utils/fixture';
import { TestApp } from '../utils/test-app';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '@webinar/webinars/ports/participation-repository.interface';

export class ParticipationFixture implements IFixture {
  constructor(private entity: Participation) {}

  async load(app: TestApp): Promise<void> {
    const participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
    await participationRepository.create(this.entity);
  }
}
