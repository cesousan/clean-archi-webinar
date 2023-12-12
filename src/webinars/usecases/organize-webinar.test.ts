import {
  DeterministicDateGenerator,
  DeterministicIDGenerator,
} from '@webinar/core/adapters/index.testing';
import { IDateGenerator, IIDGenerator } from '@webinar/core/ports';
import { testUsers } from '@webinar/users/tests/user-seed';

import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';
import { OrganizeWebinar } from './organize-webinar';

describe('Feature: Organize webinar', () => {
  const { alice } = testUsers;
  let repository: IWebinarRepository;
  let idGenerator: IIDGenerator;
  let usecase: OrganizeWebinar;
  let dateGenerator: IDateGenerator;

  beforeEach(() => {
    repository = new InMemoryWebinarRepository();
    idGenerator = new DeterministicIDGenerator('1');
    dateGenerator = new DeterministicDateGenerator();
    usecase = new OrganizeWebinar(repository, idGenerator, dateGenerator);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: alice,
      title: 'My first webinar',
      seats: 1000,
      startDate: new Date('2023-01-10T10:00:00Z'),
      endDate: new Date('2023-01-10T11:00:00Z'),
    };
    it('should return the id', async () => {
      const result = await usecase.execute(payload);

      expect(result.id).toEqual('id-1');
    });

    it('should insert the webinar into the db', async () => {
      await usecase.execute(payload);

      const createdWebinar = await repository.findById('id-1')!;
      expectWebinarToEqual(createdWebinar!);
    });
  });
  describe('Scenario: The webinar happens too soon', () => {
    const payload = {
      user: alice,
      title: 'My first webinar',
      seats: 1000,
      startDate: new Date('2023-01-10T10:00:00Z'),
      endDate: new Date('2023-01-10T11:00:00Z'),
    };
    beforeEach(() => {
      (dateGenerator as DeterministicDateGenerator).date = new Date(
        '2023-01-08T00:00:00Z',
      );
    });
    it('should throw an error', async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrowError(
        'The webinar must be organized at least 3 days in advance',
      );
    });
    it('should not create the webinar', async () => {
      try {
        await usecase.execute(payload);
      } catch (e) {}

      expect(await repository.findById('id-1')).toEqual(null);
    });
  });
  describe('Scenario: The webinar has too many seats', () => {
    const payload = {
      user: alice,
      title: 'My first webinar',
      seats: 1001,
      startDate: new Date('2023-01-10T10:00:00Z'),
      endDate: new Date('2023-01-10T11:00:00Z'),
    };
    it('should throw an error', async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrowError(
        'The webinar must have no more than 1000 seats',
      );
    });
    it('should not create the webinar', async () => {
      try {
        await usecase.execute(payload);
      } catch (e) {}

      expect(await repository.findById('id-1')).toEqual(null);
    });
  });
  describe('Scenario: The webinar has no seats', () => {
    const payload = {
      user: alice,
      title: 'My first webinar',
      seats: 0,
      startDate: new Date('2023-01-10T10:00:00Z'),
      endDate: new Date('2023-01-10T11:00:00Z'),
    };
    it('should throw an error', async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrowError(
        'The webinar must have at least 1 seat',
      );
    });
    it('should not create the webinar', async () => {
      try {
        await usecase.execute(payload);
      } catch (e) {}

      expect(await repository.findById('id-1')).toEqual(null);
    });
  });
});

function expectWebinarToEqual(webinar: Webinar) {
  expect(webinar.props).toEqual({
    organizerId: 'alice-id',
    id: 'id-1',
    title: 'My first webinar',
    seats: 1000,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
  });
}
