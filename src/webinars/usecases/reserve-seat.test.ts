import { testUsers } from '@webinar/users/tests/user-seed';
import { InMemoryParticipationRepository } from '../adapters/in-memory/participation-repository.in-memory';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { ReserveSeat } from './reserve-seat';
import { Webinar } from '../entities';
import { IDateGenerator } from '@webinar/core/ports';
import { DeterministicDateGenerator } from '@webinar/core/adapters/date-generator.deterministic';
import { Participation } from '../entities/participation.entity';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { InMemoryMailer } from '@webinar/core/adapters/mailer.in-memory';
import { IWebinarRepository } from '../ports';
import { IUserRepository } from '@webinar/users/ports';
import { InMemoryWebinarRepository } from '../adapters/in-memory/webinar-repository.in-memory';
import { InMemoryUserRepository } from '@webinar/users/adapters/user-repository.in-memory';
import { User } from '@webinar/users/entities';

describe('Feature: Reserve a seat', () => {
  let participationRepository: IParticipationRepository;
  let usecase: ReserveSeat;
  let dateProvider: IDateGenerator;
  let webinarRepository: IWebinarRepository;
  let userRepository: IUserRepository;
  let mailer: IEmailer;
  const { alice, bob, charlie } = testUsers;

  const webinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: alice.props.id,
  });
  const singlePersonWebinar = new Webinar({
    id: 'id-2',
    title: 'My second webinar',
    seats: 1,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: alice.props.id,
  });
  const charlieParticipation = new Participation({
    userId: charlie.props.id,
    webinarId: singlePersonWebinar.props.id,
    joinedAt: new Date('2023-01-10T09:00:00Z'),
  });
  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository([
      charlieParticipation,
    ]);
    dateProvider = new DeterministicDateGenerator();
    webinarRepository = new InMemoryWebinarRepository([
      webinar,
      singlePersonWebinar,
    ]);
    userRepository = new InMemoryUserRepository([alice, bob, charlie]);
    mailer = new InMemoryMailer();
    usecase = new ReserveSeat(
      participationRepository,
      dateProvider,
      webinarRepository,
      userRepository,
      mailer,
    );
  });
  describe('Scenario: Happy path', () => {
    it('should reserve a seat for the user', async () => {
      const now = ((dateProvider as DeterministicDateGenerator).date = new Date(
        '2023-01-10T09:00:00Z',
      ));
      await usecase.execute({ user: bob, webinarId: webinar.props.id });
      expect(
        await participationRepository.findOneParticipant(
          bob.props.id,
          webinar.props.id,
        ),
      ).toEqual(
        new Participation({
          userId: bob.props.id,
          webinarId: webinar.props.id,
          joinedAt: now,
        }),
      );
    });
    it('should send an email to the organizer', async () => {
      await usecase.execute({ user: bob, webinarId: webinar.props.id });
      expect((mailer as InMemoryMailer).sentEmails[0]).toEqual({
        to: alice.props.email,
        subject: 'New participant',
        body: `User ${bob.props.email} has joined your webinar "${webinar.props.title}"`,
      });
    });
    it('should send an email to the new participant', async () => {
      await usecase.execute({ user: bob, webinarId: webinar.props.id });
      expect((mailer as InMemoryMailer).sentEmails[1]).toEqual({
        to: bob.props.email,
        subject: 'Your participation to the webinar',
        body: `You have successfully reserved a seat for the webinar "${webinar.props.title}"`,
      });
    });
  });
  describe('Scenario: The Webinar does not exist', () => {
    it('should fail', async () => {
      await expect(() =>
        usecase.execute({ user: bob, webinarId: 'non-existent-id' }),
      ).rejects.toThrowError('Webinar not found');

      await expectParticipationNotToBeCreated(bob, singlePersonWebinar);
    });
    it('should not send confirmation email', async () => {
      await expectNoEmailSent(bob);
    });
  });

  describe('Scenario: The Webinar is full', () => {
    it('should fail', async () => {
      await expect(() =>
        usecase.execute({ user: bob, webinarId: singlePersonWebinar.props.id }),
      ).rejects.toThrowError('No more seats available for the webinar');

      await expectParticipationNotToBeCreated(bob, singlePersonWebinar);
    });
    it('should not send confirmation email', async () => {
      await expectNoEmailSent(bob);
    });
  });

  describe('Scenario: Already registered as a participant to the webinar', () => {
    it('should fail', async () => {
      await expect(() =>
        usecase.execute({
          user: charlie,
          webinarId: singlePersonWebinar.props.id,
        }),
      ).rejects.toThrowError('You are already registered to this webinar');

      await expectParticipationNotToBeCreated(bob, singlePersonWebinar);
    });
    it('should not send confirmation email', async () => {
      await expectNoEmailSent(charlie);
    });
  });

  async function expectNoEmailSent(user: User) {
    try {
      await usecase.execute({ user, webinarId: 'non-existent-id' });
    } catch (_err) {
      expect((mailer as InMemoryMailer).sentEmails.length).toEqual(0);
    }
  }

  async function expectParticipationNotToBeCreated(
    user: User,
    webinar: Webinar,
  ) {
    const participation = await participationRepository.findOneParticipant(
      user.props.id,
      webinar.props.id,
    );
    expect(participation).toEqual(null);
  }
});
