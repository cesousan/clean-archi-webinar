import { Provider } from '@nestjs/common';

import {
  CurrentDateGenerator,
  InMemoryWebinarRepository,
  RandomIDGenerator,
} from '../../adapters';
import { OrganizeWebinar } from '../../usecases/organize-webinar';

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
