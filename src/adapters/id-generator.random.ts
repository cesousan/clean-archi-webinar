import { IIDGenerator } from '../ports';
import { v4 as uuidv4 } from 'uuid';

export class RandomIDGenerator implements IIDGenerator {
  generate() {
    return uuidv4();
  }
}
