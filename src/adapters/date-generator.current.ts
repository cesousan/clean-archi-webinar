import { IDateGenerator } from '@webinar/ports';

export class CurrentDateGenerator implements IDateGenerator {
  now() {
    return new Date();
  }
}
