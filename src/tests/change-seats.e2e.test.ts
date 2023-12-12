import * as request from 'supertest';

import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';

import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import { Webinar } from '@webinar/webinars/entities';
import { WebinarFixture } from './fixtures/webinar-fixture';

describe('Feature: Change webinar seats', () => {
  let app: TestApp;

  const authToken = e2eUsers.johnDoe.authToken;
  const id = 'id-1';
  const seats = 100;
  const webinar: Webinar = new Webinar({
    id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: e2eUsers.johnDoe.entity.props.id,
  });
  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, new WebinarFixture(webinar)]);
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('Scenario: User is authenticated', () => {
    it('should change the number of seats', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .set('Authorization', authToken)
        .send({
          seats,
        });

      expect(result.status).toEqual(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);

      const webinar = await webinarRepository.findById(id);

      expect(webinar).toBeDefined();
      expect(webinar!.props.seats).toEqual(seats);
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should not change the number of seats', async () => {
      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .send({
          seats,
        });

      expect(result.status).toEqual(403);
    });
  });
});
