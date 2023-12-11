import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from './adapters/user-repository.in-memory';
import { IUserRepository, I_USER_REPOSITORY } from './ports';
import { Authenticator, I_AUTHENTICATOR } from './services/authenticator';

@Module({
  imports: [],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: I_AUTHENTICATOR,
      useFactory: (repository: IUserRepository) =>
        new Authenticator(repository),
      inject: [I_USER_REPOSITORY],
    },
  ],
  exports: [I_USER_REPOSITORY, I_AUTHENTICATOR],
})
export class UsersModule {}
