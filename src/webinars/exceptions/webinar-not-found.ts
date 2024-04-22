import { DomainException } from '@webinar/shared/exception';

export class WebinarNotFoundException extends DomainException {
  constructor() {
    super('Webinar not found');
  }
}
