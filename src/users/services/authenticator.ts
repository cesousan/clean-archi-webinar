import { InjectionToken } from '@nestjs/common';
import { User } from '../entities';
import { IUserRepository } from '../ports';
import { DomainException } from '@webinar/shared/exception';

export const I_AUTHENTICATOR: InjectionToken<IAuthenticator> =
  Symbol('I_AUTHENTICATOR');
export interface IAuthenticator {
  authenticate(token: string): Promise<User>;
}
export class Authenticator implements IAuthenticator {
  constructor(private readonly userRepository: IUserRepository) {}
  async authenticate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const user = await this.userRepository.findByEmailAddress(email);
    if (user === null) throw new DomainException('User not found');

    return user;
  }
}
