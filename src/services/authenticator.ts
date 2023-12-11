import { User } from '@webinar/entities';
import { IUserRepository } from '@webinar/ports';

export interface IAuthenticator {
  authenticate(token: string): Promise<User>;
}
export class Authenticator implements IAuthenticator {
  constructor(private readonly userRepository: IUserRepository) {}
  async authenticate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const user = await this.userRepository.findByEmailAddress(email);
    if (user === null) throw new Error('User not found');

    return user;
  }
}
