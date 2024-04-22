import { testUsers } from '@webinar/users/tests/user-seed';
import { CancelWebinar } from './cancel-webinar';
import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';
import { InMemoryWebinarRepository } from '../adapters/in-memory/webinar-repository.in-memory';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { InMemoryMailer } from '@webinar/core/adapters/mailer.in-memory';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IUserRepository } from '@webinar/users/ports';
import { InMemoryParticipationRepository } from '../adapters/in-memory/participation-repository.in-memory';
import { InMemoryUserRepository } from '@webinar/users/adapters/user-repository.in-memory';
import { Participation } from '../entities/participation.entity';

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
describe('Feature: Cancel Webinar', () => {
  let usecase: CancelWebinar;
  let webinarRepository: IWebinarRepository;
  let mailer: IEmailer;
  let participationRepository: IParticipationRepository;
  let userRepository: IUserRepository;
  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    mailer = new InMemoryMailer();
    participationRepository = new InMemoryParticipationRepository([
      bobParticipation,
    ]);
    userRepository = new InMemoryUserRepository([alice, bob]);
    usecase = new CancelWebinar(
      webinarRepository,
      mailer,
      participationRepository,
      userRepository,
    );
  });
  describe('Scenario: Happy Path', () => {
    it('should delete the webinar', async () => {
      await usecase.execute({ user: alice, webinarId: webinar.props.id });
      await expectWebinarToBeCanceled(webinarRepository, webinar);
    });
    it('should send an email to all participants', async () => {
      await usecase.execute({ user: alice, webinarId: webinar.props.id });
      expect((mailer as InMemoryMailer).sentEmails).toEqual([
        {
          to: bob.props.email,
          subject: 'Webinar canceled',
          body: `The webinar "${webinar.props.title}" has been canceled`,
        },
      ]);
    });
  });
  describe('Scenario: Webinar does not exist', () => {
    it('should fail', async () => {
      await expect(() =>
        usecase.execute({ user: alice, webinarId: 'id-not-exist' }),
      ).rejects.toThrowError('Webinar not found');

      await expectWebinarNotToBeCanceled(webinarRepository, webinar);
    });
  });
  describe(`Scenario: Canceling someone else's webinar`, () => {
    it('should fail', async () => {
      await expect(() =>
        usecase.execute({ user: bob, webinarId: webinar.props.id }),
      ).rejects.toThrowError('You are not allowed to cancel this webinar');

      await expectWebinarNotToBeCanceled(webinarRepository, webinar);
    });
  });
});

async function expectWebinarToBeCanceled(
  webinarRepository: IWebinarRepository,
  webinar: Webinar,
) {
  const deletedWebinar = await webinarRepository.findById(webinar.props.id);
  expect(deletedWebinar).toEqual(null);
}

async function expectWebinarNotToBeCanceled(
  webinarRepository: IWebinarRepository,
  webinar: Webinar,
) {
  const webinarToDelete = await webinarRepository.findById(webinar.props.id);
  expect(webinarToDelete).not.toEqual(null);
}
