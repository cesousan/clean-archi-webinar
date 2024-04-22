import { DomainException } from '@webinar/shared/exception';

export class WebinarNotEnoughSeatsException extends DomainException {
  constructor() {
    super('The webinar must have at least 1 seat');
  }
}
