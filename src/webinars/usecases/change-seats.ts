import { DomainException } from '@webinar/shared/exception';
import { Executable } from '@webinar/shared/executable';
import { User } from '@webinar/users/entities';
import {
  WebinarNotFoundException,
  WebinarTooManySeatsException,
  WebinarUpdateForbiddenException,
} from '../exceptions';
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
      throw new WebinarNotFoundException();
    }
    if (webinar.isOrganizer(user) === false) {
      throw new WebinarUpdateForbiddenException();
    }
    if (webinar.props.seats > seats) {
      throw new DomainException(
        'You cannot reduce the capacity of the webinar',
      );
    }
    webinar?.update({ seats });

    if (webinar.hasTooManySeats()) {
      throw new WebinarTooManySeatsException();
    }

    await this.webinarRepository.update(webinar);
  }
}
