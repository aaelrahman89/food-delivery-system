import { $sb } from '../../../utils/sandbox';
import {
  Datetime,
  availableDateLocales,
  configure,
  currentDate,
  extractISODate,
  extractUTCDate,
  now,
  parseDate,
} from '../../../../core/utils/datetime';
import { assert } from 'chai';
import { format, formatDistance, formatDistanceToNow } from 'date-fns';

describe('datetime utils module', function () {
  it('Datetime class should use current date time if nothing is passed as parameter', function () {
    const date = new Datetime();
    $sb.stub(Date, 'now').returns(date.getTime());
    assert.equal(new Datetime().toISOString(), date.toISOString());
  });

  describe('availableDateLocales', function () {
    it('should be a read-only object', function () {
      assert.isFrozen(availableDateLocales);
    });

    it('should have arabic and english locales', function () {
      assert.hasAllKeys(availableDateLocales, {
        ar: 'object',
        en: 'object',
      });
    });
  });

  describe('now', function () {
    it('should return current epoch in milliseconds', function () {
      const timeSnapshot = Date.now();

      $sb.stub(Date, 'now').returns(timeSnapshot);

      assert.strictEqual(now(), timeSnapshot);
    });
  });

  describe('extractISODate', function () {
    it('should return an ISO date string in local date', function () {
      const dateSnapshot = new Date('2019-09-25T22:00:00.000Z');

      const hours = dateSnapshot.getHours();
      const timeZoneOffset = dateSnapshot.getTimezoneOffset();

      const localDate = new Date('2019-09-25T22:00:00.000Z');
      localDate.setHours(hours - timeZoneOffset / 60);

      const formattedISODate = localDate.toISOString().substr(0, 10);

      assert.equal(extractISODate(dateSnapshot), formattedISODate);
    });
  });

  describe('extractUTCDate', function () {
    it('should return an ISO date string in local date', function () {
      const dateSnapshot = new Date('2019-09-25T22:00:00.000Z');

      assert.equal(extractUTCDate(dateSnapshot), '2019-09-25');
    });
  });

  describe('parseDate', function () {
    it('should return a date instance', function () {
      const date = parseDate('2010-01-01');

      assert.instanceOf(date, Date);
    });

    it('should extend the parsed date with method to humanize elapsed time', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2010-01-01');

      assert.equal(
        date.humanizeElapsedTime(),
        formatDistanceToNow(new Date('2010-01-01'), {
          locale: availableDateLocales.ar,
          addSuffix: true,
          includeSeconds: false,
        })
      );
    });

    it('should extend the parsed date with method to humanize distance elapsed time', function () {
      configure({ locale: 'en' });
      const date1 = parseDate('2010-01-01');
      const date2 = parseDate('2010-02-01');

      assert.equal(
        date1.humanizeDistanceElapsedTime(date2),
        formatDistance(new Datetime('2010-01-01'), new Datetime('2010-02-01'), {
          addSuffix: true,
          includeSeconds: false,
        })
      );
    });

    it('isBlank should return true if the date is set to the default value and false otherwise', function () {
      configure({ locale: 'en' });
      const date1 = new Datetime(0);
      const date2 = new Datetime('2010-02-01');

      assert.isTrue(date1.isBlank());
      assert.isFalse(date2.isBlank());
    });

    it('should extend the parsed date with method to humanize elapsed without suffix', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2010-01-01');

      assert.equal(
        date.humanizeElapsedTimeWithoutSuffix(),
        formatDistanceToNow(new Date('2010-01-01'), {
          locale: availableDateLocales.ar,
          addSuffix: false,
          includeSeconds: false,
        })
      );
    });
    it('should extend the parsed date with a method to get UTC ISO formatted Date only', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2010-01-01');

      assert.equal(date.toUTCDate(), extractUTCDate(new Date('2010-01-01')));
    });
    it('should extend the parsed date with a method to get local ISO formatted Date only', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2010-01-01');

      assert.equal(date.toISODate(), extractISODate(new Date('2010-01-01')));
    });

    it('should extend the parsed date with a method to format datetime to the minute part in AM/PM configuration', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2019-10-07T23:23:56.056Z');

      assert.equal(
        date.toDatetimeDeprecated(),
        format(new Date('2019-10-07T23:23:56.056Z'), 'yyyy-MM-dd hh:mm a', {
          locale: availableDateLocales.ar,
        })
      );
    });
  });

  describe('currentDate', function () {
    it('should return a new parsedDate with the value of Date.now', function () {
      const timeSnapshot = Date.now();

      $sb.stub(Date, 'now').returns(timeSnapshot);

      assert.deepEqual(currentDate(), parseDate(Date.now()));
    });
  });

  describe('toDatetimeString', function () {
    it('formats the the date with short month name when locale is english', function () {
      configure({ locale: 'en' });
      const date = parseDate('2019-01-05T15:00:00.000Z');

      assert.equal(date.toDatetimeString(), format(date, 'd MMM yyyy hh:mm a'));
    });
    it('formats the the date with full month name when locale is arabic', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2019-01-05T15:00:00.000Z');

      assert.equal(
        date.toDatetimeString(),
        format(date, 'd MMMM yyyy hh:mm a', { locale: availableDateLocales.ar })
      );
    });
  });

  describe('toDateString', function () {
    it('formats the the date with short month name when locale is english', function () {
      configure({ locale: 'en' });
      const date = parseDate('2019-01-05T15:00:00.000Z');

      assert.equal(date.toDateString(), format(date, 'd MMM yyyy'));
    });
    it('formats the the date with full month name when locale is arabic', function () {
      configure({ locale: 'ar' });
      const date = parseDate('2019-01-05T15:00:00.000Z');

      assert.equal(
        date.toDateString(),
        format(date, 'd MMMM yyyy', { locale: availableDateLocales.ar })
      );
    });
  });
});
