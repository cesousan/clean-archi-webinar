import { IDateGenerator } from '@webinar/core/ports';

export class CurrentDateGenerator implements IDateGenerator {
  now() {
    return new Date();
  }
}
