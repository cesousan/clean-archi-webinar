import { Webinar } from '@webinar/entities';

export interface IWebinarRepository {
  create(webinar: Webinar): Promise<void>;
}
