import Duration from '../../../../../src/core/deprecated/etc/Duration';
import { assert } from 'chai';

describe('Duration Unit', function () {
  it('should return 0s if no value is given', function () {
    const duration = new Duration();

    assert.equal(duration.humanize(), '0s');
  });
  it('should default to seconds multiplier given no timeUnit param', function () {
    const duration = new Duration({ value: 1234 });

    assert.equal(duration.humanize(), '20m 34s');
  });
  it('should parse duration in milliseconds given timeUnit param = "milliseconds"', function () {
    const duration = new Duration({ value: 8000, timeUnit: 'milliseconds' });

    assert.equal(duration.humanize(), '8s');
  });

  it('should return 0 if value was less than 1 second', function () {
    const duration = new Duration({ value: 300, timeUnit: 'milliseconds' });

    assert.equal(duration.humanize(), '0s');
  });

  it('should have a lookup for timeUnits', function () {
    assert.deepEqual(Duration.timeUnits, {
      SECONDS: 'seconds',
      MINUTES: 'minutes',
      MILLISECONDS: 'milliseconds',
    });
  });
});
