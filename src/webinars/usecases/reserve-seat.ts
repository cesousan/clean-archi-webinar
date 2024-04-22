import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { Participation } from '../entities/participation.entity';
import { IDateGenerator } from '@webinar/core/ports';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { IWebinarRepository } from '../ports';
import { IUserRepository } from '@webinar/users/ports';
import { Webinar } from '../entities';
import { NotFoundException } from '@nestjs/common';
import { WebinarNotFoundException } from '../exceptions';
import { DomainException } from '@webinar/shared/exception';

type Request = {
  user: User;
  webinarId: string;
};
type Response = void;

export class ReserveSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly dateProvider: IDateGenerator,
    private readonly webinarRepository: IWebinarRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IEmailer,
  ) {}
  async execute(request: Request): Promise<void> {
    const { user, webinarId } = request;

    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }
    await this.asserUserIsNotAlreadyParticipating(user, webinarId);

    await this.assertWebinarIsNotFull(webinarId, webinar);

    const participation = new Participation({
      userId: user.props.id,
      webinarId,
      joinedAt: this.dateProvider.now(),
    });
    await this.participationRepository.create(participation);

    await this.sendMailToOrganizer(webinar, user);
    this.sendMailToParticipant(webinar, user);
  }

  private async assertWebinarIsNotFull(webinarId: string, webinar: Webinar) {
    const participationCount =
      await this.participationRepository.findParticipationCount(webinarId);

    if (participationCount >= webinar.props.seats) {
      throw new DomainException('No more seats available for the webinar');
    }
  }

  private async asserUserIsNotAlreadyParticipating(
    user: User,
    webinarId: string,
  ) {
    const existingParticipation =
      await this.participationRepository.findOneParticipant(
        user.props.id,
        webinarId,
      );

    if (existingParticipation) {
      throw new DomainException('You are already registered to this webinar');
    }
  }

  private async sendMailToOrganizer(webinar: Webinar, user: User) {
    const organizer = await this.userRepository.findById(
      webinar.props.organizerId,
    );
    this.mailer.send({
      to: organizer!.props.email,
      subject: 'New participant',
      body: `User ${user.props.email} has joined your webinar "${webinar.props.title}"`,
    });
  }

  private sendMailToParticipant(webinar: Webinar, user: User) {
    this.mailer.send({
      to: user.props.email,
      subject: 'Your participation to the webinar',
      body: `You have successfully reserved a seat for the webinar "${webinar.props.title}"`,
    });
  }
}
