export const I_DATE_GENERATOR = Symbol('I_DATE_GENERATOR');
export interface IDateGenerator {
  now(): Date;
}
