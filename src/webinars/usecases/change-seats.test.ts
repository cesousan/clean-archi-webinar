import { testUsers } from '@webinar/users/tests/user-seed';
import { InMemoryWebinarRepository } from '../adapters/in-memory/webinar-repository.in-memory';
import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';
import { ChangeSeats } from './change-seats';
import { User } from '@webinar/users/entities';

describe('Feature : Change the number of seats', () => {
  const { alice, bob } = testUsers;

  const webinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: alice.props.id,
  });
  let usecase: ChangeSeats;
  let webinarRepository: IWebinarRepository;
  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    usecase = new ChangeSeats(webinarRepository);
  });

  async function expectSeatsToRemainUnchanged() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar?.props.seats).toEqual(50);
  }

  function buildPayload(
    data: Partial<{ seats: number; user: User; webinarId: string }> = {},
  ) {
    return {
      user: alice,
      webinarId: 'id-1',
      seats: 100,
      ...data,
    };
  }

  describe('Scenario: Happy Path', () => {
    const payload = buildPayload();
    it('should change the number of seats of a webinar', async () => {
      await usecase.execute(payload);
      const webinar = await webinarRepository.findById('id-1');
      expect(webinar?.props.seats).toEqual(100);
    });
  });
  describe('Scenario: The Webinar does not exist', () => {
    const payload = buildPayload({ webinarId: 'id-2' });
    it('should fail', async () => {
      await expect(usecase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );
      expectSeatsToRemainUnchanged();
    });
  });
  describe('Scenario: Updating someone elses webinar', () => {
    const payload = buildPayload({ user: bob });
    it('should fail', async () => {
      await expect(usecase.execute(payload)).rejects.toThrow(
        'You are not allowed to update this webinar',
      );
      expectSeatsToRemainUnchanged();
    });
  });
  describe('Scenario: Reducing the previous capacity of the webinar', () => {
    const payload = buildPayload({ seats: 49 });
    it('should fail', async () => {
      await expect(usecase.execute(payload)).rejects.toThrow(
        'You cannot reduce the capacity of the webinar',
      );

      expectSeatsToRemainUnchanged();
    });
  });
  describe('Scenario: Increasing the webinar capacity beyond the max limit', () => {
    const payload = buildPayload({ seats: 1001 });
    it('should fail', async () => {
      await expect(usecase.execute(payload)).rejects.toThrow(
        'The webinar must have no more than 1000 seats',
      );

      expectSeatsToRemainUnchanged();
    });
  });
});
