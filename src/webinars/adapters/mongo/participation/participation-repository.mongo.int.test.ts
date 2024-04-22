import { getModelToken } from '@nestjs/mongoose';

import { addDays, subDays } from 'date-fns';
import { Model } from 'mongoose';

import { TestApp } from '@webinar/tests/utils/test-app';
import { testUsers } from '@webinar/users/tests/user-seed';
import { Participation } from '@webinar/webinars/entities/participation.entity';

import { MongoParticipation } from './mongo-participation';
import { MongoParticipationRepository } from './participation-repository.mongo';
import { Webinar } from '@webinar/webinars/entities';

describe('MongoParticipationRepository', () => {
  async function createParticipationInDb(participation: Participation) {
    const record = new model({
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
      joinedAt: participation.props.joinedAt,
    });
    await record.save();
  }

  const webinar = new Webinar({
    id: 'webinar',
    organizerId: testUsers.bob.props.id,
    title: 'title',
    startDate: addDays(new Date(), 5),
    endDate: addDays(new Date(), 6),
    seats: 10,
  });
  const participation = new Participation({
    userId: testUsers.alice.props.id,
    webinarId: webinar.props.id,
    joinedAt: subDays(new Date(), 10),
  });

  let app: TestApp;
  let model: Model<MongoParticipation.SchemaClass>;
  let repository: MongoParticipationRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get<Model<MongoParticipation.SchemaClass>>(
      getModelToken(MongoParticipation.CollectionName),
    );

    repository = new MongoParticipationRepository(model);

    await createParticipationInDb(participation);
  });
  afterEach(async () => {
    await app.teardown();
  });

  describe('findOneParticipant', () => {
    it('should find a participation', async () => {
      const participationFound = await repository.findOneParticipant(
        participation.props.userId,
        participation.props.webinarId,
      );

      expect(participationFound).not.toBeNull();
      expect(participationFound!.props).toEqual(participation.props);
    });

    it('should return null when no participation is found', async () => {
      const participationFound = await repository.findOneParticipant(
        'unknown-user-id',
        participation.props.webinarId,
      );

      expect(participationFound).toBeNull();
    });
  });
  describe('findByWebinarId', () => {
    it('should find all the participations to a webinar', async () => {
      const otherParticipation = new Participation({
        userId: testUsers.charlie.props.id,
        webinarId: participation.props.webinarId,
        joinedAt: new Date(),
      });
      await createParticipationInDb(otherParticipation);
      const participations = await repository.findByWebinarId(
        participation.props.webinarId,
      );

      expect(participations).not.toBeNull();
      expect(participations).toHaveLength(2);
      expect(participations).toEqual([participation, otherParticipation]);
    });
  });

  describe('findParticipationCount', () => {
    it('should return the count of participations to a webinar', async () => {
      let count = await repository.findParticipationCount(
        participation.props.webinarId,
      );

      expect(count).toEqual(1);

      const otherParticipation = new Participation({
        userId: testUsers.charlie.props.id,
        webinarId: participation.props.webinarId,
        joinedAt: new Date(),
      });
      await createParticipationInDb(otherParticipation);

      count = await repository.findParticipationCount(
        participation.props.webinarId,
      );
      expect(count).toEqual(2);
    });
  });

  describe('create', () => {
    it('should create a participation', async () => {
      const newParticipation = new Participation({
        userId: testUsers.charlie.props.id,
        webinarId: webinar.props.id,
        joinedAt: new Date(),
      });

      await repository.create(newParticipation);

      const savedParticipation = await model.findOne({
        userId: newParticipation.props.userId,
        webinarId: newParticipation.props.webinarId,
      });

      expect(savedParticipation).not.toBeNull();
      expect(savedParticipation?.toObject()).toEqual({
        __v: 0,
        _id: MongoParticipation.SchemaClass.makeId(newParticipation),
        userId: newParticipation.props.userId,
        webinarId: newParticipation.props.webinarId,
        joinedAt: newParticipation.props.joinedAt,
      });
    });
  });
  describe('cancel', () => {
    it('should cancel a participation', async () => {
      const modelId = MongoParticipation.SchemaClass.makeId(participation);

      expect(await model.findById(modelId)).not.toBeNull();

      await repository.cancel(participation);

      expect(await model.findById(modelId)).toBeNull();
    });
  });
});
