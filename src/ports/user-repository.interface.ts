import { User } from '../entities';

export interface IUserRepository {
  create(user: User): Promise<{ id: string }>;
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
