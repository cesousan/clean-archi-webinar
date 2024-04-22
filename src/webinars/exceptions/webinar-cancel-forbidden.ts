import { DomainException } from '@webinar/shared/exception';

export class WebinarCancelForbiddenException extends DomainException {
  constructor() {
    super('You are not allowed to cancel this webinar');
  }
}
