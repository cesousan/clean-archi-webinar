import * as request from 'supertest';

import { e2eUsers } from './seeds/user-seeds';
import { e2eWebinars } from './seeds/webinar-seeds';
import { TestApp } from './utils/test-app';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '@webinar/webinars/ports/participation-repository.interface';
import { Participation } from '@webinar/webinars/entities/participation.entity';
import { subDays } from 'date-fns';
import { ParticipationFixture } from './fixtures/participation-fixture';

describe('Feature: Cancel a reservation', () => {
  let app: TestApp;
  const { johnDoe, janeDoe } = e2eUsers;
  const { webinarJane: webinar1 } = e2eWebinars;
  const webinarId = webinar1.entity.props.id;
  const authToken = johnDoe.authToken;
  const johnDoeParticipation = new Participation({
    userId: johnDoe.entity.props.id,
    webinarId,
    joinedAt: subDays(webinar1.entity.props.startDate, 5),
  });
  const participationFixture = new ParticipationFixture(johnDoeParticipation);
  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe, janeDoe, webinar1, participationFixture]);
  });

  afterEach(async () => {
    await app.teardown();
  });
  describe('Scenario: User is authenticated', () => {
    it('should cancel the reservation', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${webinarId}/bookings`)
        .set('Authorization', authToken);

      expect(result.status).toEqual(204);

      const participationRepository = app.get<IParticipationRepository>(
        I_PARTICIPATION_REPOSITORY,
      );

      const participation = await participationRepository.findOneParticipant(
        e2eUsers.johnDoe.entity.props.id,
        webinarId,
      );
      expect(participation).toBeNull();
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/webinars/${webinarId}/bookings`,
      );

      expect(result.status).toEqual(403);
    });
  });
});
