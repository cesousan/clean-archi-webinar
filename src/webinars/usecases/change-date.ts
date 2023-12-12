import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IWebinarRepository } from '../ports';
import { IDateGenerator } from '@webinar/core/ports';
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
  ) {}
  async execute(request: Request): Promise<void> {
    const webinar = await this.repository.findById(request.webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }
    if (webinar.props.organizerId !== request.user.props.id) {
      throw new Error('You are not allowed to update this webinar');
    }
    webinar?.update({ startDate: request.startDate, endDate: request.endDate });
    if (webinar.isTooClose(this.dateGenerator.now())) {
      throw new Error(
        'The webinar must be organized at least 3 days in advance',
      );
    }
    await this.repository.update(webinar!);
    return;
  }
}
