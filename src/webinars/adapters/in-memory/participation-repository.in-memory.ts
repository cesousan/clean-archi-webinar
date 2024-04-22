import { Participation } from '../../entities/participation.entity';
import { IParticipationRepository } from '../../ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  private readonly db = new Map<string, Participation[]>();
  constructor(private readonly participations: Participation[] = []) {
    this.participations.forEach((p) => {
      this.create(p);
    });
  }

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    return this.db.get(webinarId) ?? [];
  }
  async findOneParticipant(
    userId: string,
    webinarId: string,
  ): Promise<Participation | null> {
    const participations = this.db.get(webinarId) ?? [];
    return participations.find((p) => p.props.userId === userId) ?? null;
  }
  async findParticipationCount(webinarId: string): Promise<number> {
    const participations = await this.findByWebinarId(webinarId);
    return participations.length;
  }
  async create(participation: Participation): Promise<void> {
    if (!this.db.has(participation.props.webinarId)) {
      this.db.set(participation.props.webinarId, []);
    }
    this.db.get(participation.props.webinarId)!.push(participation);
  }
  async cancel(participation: Participation): Promise<void> {
    const participations = this.db.get(participation.props.webinarId) ?? [];
    const index = participations.findIndex(
      (p) => p.props.userId === participation.props.userId,
    );
    participations.splice(index, 1);
  }
}
