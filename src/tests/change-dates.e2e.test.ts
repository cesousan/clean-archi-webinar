import * as request from 'supertest';

import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';

import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import { Webinar } from '@webinar/webinars/entities';
import { WebinarFixture } from './fixtures/webinar-fixture';
import { addDays } from 'date-fns';
import { e2eWebinars } from './seeds/webinar-seeds';

describe('Feature: Change webinar dates', () => {
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
    it('should change the dates of the webinar', async () => {
      const startDate = addDays(new Date(), 5);
      const endDate = addDays(new Date(), 6);

      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/dates`)
        .set('Authorization', authToken)
        .send({
          startDate,
          endDate,
        });

      expect(result.status).toEqual(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);

      const updatedWebinar = await webinarRepository.findById(webinarId);

      expect(updatedWebinar).toBeDefined();
      expect(updatedWebinar!.props.startDate).toEqual(startDate);
      expect(updatedWebinar!.props.endDate).toEqual(endDate);
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should not change the dates', async () => {
      const startDate = addDays(new Date(), 5);
      const endDate = addDays(new Date(), 6);

      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/dates`)
        .send({
          startDate,
          endDate,
        });

      expect(result.status).toEqual(403);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);

      const updatedWebinar = await webinarRepository.findById(webinarId);

      expect(updatedWebinar).toBeDefined();
      expect(updatedWebinar!.props.startDate).toEqual(
        webinarJohn.entity.props.startDate,
      );
      expect(updatedWebinar!.props.endDate).toEqual(
        webinarJohn.entity.props.endDate,
      );
    });
  });
});
