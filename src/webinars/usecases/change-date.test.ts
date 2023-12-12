import { testUsers } from '@webinar/users/tests/user-seed';
import { Webinar } from '../entities';
import { ChangeDate } from './change-date';
import { IWebinarRepository } from '../ports';
import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { IDateGenerator } from '@webinar/core/ports';
import { DeterministicDateGenerator } from '@webinar/core/adapters/date-generator.deterministic';
import { addDays } from 'date-fns';

describe('Feature: Change webinar date', () => {
  const { alice, bob } = testUsers;
  const webinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: alice.props.id,
  });

  async function expectDatesToRemainUnchanged() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar?.props.startDate).toEqual(new Date('2023-01-10T10:00:00Z'));
    expect(webinar?.props.endDate).toEqual(new Date('2023-01-10T11:00:00Z'));
  }

  let usecase: ChangeDate;
  let webinarRepository: IWebinarRepository;
  let dateGenerator: IDateGenerator;
  beforeEach(() => {
    dateGenerator = new DeterministicDateGenerator();
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    usecase = new ChangeDate(webinarRepository, dateGenerator);
  });
  describe('Scenario: Happy path', () => {
    const payload = {
      user: alice,
      webinarId: 'id-1',
      startDate: new Date('2023-01-20T10:00:00Z'),
      endDate: new Date('2023-01-21T18:00:00Z'),
    };
    it('should change the date', async () => {
      await usecase.execute(payload);
      const webinar = await webinarRepository.findById('id-1');
      expect(webinar?.props.startDate).toEqual(
        new Date('2023-01-20T10:00:00Z'),
      );
      expect(webinar?.props.endDate).toEqual(new Date('2023-01-21T18:00:00Z'));
    });
  });
  describe("Scenario: The webinar doesn't exist", () => {
    it('should fail', async () => {
      const payload = {
        user: alice,
        webinarId: 'id-2',
        startDate: new Date('2023-01-20T10:00:00Z'),
        endDate: new Date('2023-01-21T18:00:00Z'),
      };
      await expect(usecase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );
      await expectDatesToRemainUnchanged();
    });
  });
  describe('Scenario: The user is not the organizer of the webinar', () => {
    it('should fail', async () => {
      const payload = {
        user: bob,
        webinarId: 'id-1',
        startDate: new Date('2023-01-20T10:00:00Z'),
        endDate: new Date('2023-01-21T18:00:00Z'),
      };
      await expect(usecase.execute(payload)).rejects.toThrow(
        'You are not allowed to update this webinar',
      );
      await expectDatesToRemainUnchanged();
    });
  });
  describe("Scenario: The webinar's dates are invalid", () => {
    it('should fail when the start date is too close from the current day', async () => {
      const payload = {
        user: alice,
        webinarId: 'id-1',
        startDate: addDays(dateGenerator.now(), 2),
        endDate: addDays(dateGenerator.now(), 4),
      };
      await expect(usecase.execute(payload)).rejects.toThrow(
        'The webinar must be organized at least 3 days in advance',
      );
      await expectDatesToRemainUnchanged();
    });
  });
});
