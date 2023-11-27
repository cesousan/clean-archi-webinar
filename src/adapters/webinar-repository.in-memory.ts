import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';

export class InMemoryWebinarRepository implements IWebinarRepository {
  public database: Map<string, Webinar> = new Map<string, Webinar>();
  async create(webinar: Webinar) {
    this.database.set(webinar.props.id, webinar);
  }
}
