import { Webinar } from '@webinar/webinars/entities';
import {
  IWebinarRepository,
  I_WEBINAR_REPOSITORY,
} from '@webinar/webinars/ports';
import { IFixture } from '../utils/fixture';
import { TestApp } from '../utils/test-app';

export class WebinarFixture implements IFixture {
  constructor(public entity: Webinar) {}

  async load(app: TestApp): Promise<void> {
    const webinarRepository = app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
    await webinarRepository.create(this.entity);
  }
}
