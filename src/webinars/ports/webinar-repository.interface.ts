import { InjectionToken } from '@nestjs/common';
import { Webinar } from '../entities';

export const I_WEBINAR_REPOSITORY: InjectionToken<IWebinarRepository> = Symbol(
  'I_WEBINAR_REPOSITORY',
);

export interface IWebinarRepository {
  findById(id: string): Promise<Webinar | null>;
  create(webinar: Webinar): Promise<void>;
  update(webinar: Webinar): Promise<void>;
}
