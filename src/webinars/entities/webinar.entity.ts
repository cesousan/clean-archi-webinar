import { Entity } from '@webinar/shared/entity';
import { User } from '@webinar/users/entities';
import { differenceInDays } from 'date-fns';

export interface WebinarProps {
  id: string;
  organizerId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
}

export class Webinar extends Entity<WebinarProps> {
  private static readonly ALLOWED_DAYS_IN_ADVANCE = 3;
  private static readonly MINIMUM_ALLOWED_SEATS = 1;
  private static readonly MAXIMUM_ALLOWED_SEATS = 1000;

  isTooClose(now: Date) {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < Webinar.ALLOWED_DAYS_IN_ADVANCE;
  }
  hasTooManySeats() {
    return this.props.seats > Webinar.MAXIMUM_ALLOWED_SEATS;
  }
  hasNoSeats() {
    return this.props.seats < Webinar.MINIMUM_ALLOWED_SEATS;
  }
  isOrganizer(user: User) {
    return this.props.organizerId === user.props.id;
  }
}
