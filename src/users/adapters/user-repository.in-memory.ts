import { User } from '../entities';
import { IUserRepository } from '../ports';

type EmailAddress = string;

export class InMemoryUserRepository implements IUserRepository {
  private database = new Map<EmailAddress, User>();

  async create(user: User): Promise<{ id: string }> {
    this.database.set(user.props.email, user);
    return { id: user.props.id };
  }
  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    return this.database.get(emailAddress) ?? null;
  }
}
