import { User } from '@webinar/entities';

export const I_USER_REPOSITORY = Symbol('I_USER_REPOSITORY');

export interface IUserRepository {
  create(user: User): Promise<{ id: string }>;
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
