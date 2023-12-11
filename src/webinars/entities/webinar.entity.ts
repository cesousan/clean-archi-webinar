import { differenceInDays } from 'date-fns';

export interface WebinarProps {
  id: string;
  organizerId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
}

export class Webinar {
  private static readonly ALLOWED_DAYS_IN_ADVANCE = 3;
  private static readonly MAXIMUM_ALLOWED_SEATS = 1000;
  constructor(public props: WebinarProps) {}

  isTooClose(now: Date) {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < Webinar.ALLOWED_DAYS_IN_ADVANCE;
  }
  hasTooManySeats() {
    return this.props.seats > Webinar.MAXIMUM_ALLOWED_SEATS;
  }
  hasNoSeats() {
    return this.props.seats < 1;
  }
}
