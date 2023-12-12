import { Module } from '@nestjs/common';

import { CurrentDateGenerator, RandomIDGenerator } from './adapters';
import { I_DATE_GENERATOR, I_ID_GENERATOR } from './ports';

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
  ],
  exports: [I_ID_GENERATOR, I_DATE_GENERATOR],
})
export class CommonModule {}
