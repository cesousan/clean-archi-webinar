import { Entity } from '@webinar/shared/entity';

export type UserProps = {
  id: string;
  email: string;
  password: string;
};

export class User extends Entity<UserProps> {}
