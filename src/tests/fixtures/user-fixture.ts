import { User } from '@webinar/users/entities';
import { IUserRepository, I_USER_REPOSITORY } from '@webinar/users/ports';
import { IFixture } from '../utils/fixture';
import { TestApp } from '../utils/test-app';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}
  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
    const user = await userRepository.create(this.entity);
  }

  get authToken() {
    const token = Buffer.from(
      `${this.entity.props.email}:${this.entity.props.password}`,
    ).toString('base64');
    return `Basic ${token}`;
  }
}
