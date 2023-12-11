import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IAuthenticator } from 'src/services/authenticator';
import { extractToken } from '../extract-token';
import { ca } from 'date-fns/locale';

export class AuthGuard implements CanActivate {
  constructor(private readonly auth: IAuthenticator) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;
    const token = extractToken(authHeader);
    if (!token) return false;

    try {
      const user = await this.auth.authenticate(token);
      request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
