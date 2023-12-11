import { InjectionToken } from '@nestjs/common';

export const I_ID_GENERATOR: InjectionToken<IIDGenerator> =
  Symbol('I_ID_GENERATOR');
export interface IIDGenerator {
  generate(): string;
}
