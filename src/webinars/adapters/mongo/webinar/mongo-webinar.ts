import {
  Schema as MongooseSchema,
  Prop,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export namespace MongoWebinar {
  export const CollectionName = 'webinars';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    organizerId: string;

    @Prop()
    title: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    seats: number;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
