import { InjectionToken } from '@nestjs/common';
import { User } from '../entities';

export const I_USER_REPOSITORY: InjectionToken<IUserRepository> =
  Symbol('I_USER_REPOSITORY');

export interface IUserRepository {
  create(user: User): Promise<{ id: string }>;
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
