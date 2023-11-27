import { IDateGenerator } from '../ports';

export class CurrentDateGenerator implements IDateGenerator {
  now() {
    return new Date();
  }
}
