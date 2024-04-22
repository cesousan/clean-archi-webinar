import { testUsers } from '@webinar/users/tests/user-seed';
import { Webinar } from '../entities';
import { ChangeDate } from './change-date';
import { IWebinarRepository } from '../ports';
import { InMemoryWebinarRepository } from '../adapters/in-memory/webinar-repository.in-memory';
import { IDateGenerator } from '@webinar/core/ports';
import { DeterministicDateGenerator } from '@webinar/core/adapters/date-generator.deterministic';
import { addDays } from 'date-fns';
import { Participation } from '../entities/participation.entity';
import { InMemoryParticipationRepository } from '../adapters/in-memory/participation-repository.in-memory';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { InMemoryMailer } from '@webinar/core/adapters/mailer.in-memory';
import { IUserRepository } from '@webinar/users/ports';
import { InMemoryUserRepository } from '@webinar/users/adapters/user-repository.in-memory';

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
  const bobParticipation = new Participation({
    userId: bob.props.id,
    webinarId: webinar.props.id,
    joinedAt: new Date('2023-01-10T10:00:00Z'),
  });
  async function expectDatesToRemainUnchanged() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar?.props.startDate).toEqual(new Date('2023-01-10T10:00:00Z'));
    expect(webinar?.props.endDate).toEqual(new Date('2023-01-10T11:00:00Z'));
  }

  let usecase: ChangeDate;
  let webinarRepository: IWebinarRepository;
  let dateGenerator: IDateGenerator;
  let participationRepository: IParticipationRepository;
  let emailer: IEmailer;
  let userRepository: IUserRepository;
  beforeEach(() => {
    dateGenerator = new DeterministicDateGenerator();
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    participationRepository = new InMemoryParticipationRepository([
      bobParticipation,
    ]);
    emailer = new InMemoryMailer();
    userRepository = new InMemoryUserRepository([alice, bob]);
    usecase = new ChangeDate(
      webinarRepository,
      dateGenerator,
      participationRepository,
      emailer,
      userRepository,
    );
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
    it('should send an email to the participants', async () => {
      await usecase.execute(payload);

      expect((emailer as InMemoryMailer).sentEmails).toEqual([
        {
          to: bob.props.email,
          subject: 'Webinar "My first webinar" date changed',
          body: `The date of the webinar "My first webinar" has been changed.`,
        },
      ]);
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
