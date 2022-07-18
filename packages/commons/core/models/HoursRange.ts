import { Time } from './Time';

interface HoursRangeOptions {
  readonly from: Time;
  readonly to: Time;
}

export class HoursRange {
  readonly from: Time;
  readonly to: Time;

  constructor(
    options: HoursRangeOptions = {
      from: new Time(),
      to: new Time(),
    }
  ) {
    const { from, to } = options;
    this.from = from;
    this.to = to;
  }

  toString(): string {
    return `${this.from.toString()} - ${this.to.toString()}`;
  }
}
