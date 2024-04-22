import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { IWebinarRepository } from '../ports';
import { IUserRepository } from '@webinar/users/ports';
import { WebinarNotFoundException } from '../exceptions';
import { DomainException } from '@webinar/shared/exception';

type Request = { webinarId: string; user: User };
type Response = void;
export class CancelReservation implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IEmailer,
    private readonly webinarRepository: IWebinarRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    const { user, webinarId } = request;

    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }

    const participation = await this.participationRepository.findOneParticipant(
      user.props.id,
      webinarId,
    );
    if (!participation) {
      throw new DomainException('The user is not listed as a participant');
    }

    await this.participationRepository.cancel(participation);

    this.mailer.send({
      to: user.props.email,
      subject: 'Webinar Cancellation',
      body: `Your registration to the webinar "${webinar.props.title}" has been canceled.`,
    });

    const organizer = await this.userRepository.findById(
      webinar.props.organizerId,
    );
    this.mailer.send({
      to: organizer!.props.email,
      subject: 'Webinar Cancellation',
      body: `The user ${user.props.email} has canceled their registration to your webinar "${webinar.props.title}".`,
    });
  }
}
