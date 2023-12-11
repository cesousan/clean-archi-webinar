import { Webinar } from '@webinar/entities';

export const I_WEBINAR_REPOSITORY = Symbol('I_WEBINAR_REPOSITORY');

export interface IWebinarRepository {
  findById(id: string): Promise<Webinar | null>;
  create(webinar: Webinar): Promise<void>;
}
