import prettyMs from 'pretty-ms';

export class Duration {
  private readonly _value: number;
  private readonly _timeUnit: 'MINUTES' | 'SECONDS' | 'MILLISECONDS';
  private readonly _compact: boolean;
  private readonly _multipliers = {
    MINUTES: 60 * 1000,
    SECONDS: 1000,
    MILLISECONDS: 1,
  };

  constructor({
    value = 0,
    timeUnit = 'SECONDS',
    compact = false,
  }: DurationArgs) {
    this._value = value;
    this._timeUnit = timeUnit;
    this._compact = compact;
  }

  valueOf(): number {
    return this._value;
  }

  humanize(): string {
    if (!this._value) {
      return '0s';
    }

    return prettyMs(Number(this._value) * this._multipliers[this._timeUnit], {
      compact: this._compact,
    });
  }
}

export const TimeUnits: TimeUnits = {
  MINUTES: 'MINUTES' as const,
  SECONDS: 'SECONDS' as const,
  MILLISECONDS: 'MILLISECONDS' as const,
};

interface DurationArgs {
  value?: number;
  timeUnit?: 'MINUTES' | 'SECONDS' | 'MILLISECONDS';
  compact?: boolean;
}

interface TimeUnits {
  MINUTES: 'MINUTES';
  SECONDS: 'SECONDS';
  MILLISECONDS: 'MILLISECONDS';
}
