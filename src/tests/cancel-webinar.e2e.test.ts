import * as request from 'supertest';

import { Webinar } from '@webinar/webinars/entities';
import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import { addDays } from 'date-fns';
import { WebinarFixture } from './fixtures/webinar-fixture';
import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';
import { e2eWebinars } from './seeds/webinar-seeds';

describe('Feature: Cancel a webinar', () => {
  let app: TestApp;
  const authToken = e2eUsers.johnDoe.authToken;
  const { webinarJohn } = e2eWebinars;
  const webinarId = webinarJohn.entity.props.id;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, webinarJohn]);
  });
  afterEach(async () => {
    await app.teardown();
  });

  describe('Scenario: User is authenticated', () => {
    it('should cancel the webinar', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${webinarId}`)
        .set('Authorization', authToken);

      expect(result.status).toEqual(204);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(webinarId);
      expect(webinar).toEqual(null);
    });
  });

  describe('Scenario: User is not authenticated', () => {
    it('should return an error', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/webinars/${webinarId}`,
      );

      expect(result.status).toEqual(403);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(webinarId);
      expect(webinar).not.toEqual(null);
    });
  });
});
