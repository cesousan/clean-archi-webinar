import { IIDGenerator } from '@webinar/core/ports';

export class DeterministicIDGenerator implements IIDGenerator {
  constructor(private readonly id: string = '1') {}
  generate() {
    return `id-${this.id}`;
  }
}
