import { DomainException } from '@webinar/shared/exception';

export class WebinarUpdateForbiddenException extends DomainException {
  constructor() {
    super('You are not allowed to update this webinar');
  }
}
