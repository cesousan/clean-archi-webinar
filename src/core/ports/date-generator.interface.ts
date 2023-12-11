import { InjectionToken } from '@nestjs/common';

export const I_DATE_GENERATOR: InjectionToken<IDateGenerator> =
  Symbol('I_DATE_GENERATOR');
export interface IDateGenerator {
  now(): Date;
}
