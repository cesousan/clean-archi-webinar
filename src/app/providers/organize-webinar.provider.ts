import { Provider } from '@nestjs/common';

import {
  CurrentDateGenerator,
  InMemoryWebinarRepository,
  RandomIDGenerator,
} from '@webinar/adapters';
import { OrganizeWebinar } from '@webinar/usecases/organize-webinar';

export const organizeWebinarDependencies = [
  InMemoryWebinarRepository,
  RandomIDGenerator,
  CurrentDateGenerator,
];

const organizeWebinarFactory = (
  repository: InMemoryWebinarRepository,
  idGenerator: RandomIDGenerator,
  dateGenerator: CurrentDateGenerator,
) => new OrganizeWebinar(repository, idGenerator, dateGenerator);

export const organizeWebinarProvider: Provider = {
  provide: OrganizeWebinar,
  useFactory: organizeWebinarFactory,
  inject: organizeWebinarDependencies,
};
