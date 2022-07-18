import prettyMs from 'pretty-ms';

class Duration {
  constructor({ value = 0, timeUnit = 'seconds', compact = false } = {}) {
    this.value = value;
    this.multiplier = Duration.multipliers[timeUnit];

    if (!this.multiplier) {
      throw new Error('invalid time unit');
    }
    this._compact = compact;
  }

  humanize() {
    if (
      (this.multiplier == Duration.multipliers.milliseconds &&
        this.value < 1000) ||
      !this.value
    ) {
      return '0s';
    }
    return prettyMs(Number(this.value) * this.multiplier, {
      compact: this._compact,
    });
  }

  static get multipliers() {
    return {
      milliseconds: 1,
      seconds: 1000,
      minutes: 60 * 1000,
    };
  }

  static get timeUnits() {
    return {
      MINUTES: 'minutes',
      SECONDS: 'seconds',
      MILLISECONDS: 'milliseconds',
    };
  }
}

export default Duration;
