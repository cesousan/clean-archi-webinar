import { DomainException } from '@webinar/shared/exception';

export class WebinarTooManySeatsException extends DomainException {
  constructor() {
    super('The webinar must have no more than 1000 seats');
  }
}
