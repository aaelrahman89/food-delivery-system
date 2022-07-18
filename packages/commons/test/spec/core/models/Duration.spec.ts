import prettyMs from 'pretty-ms';
import { Duration, TimeUnits } from '../../../../core/models/Duration';
import { assert } from 'chai';

describe('Duration', function () {
  describe('humanize', function () {
    it('initializes with default values', function () {
      assert.equal(new Duration({}).humanize(), '0s');
    });

    it('humanizes durations in seconds correctly', function () {
      assert.equal(
        new Duration({ value: 100, timeUnit: TimeUnits.SECONDS }).humanize(),
        prettyMs(100 * 1000)
      );
    });

    it('humanizes durations in minutes correctly', function () {
      assert.equal(
        new Duration({ value: 100, timeUnit: TimeUnits.MINUTES }).humanize(),
        prettyMs(100 * 1000 * 60)
      );
    });

    it('humanizes durations in milliseconds correctly', function () {
      assert.equal(
        new Duration({
          value: 100,
          timeUnit: TimeUnits.MILLISECONDS,
        }).humanize(),
        prettyMs(100)
      );
    });
  });

  it('returns 0s if value given was zero regardless of time unit', function () {
    assert.equal(
      new Duration({
        value: 0,
        timeUnit: TimeUnits.MILLISECONDS,
      }).humanize(),
      '0s'
    );
  });

  it('implements valueOf()', function () {
    assert.equal(
      new Duration({ value: 100, timeUnit: TimeUnits.MINUTES }).valueOf(),
      100
    );
  });
});
