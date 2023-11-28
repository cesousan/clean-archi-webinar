import { InMemoryUserRepository } from '../adapters/index.testing';
import { User } from '../entities';
import { IUserRepository } from '../ports';

import { Authenticator } from './authenticator';

describe('Service: Authenticator', () => {
  let userRepository: IUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    await userRepository.create(
      new User({
        id: 'id-1',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );
    authenticator = new Authenticator(userRepository);
  });
  describe('Case: the token is valid', () => {
    it('should authenticate the user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:azerty', 'utf-8').toString(
        'base64',
      );
      const user = await authenticator.authenticate(payload);

      expect(user.props).toEqual({
        id: 'id-1',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });
  describe('Case: the user does not exist', () => {
    it('should fail', async () => {
      const payload = Buffer.from('unknown@gmail.com:azerty', 'utf-8').toString(
        'base64',
      );
      const authenticator = new Authenticator(userRepository);
      await expect(() =>
        authenticator.authenticate(payload),
      ).rejects.toThrowError('User not found');
    });
  });
});
