import { User } from '@webinar/users/entities';
import { UserFixture } from '../fixtures/user-fixture';

const johnDoe = new UserFixture(
  new User({
    id: 'john-doe',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  }),
);
const janeDoe = new UserFixture(
  new User({
    id: 'jane-doe',
    email: 'janedoe@gmail.com',
    password: 'zoubida',
  }),
);

export const e2eUsers = {
  johnDoe,
  janeDoe,
};
