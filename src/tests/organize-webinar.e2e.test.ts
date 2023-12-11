import { addDays, addHours } from 'date-fns';
import * as request from 'supertest';

import { IWebinarRepository, I_WEBINAR_REPOSITORY } from '@webinar/ports';
import { TestApp } from './test-app';
import { e2eUsers } from './user-seeds';

describe('Feature: Organize webinar', () => {
  let app: TestApp;

  const authToken = e2eUsers.johnDoe.authToken;

  const startDate = addDays(new Date(), 4);
  const endDate = addHours(startDate, 1);

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe]);
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('Scenario: User is authenticated', () => {
    it('should organize the webinar', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', authToken)
        .send({
          title: 'My first webinar',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toEqual(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(result.body.id);
      expect(webinar).toBeDefined();
      expect(webinar!.props).toEqual({
        id: expect.any(String),
        title: 'My first webinar',
        seats: 100,
        startDate,
        endDate,
        organizerId: 'john-doe',
      });
    });
  });
  describe('Scenario: User is not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer()).post('/webinars').send({
        title: 'My first webinar',
        seats: 100,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      expect(result.status).toEqual(403);
    });
  });
});
