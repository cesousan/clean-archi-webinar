import { Module } from '@nestjs/common';

import { CurrentDateGenerator, RandomIDGenerator } from './adapters';
import { I_DATE_GENERATOR, I_ID_GENERATOR } from './ports';
import { I_EMAILER } from './ports/mailer.interface';
import { InMemoryMailer } from './adapters/mailer.in-memory';

@Module({
  providers: [
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIDGenerator,
    },
    {
      provide: I_DATE_GENERATOR,
      useClass: CurrentDateGenerator,
    },
    {
      provide: I_EMAILER,
      useClass: InMemoryMailer,
    },
  ],
  exports: [I_ID_GENERATOR, I_DATE_GENERATOR, I_EMAILER],
})
export class CommonModule {}
