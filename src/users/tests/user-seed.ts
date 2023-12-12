import { User } from '../entities';

export const testUsers = {
  alice: new User({
    id: 'alice-id',
    email: 'alice@gmail.com',
    password: 'azerty',
  }),
  bob: new User({
    id: 'bob-id',
    email: 'bob@gmail.com',
    password: 'sunisshining',
  }),
};
