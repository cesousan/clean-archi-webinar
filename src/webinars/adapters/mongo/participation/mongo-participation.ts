import {
  Schema as MongooseSchema,
  Prop,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Participation } from '@webinar/webinars/entities/participation.entity';

import { HydratedDocument } from 'mongoose';

export namespace MongoParticipation {
  export const CollectionName = 'participations';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    userId: string;

    @Prop()
    webinarId: string;

    @Prop()
    joinedAt: Date;

    static makeId(participation: Participation): string {
      return `${participation.props.userId}:${participation.props.webinarId}`;
    }
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
