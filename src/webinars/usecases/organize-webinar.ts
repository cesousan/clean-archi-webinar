import { IDateGenerator, IIDGenerator } from '@webinar/core/ports';
import { User } from '@webinar/users/entities';

import { Executable } from '@webinar/shared/executable';

import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';

type Request = {
  user: User;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};
type Response = {
  id: string;
};

export class OrganizeWebinar implements Executable<Request, Response> {
  constructor(
    private readonly repository: IWebinarRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}
  async execute(data: Request): Promise<Response> {
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
