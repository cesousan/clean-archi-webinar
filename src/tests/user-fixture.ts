import { InMemoryUserRepository } from '@webinar/adapters';
import { User } from '@webinar/entities';
import { IUserRepository } from '@webinar/ports';
import { IFixture } from './fixture';
import { TestApp } from './test-app';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}
  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(InMemoryUserRepository);
    const user = await userRepository.create(this.entity);
  }

  get authToken() {
    const token = Buffer.from(
      `${this.entity.props.email}:${this.entity.props.password}`,
    ).toString('base64');
    return `Basic ${token}`;
  }
}
