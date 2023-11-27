export class DeterministicDateGenerator {
  private _date: Date = new Date('2023-01-01T00:00:00.000Z');
  now() {
    return this._date;
  }
  set date(theDate: Date) {
    this._date = theDate;
  }
}
