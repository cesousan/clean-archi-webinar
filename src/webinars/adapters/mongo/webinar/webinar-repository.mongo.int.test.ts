import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TestApp } from '@webinar/tests/utils/test-app';
import { testUsers } from '@webinar/users/tests/user-seed';

import { MongoWebinar } from './mongo-webinar';
import { MongoWebinarRepository } from './webinar-repository.mongo';
import { Webinar } from '@webinar/webinars/entities';
import { addDays } from 'date-fns';

describe('MongoWebinarRepository', () => {
  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.alice.props.id,
    title: 'title-1',
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 11),
    seats: 10,
  });
  const webinar2 = new Webinar({
    id: 'id-2',
    organizerId: testUsers.bob.props.id,
    title: 'title-2',
    startDate: addDays(new Date(), 20),
    endDate: addDays(new Date(), 21),
    seats: 20,
  });
  let app: TestApp;
  let model: Model<MongoWebinar.SchemaClass>;
  let repository: MongoWebinarRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get<Model<MongoWebinar.SchemaClass>>(
      getModelToken(MongoWebinar.CollectionName),
    );
    repository = new MongoWebinarRepository(model);

    const record = new model({
      _id: webinar.props.id,
      organizerId: webinar.props.organizerId,
      title: webinar.props.title,
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
      seats: webinar.props.seats,
    });
    await record.save();
  });
  afterEach(async () => {
    await app.teardown();
  });

  describe('findById', () => {
    it('should find the webinar corresponding to the id', async () => {
      const webinar1 = await repository.findById(webinar.props.id);

      expect(webinar1!.props).toEqual(webinar.props);
    });
    it('should not find the webinar when there is no corresponding id', async () => {
      const unknownWebinar = await repository.findById('id-does-not-exist');

      expect(unknownWebinar).toEqual(null);
    });
  });

  describe('create', () => {
    it('should create a new webinar', async () => {
      await repository.create(webinar2);

      expect(await repository.findById(webinar2.props.id)).toEqual(webinar2);
    });
  });

  describe('update', () => {
    it('should update the webinar', async () => {
      const webinar1Copy = webinar.clone() as Webinar;
      webinar1Copy.update({ title: 'a-much-better-title-for-webinar-1' });
      await repository.update(webinar1Copy);
      const record = await model.findById(webinar.props.id);

      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: webinar1Copy.props.id,
        organizerId: webinar1Copy.props.organizerId,
        title: webinar1Copy.props.title,
        startDate: webinar1Copy.props.startDate,
        endDate: webinar1Copy.props.endDate,
        seats: webinar1Copy.props.seats,
      });

      expect(webinar1Copy.props).toEqual(webinar1Copy.initialState);
    });
  });

  describe('delete', () => {
    it('should delete the webinar', async () => {
      expect(await repository.findById(webinar.props.id)).toEqual(webinar);
      await repository.delete(webinar);
      const record = await model.findById(webinar.props.id);

      expect(record).toEqual(null);
    });
  });
});
