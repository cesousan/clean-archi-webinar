import { IDateGenerator } from '@webinar/core/ports';
import { IEmailer } from '@webinar/core/ports/mailer.interface';
import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IUserRepository } from '@webinar/users/ports';
import { Webinar } from '../entities';
import {
  WebinarNotFoundException,
  WebinarTooEarlyException,
  WebinarUpdateForbiddenException,
} from '../exceptions';
import { IWebinarRepository } from '../ports';
import { IParticipationRepository } from '../ports/participation-repository.interface';

type Request = {
  user: User;
  webinarId: string;
  startDate: Date;
  endDate: Date;
};

type Response = void;

export class ChangeDate implements Executable<Request, Response> {
  constructor(
    private readonly repository: IWebinarRepository,
    private readonly dateGenerator: IDateGenerator,
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IEmailer,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute({
    user,
    webinarId,
    startDate,
    endDate,
  }: Request): Promise<void> {
    const webinar = await this.repository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }
    if (webinar.isOrganizer(user) === false) {
      throw new WebinarUpdateForbiddenException();
    }
    webinar.update({ startDate, endDate });
    if (webinar.isTooClose(this.dateGenerator.now())) {
      throw new WebinarTooEarlyException();
    }
    await this.repository.update(webinar);

    await this.sendEmailToParticipants(webinar);

    return;
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
          subject: `Webinar "${webinar.props.title}" date changed`,
          body: `The date of the webinar "${webinar.props.title}" has been changed.`,
        });
      }),
    );
  }
}
