import { InjectionToken } from '@nestjs/common';

export type Email = {
  to: string;
  subject: string;
  body: string;
};

export const I_EMAILER: InjectionToken<IEmailer> = Symbol('I_EMAILER');

export interface IEmailer {
  send: (email: Email) => Promise<void>;
}
