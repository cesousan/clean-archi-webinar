import { Webinar } from '../entities';
import { IWebinarRepository } from '../ports';

export class InMemoryWebinarRepository implements IWebinarRepository {
  private database: Map<string, Webinar> = new Map<string, Webinar>();
  constructor(private seedData: Webinar[] = []) {
    seedData.forEach((webinar) => this.database.set(webinar.props.id, webinar));
  }
  async create(webinar: Webinar) {
    this.database.set(webinar.props.id, webinar);
  }
  async findById(id: string): Promise<Webinar | null> {
    return this.database.has(id)
      ? new Webinar(this.database.get(id)!.initialProps)
      : null;
  }
  async update(webinar: Webinar) {
    webinar.commit();
    this.database.set(webinar.props.id, webinar);
  }
}
