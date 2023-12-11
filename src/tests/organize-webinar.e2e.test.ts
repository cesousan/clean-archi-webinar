import { Test } from '@nestjs/testing';
import { addDays, addHours } from 'date-fns';
import * as request from 'supertest';

import { InMemoryUserRepository, InMemoryWebinarRepository } from '../adapters';
import { AppModule } from '../app/app.module';
import { User } from '../entities';
import { INestApplication } from '@nestjs/common';
import { after } from 'node:test';

describe('Feature: Organize webinar', () => {
  let app: INestApplication;
  const johnDoe = new User({
    id: 'john-doe',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  });

  const token = Buffer.from(
    `${johnDoe.props.email}:${johnDoe.props.password}`,
  ).toString('base64');

  const startDate = addDays(new Date(), 4);
  const endDate = addHours(startDate, 1);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Scenario: User is authenticated', () => {
    beforeEach(async () => {
      const userRepository = app.get(InMemoryUserRepository);
      await userRepository.create(johnDoe);
    });
    it('should organize the webinar', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', `Basic ${token}`)
        .send({
          title: 'My first webinar',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toEqual(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinarRepository = app.get(InMemoryWebinarRepository);
      const webinar = webinarRepository.database.get(result.body.id);
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
