import { User } from '@webinar/entities';
import { UserFixture } from './user-fixture';

const johnDoe = new UserFixture(
  new User({
    id: 'john-doe',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  }),
);

export const e2eUsers = {
  johnDoe,
};
