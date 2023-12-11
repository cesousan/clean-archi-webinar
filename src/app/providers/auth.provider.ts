import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { InMemoryUserRepository } from '@webinar/adapters';
import { Authenticator } from '@webinar/services/authenticator';

import { AuthGuard } from '../guards';

export const authDependencies = [InMemoryUserRepository];

const authFactory = (repository: InMemoryUserRepository) =>
  new Authenticator(repository);
const authGuardFactory = (auth: Authenticator) => new AuthGuard(auth);

export const authProvider: Provider = {
  provide: Authenticator,
  useFactory: authFactory,
  inject: authDependencies,
};

export const authGuardProvider: Provider = {
  provide: APP_GUARD,
  inject: [Authenticator],
  useFactory: authGuardFactory,
};
