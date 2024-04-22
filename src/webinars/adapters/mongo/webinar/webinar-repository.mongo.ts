import { Model } from 'mongoose';
import { diff as deepObjectDiff } from 'deep-object-diff';

import { IWebinarRepository } from '@webinar/webinars/ports';

import { Webinar } from '@webinar/webinars/entities';
import { MongoWebinar } from './mongo-webinar';

export class MongoWebinarRepository implements IWebinarRepository {
  constructor(private readonly model: Model<MongoWebinar.SchemaClass>) {}

  async create(webinar: Webinar): Promise<void> {
    const record = new this.model(WebinarMapper.toPersistence(webinar));
    await record.save();
  }
  async update(webinar: Webinar): Promise<void> {
    const record = await this.model.findById(webinar.props.id);
    if (!record) {
      return;
    }

    const diff = deepObjectDiff(webinar.initialState, webinar.props);

    await record.updateOne(diff);
    webinar.commit();
  }

  async delete(webinar: Webinar): Promise<void> {
    await this.model.deleteOne({ _id: webinar.props.id });
  }

  async findById(id: string): Promise<Webinar | null> {
    const record = await this.model.findById(id);
    if (!record) {
      return null;
    }
    return WebinarMapper.toDomain(record);
  }
}

export class WebinarMapper {
  static toDomain(record: MongoWebinar.SchemaClass): Webinar {
    return new Webinar({
      id: record._id,
      organizerId: record.organizerId,
      title: record.title,
      startDate: record.startDate,
      endDate: record.endDate,
      seats: record.seats,
    });
  }
  static toPersistence(webinar: Webinar): MongoWebinar.SchemaClass {
    return {
      _id: webinar.props.id,
      organizerId: webinar.props.organizerId,
      title: webinar.props.title,
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
      seats: webinar.props.seats,
    };
  }
}
