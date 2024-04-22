import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IWebinarRepository } from '../ports';
import { Webinar } from '../entities';
import {
  WebinarCancelForbiddenException,
  WebinarNotFoundException,
} from '../exceptions';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { IUserRepository } from '@webinar/users/ports';

type Request = {
  user: User;
  webinarId: string;
};

type Response = void;

export class CancelWebinar implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IEmailer,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute({ webinarId, user }: Request): Promise<void> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }
    if (webinar.isOrganizer(user) === false) {
      throw new WebinarCancelForbiddenException();
    }
    await this.webinarRepository.delete(webinar);
    await this.sendEmailToParticipants(webinar);
  }

  private async sendEmailToParticipants(webinar: Webinar) {
    const participations = await this.participationRepository.findByWebinarId(
      webinar.props.id,
    );
    const users = await Promise.all([
      ...participations.map((p) =>
        this.userRepository.findById(p.props.userId),
      ),
    ]);

    await Promise.all(
      users.filter(Boolean).map((user) => {
        this.mailer.send({
          to: user!.props.email,
          subject: `Webinar canceled`,
          body: `The webinar "${webinar.props.title}" has been canceled`,
        });
      }),
    );
  }
}
