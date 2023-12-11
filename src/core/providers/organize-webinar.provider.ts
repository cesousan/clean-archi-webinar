import { Provider } from '@nestjs/common';

import { CurrentDateGenerator, RandomIDGenerator } from '../adapters';
import {
  IDateGenerator,
  IIDGenerator,
  I_DATE_GENERATOR,
  I_ID_GENERATOR,
} from '../ports';
import { InMemoryWebinarRepository } from '@webinar/webinars/adapters/webinar-repository.in-memory';
import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';
import { OrganizeWebinar } from '@webinar/webinars/usecases/organize-webinar';

export const organizeWebinarDependencies: Provider[] = [
  {
    provide: I_WEBINAR_REPOSITORY,
    useClass: InMemoryWebinarRepository,
  },
  {
    provide: I_ID_GENERATOR,
    useClass: RandomIDGenerator,
  },
  {
    provide: I_DATE_GENERATOR,
    useClass: CurrentDateGenerator,
  },
];

const organizeWebinarFactory = (
  repository: IWebinarRepository,
  idGenerator: IIDGenerator,
  dateGenerator: IDateGenerator,
) => new OrganizeWebinar(repository, idGenerator, dateGenerator);

export const organizeWebinarProvider: Provider = {
  provide: OrganizeWebinar,
  useFactory: organizeWebinarFactory,
  inject: organizeWebinarDependencies.map((d) =>
    'provide' in d ? d.provide : d,
  ),
};
