import { Model } from 'mongoose';

import { Participation } from '@webinar/webinars/entities/participation.entity';
import { IParticipationRepository } from '@webinar/webinars/ports/participation-repository.interface';

import { MongoParticipation } from './mongo-participation';

export class MongoParticipationRepository implements IParticipationRepository {
  constructor(private readonly model: Model<MongoParticipation.SchemaClass>) {}

  async create(participation: Participation): Promise<void> {
    const record = new this.model(
      ParticipationMapper.toPersistence(participation),
    );
    await record.save();
  }
  async cancel(participation: Participation): Promise<void> {
    const participationId =
      MongoParticipation.SchemaClass.makeId(participation);
    await this.model.deleteOne({ _id: participationId });
  }
  async findOneParticipant(
    userId: string,
    webinarId: string,
  ): Promise<Participation | null> {
    const record = await this.model.findOne({ userId, webinarId });
    if (!record) {
      return null;
    }
    return ParticipationMapper.toDomain(record);
  }
  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    const participations = await this.model.find({ webinarId });
    return participations.map(ParticipationMapper.toDomain);
  }
  async findParticipationCount(webinarId: string): Promise<number> {
    return this.model.countDocuments({ webinarId });
  }
}

export class ParticipationMapper {
  static toDomain(record: MongoParticipation.SchemaClass): Participation {
    return new Participation({
      userId: record.userId,
      webinarId: record.webinarId,
      joinedAt: record.joinedAt,
    });
  }
  static toPersistence(
    participation: Participation,
  ): MongoParticipation.SchemaClass {
    return {
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
      joinedAt: participation.props.joinedAt,
    };
  }
}
