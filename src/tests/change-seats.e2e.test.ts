import * as request from 'supertest';

import { Webinar } from '@webinar/webinars/entities';
import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';

import { WebinarFixture } from './fixtures/webinar-fixture';
import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar-seeds';

describe('Feature: Change webinar seats', () => {
  let app: TestApp;

  const authToken = e2eUsers.johnDoe.authToken;
  const { webinarJohn } = e2eWebinars;
  const webinarId = webinarJohn.entity.props.id;
  const seats = 100;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, webinarJohn]);
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('Scenario: User is authenticated', () => {
    it('should change the number of seats', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/seats`)
        .set('Authorization', authToken)
        .send({
          seats,
        });

      expect(result.status).toEqual(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);

      const webinar = await webinarRepository.findById(webinarId);

      expect(webinar).toBeDefined();
      expect(webinar!.props.seats).toEqual(seats);
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should not change the number of seats', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/seats`)
        .send({
          seats,
        });

      expect(result.status).toEqual(403);
    });
  });
});
