import { Webinar } from '@webinar/entities';
import { IWebinarRepository } from '@webinar/ports';

export class InMemoryWebinarRepository implements IWebinarRepository {
  private database: Map<string, Webinar> = new Map<string, Webinar>();
  async create(webinar: Webinar) {
    this.database.set(webinar.props.id, webinar);
  }
  async findById(id: string): Promise<Webinar | null> {
    return this.database.get(id) ?? null;
  }
}
