import * as request from 'supertest';

import { Participation } from '@webinar/webinars/entities/participation.entity';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '@webinar/webinars/ports/participation-repository.interface';

import { e2eUsers } from './seeds/user-seeds';
import { e2eWebinars } from './seeds/webinar-seeds';
import { TestApp } from './utils/test-app';

describe('Feature: Reserve a seat', () => {
  let app: TestApp;
  const { johnDoe, janeDoe } = e2eUsers;
  const { webinarJane: webinar1 } = e2eWebinars;
  const webinarId = webinar1.entity.props.id;
  const authToken = johnDoe.authToken;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe, janeDoe, webinar1]);
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('Scenario: User is authenticated', () => {
    it('should add user to webinar', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/bookings`)
        .set('Authorization', authToken);

      expect(result.status).toEqual(201);
      const participationRepository = app.get<IParticipationRepository>(
        I_PARTICIPATION_REPOSITORY,
      );

      const participation = await participationRepository.findOneParticipant(
        e2eUsers.johnDoe.entity.props.id,
        webinarId,
      );

      expect(participation).not.toBeNull();
      expect(participation).toEqual(
        new Participation({
          userId: e2eUsers.johnDoe.entity.props.id,
          webinarId,
          joinedAt: expect.any(Date),
        }),
      );
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer()).post(
        `/webinars/${webinarId}/bookings`,
      );

      expect(result.status).toEqual(403);
    });
  });
});
