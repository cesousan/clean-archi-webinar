import { Entity } from '@webinar/shared/entity';

type Props = {
  userId: string;
  webinarId: string;
  joinedAt: Date;
};

export class Participation extends Entity<Props> {}
