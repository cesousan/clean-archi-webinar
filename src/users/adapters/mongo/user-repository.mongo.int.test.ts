import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TestApp } from '@webinar/tests/utils/test-app';
import { testUsers } from '@webinar/users/tests/user-seed';

import { MongoUser } from './mongo-user';
import { MongoUserRepository } from './user-repository.mongo';

describe('MongoUserRepository', () => {
  let app: TestApp;
  let model: Model<MongoUser.SchemaClass>;
  let repository: MongoUserRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get<Model<MongoUser.SchemaClass>>(
      getModelToken(MongoUser.CollectionName),
    );
    repository = new MongoUserRepository(model);

    const record = new model({
      _id: testUsers.alice.props.id,
      emailAddress: testUsers.alice.props.email,
      password: testUsers.alice.props.password,
    });
    await record.save();
  });
  afterEach(async () => {
    await app.teardown();
  });

  describe('findByEmailAddress', () => {
    it('should find the user corresponding to the email address', async () => {
      const user = await repository.findByEmailAddress(
        testUsers.alice.props.email,
      );

      expect(user!.props).toEqual(testUsers.alice.props);
    });
    it('should not find the user when there is no corresponding email address', async () => {
      const user = await repository.findByEmailAddress(
        'does-not-exist@mail.fr',
      );

      expect(user).toEqual(null);
    });
  });

  describe('findById', () => {
    it('should find the user corresponding to the id', async () => {
      const user = await repository.findById(testUsers.alice.props.id);

      expect(user!.props).toEqual(testUsers.alice.props);
    });
    it('should not find the user when there is no corresponding id', async () => {
      const user = await repository.findById('id-does-not-exist');

      expect(user).toEqual(null);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = testUsers.bob;
      const { id } = await repository.create(user);

      expect(id).not.toBeNull();
      expect(await repository.findById(id)).toEqual(user);
    });
  });
});
