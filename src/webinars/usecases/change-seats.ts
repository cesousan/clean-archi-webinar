import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import { IWebinarRepository } from '../ports';

type Request = {
  user: User;
  webinarId: string;
  seats: number;
};
type Response = void;

export class ChangeSeats implements Executable<Request, Response> {
  constructor(private webinarRepository: IWebinarRepository) {}
  async execute(request: Request): Promise<Response> {
    const { user, webinarId, seats } = request;
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }
    if (webinar.props.organizerId !== user.props.id) {
      throw new Error('You are not allowed to update this webinar');
    }
    if (webinar.props.seats > seats) {
      throw new Error('You cannot reduce the capacity of the webinar');
    }
    webinar?.update({ seats });

    if (webinar.hasTooManySeats()) {
      throw new Error('The webinar must have no more than 1000 seats');
    }

    await this.webinarRepository.update(webinar);
  }
}
