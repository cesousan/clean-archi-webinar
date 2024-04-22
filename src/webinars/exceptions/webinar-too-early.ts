import { DomainException } from '@webinar/shared/exception';

export class WebinarTooEarlyException extends DomainException {
  constructor() {
    super('The webinar must be organized at least 3 days in advance');
  }
}
