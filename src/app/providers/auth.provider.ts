import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { InMemoryUserRepository } from '@webinar/adapters';
import { IUserRepository, I_USER_REPOSITORY } from '@webinar/ports';
import { Authenticator } from '@webinar/services/authenticator';
import { AuthGuard } from '../guards';

export const authDependencies: Provider[] = [
  {
    provide: I_USER_REPOSITORY,
    useClass: InMemoryUserRepository,
  },
];

const authFactory = (repository: IUserRepository) =>
  new Authenticator(repository);
const authGuardFactory = (auth: Authenticator) => new AuthGuard(auth);

export const authProvider: Provider = {
  provide: Authenticator,
  useFactory: authFactory,
  inject: authDependencies.map((d) => ('provide' in d ? d.provide : d)),
};

export const authGuardProvider: Provider = {
  provide: APP_GUARD,
  inject: [Authenticator],
  useFactory: authGuardFactory,
};
