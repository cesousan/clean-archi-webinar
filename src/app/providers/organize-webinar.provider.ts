import { Provider } from '@nestjs/common';

import {
  CurrentDateGenerator,
  InMemoryWebinarRepository,
  RandomIDGenerator,
} from '@webinar/adapters';
import {
  IDateGenerator,
  IIDGenerator,
  IWebinarRepository,
  I_DATE_GENERATOR,
  I_ID_GENERATOR,
  I_WEBINAR_REPOSITORY,
} from '@webinar/ports';
import { OrganizeWebinar } from '@webinar/usecases/organize-webinar';

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
