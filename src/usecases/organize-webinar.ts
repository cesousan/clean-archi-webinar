import { User, Webinar } from '@webinar/entities';
import {
  IDateGenerator,
  IIDGenerator,
  IWebinarRepository,
} from '@webinar/ports';

export class OrganizeWebinar {
  constructor(
    private readonly repository: IWebinarRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}
  async execute(data: {
    user: User;
    title: string;
    startDate: Date;
    endDate: Date;
    seats: number;
  }) {
    const id = this.idGenerator.generate();
    const { user, ...rest } = data;
    const webinar = new Webinar({
      ...rest,
      id,
      organizerId: user.props.id,
    });

    if (webinar.isTooClose(this.dateGenerator.now())) {
      throw new Error(
        'The webinar must be organized at least 3 days in advance',
      );
    }

    if (webinar.hasTooManySeats()) {
      throw new Error('The webinar must have no more than 1000 seats');
    }

    if (webinar.hasNoSeats()) {
      throw new Error('The webinar must have at least 1 seat');
    }

    await this.repository.create(webinar);

    return { id };
  }
}
