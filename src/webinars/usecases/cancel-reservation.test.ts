import { testUsers } from '@webinar/users/tests/user-seed';
import { CancelReservation } from './cancel-reservation';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { InMemoryParticipationRepository } from '../adapters/in-memory/participation-repository.in-memory';
import { Webinar } from '../entities';
import { Participation } from '../entities/participation.entity';
import { InMemoryMailer } from '@webinar/core/adapters/mailer.in-memory';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { IWebinarRepository } from '../ports';
import { InMemoryWebinarRepository } from '../adapters/in-memory/webinar-repository.in-memory';
import { IUserRepository } from '@webinar/users/ports';
import { InMemoryUserRepository } from '@webinar/users/adapters/user-repository.in-memory';
import { User } from '@webinar/users/entities';

describe('Feature: Cancel Reservation', () => {
  const { alice, bob, charlie } = testUsers;
  const webinar = new Webinar({
    id: 'id-1',
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00Z'),
    endDate: new Date('2023-01-10T11:00:00Z'),
    organizerId: bob.props.id,
  });
  const aliceParticipation = new Participation({
    userId: alice.props.id,
    webinarId: webinar.props.id,
    joinedAt: new Date('2023-01-10T09:00:00Z'),
  });

  let usecase: CancelReservation;
  let participationRepository: IParticipationRepository;
  let mailer: IEmailer;
  let webinarRepository: IWebinarRepository;
  let userRepository: IUserRepository;
  beforeEach(async () => {
    participationRepository = new InMemoryParticipationRepository([
      aliceParticipation,
    ]);
    mailer = new InMemoryMailer();
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    userRepository = new InMemoryUserRepository([alice, bob, charlie]);
    usecase = new CancelReservation(
      participationRepository,
      mailer,
      webinarRepository,
      userRepository,
    );
  });
  describe('Scenario: Happy path', () => {
    it('should cancel the reservation', async () => {
      const payload = {
        user: alice,
        webinarId: webinar.props.id,
      };
      const aliceParticipation =
        await participationRepository.findOneParticipant(
          alice.props.id,
          webinar.props.id,
        );
      expect(aliceParticipation).not.toBeNull();

      await usecase.execute(payload);

      const removedAliceParticipation =
        await participationRepository.findOneParticipant(
          alice.props.id,
          webinar.props.id,
        );
      expect(removedAliceParticipation).toBeNull();
    });
    it('should send an email to the user', async () => {
      const payload = {
        user: alice,
        webinarId: webinar.props.id,
      };

      await usecase.execute(payload);

      expect((mailer as InMemoryMailer).sentEmails[0]).toEqual({
        to: alice.props.email,
        subject: 'Webinar Cancellation',
        body: `Your registration to the webinar "${webinar.props.title}" has been canceled.`,
      });
    });
    it('should send an email to the organizer', async () => {
      const payload = {
        user: alice,
        webinarId: webinar.props.id,
      };

      await usecase.execute(payload);

      expect((mailer as InMemoryMailer).sentEmails[1]).toEqual({
        to: bob.props.email,
        subject: 'Webinar Cancellation',
        body: `The user ${alice.props.email} has canceled their registration to your webinar "${webinar.props.title}".`,
      });
    });
  });

  describe('Scenario: The user is not listed as a participant', () => {
    it('should fail', async () => {
      const payload = {
        user: charlie,
        webinarId: webinar.props.id,
      };
      await expect(() => usecase.execute(payload)).rejects.toThrowError(
        'The user is not listed as a participant',
      );

      const removedAliceParticipation =
        await participationRepository.findOneParticipant(
          charlie.props.id,
          webinar.props.id,
        );
      expect(removedAliceParticipation).toBeNull();
    });
    it('should not send emails', async () => {
      const payload = {
        user: charlie,
        webinarId: webinar.props.id,
      };

      await expectNoEmailSent(payload);
    });
  });

  describe('Scenario: The Webinar does not exist', () => {
    it('should fail', async () => {
      const payload = {
        user: bob,
        webinarId: 'non-existent-id',
      };
      await expect(() => usecase.execute(payload)).rejects.toThrowError(
        'Webinar not found',
      );
    });
    it('should not send emails', async () => {
      await expectNoEmailSent({ user: bob, webinarId: 'non-existent-id' });
    });
  });

  async function expectNoEmailSent({
    user,
    webinarId,
  }: {
    user: User;
    webinarId: string;
  }) {
    try {
      await usecase.execute({ user, webinarId });
    } catch (_err) {
      expect((mailer as InMemoryMailer).sentEmails.length).toEqual(0);
    }
  }
});
