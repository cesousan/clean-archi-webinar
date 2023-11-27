import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { addDays, addHours } from 'date-fns';

describe('Feature: Organize webinar', () => {
  it('should organize the webinar', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = module.createNestApplication();
    await app.init();

    const result = await request(app.getHttpServer())
      .post('/webinars')
      .send({
        title: 'My first webinar',
        seats: 100,
        startDate: addDays(new Date(), 4).toISOString(),
        endDate: addHours(addDays(new Date(), 4), 1).toISOString(),
      });

    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ id: expect.any(String) });
  });
});
