import { User } from '../entities';
import { IUserRepository } from '../ports';

type EmailAddress = string;

export class InMemoryUserRepository implements IUserRepository {
  private database = new Map<EmailAddress, User>();

  constructor(public readonly usersDb: User[] = []) {
    usersDb.forEach((user) => this.database.set(user.props.email, user));
  }
  async create(user: User): Promise<{ id: string }> {
    this.database.set(user.props.email, user);
    return { id: user.props.id };
  }
  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    return this.database.get(emailAddress) ?? null;
  }
  async findById(id: string): Promise<User | null> {
    for (const user of this.database.values()) {
      if (user.props.id === id) {
        return user;
      }
    }
    return null;
  }
}
