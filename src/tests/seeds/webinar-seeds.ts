import { Webinar } from '@webinar/webinars/entities';
import { WebinarFixture } from '../fixtures/webinar-fixture';
import { e2eUsers } from './user-seeds';
import { addDays } from 'date-fns';

export const e2eWebinars = {
  webinarJane: new WebinarFixture(
    new Webinar({
      id: 'id-1',
      title: 'My first webinar',
      seats: 50,
      startDate: addDays(new Date(), 4),
      endDate: addDays(new Date(), 5),
      organizerId: e2eUsers.janeDoe.entity.props.id,
    }),
  ),
  webinarJohn: new WebinarFixture(
    new Webinar({
      id: 'id-2',
      title: 'My first webinar',
      seats: 50,
      startDate: addDays(new Date(), 4),
      endDate: addDays(new Date(), 5),
      organizerId: e2eUsers.johnDoe.entity.props.id,
    }),
  ),
};
