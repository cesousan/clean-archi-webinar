export type WebinarDTO = {
  id: string;
  organizer: {
    id: string;
    email: string;
  };
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  seats: {
    booked: number;
    available: number;
  };
};
