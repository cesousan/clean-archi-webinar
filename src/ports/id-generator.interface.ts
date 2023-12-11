export const I_ID_GENERATOR = Symbol('I_ID_GENERATOR');
export interface IIDGenerator {
  generate(): string;
}
