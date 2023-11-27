import { Webinar } from '../entities';

export interface IWebinarRepository {
  create(webinar: Webinar): Promise<void>;
}
