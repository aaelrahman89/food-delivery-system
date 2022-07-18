import date from 'date-and-time';
import prettyMs from 'pretty-ms';
import { assert } from 'chai';
import * as formatters from '../../../../../src/shell/services-deprecated/formatters/formatters';

describe('Filters Module', function () {
  it('should return empty string on falsy values', function () {
    const falsyValues = [undefined, null, false, ''];
    falsyValues.forEach((value) => {
      Object.keys(formatters).forEach((key) => {
        // eslint-disable-next-line import/namespace
        assert.isEmpty(formatters[key](value));
      });
    });
  });

  describe('Date/Time Filters', function () {
    it('should be able to format to date', function () {
      const testDates = [
        '2018-09-05T11:04:53.178Z',
        'Sat, 13 Oct 2018 10:43:15 GMT',
      ];

      testDates.forEach((value) => {
        const formattedDate = formatters.formatDate(value);
        const momentDate = date.format(new Date(value), '\u200EYYYY-MM-DD');

        assert.equal(formattedDate, momentDate);
      });
    });

    it('should be able to format time', function () {
      const testDates = [
        '2018-09-05T11:04:53.178Z',
        'Sat, 13 Oct 2018 10:43:15 GMT',
      ];

      testDates.forEach((value) => {
        const formattedTime = formatters.formatTime(value);
        const momentTime = date.format(new Date(value), '\u200Ehh:mm A');

        assert.equal(formattedTime, momentTime);
      });
    });

    it('should be able to format datetime', function () {
      const testDates = [
        '2018-09-05T11:04:53.178Z',
        'Sat, 13 Oct 2018 10:43:15 GMT',
      ];

      testDates.forEach((value) => {
        const formattedDate = formatters.formatDateTime(value);
        const momentDate = date.format(
          new Date(value),
          '\u200EYYYY-MM-DD hh:mm A\u200E'
        );

        assert.equal(formattedDate, momentDate);
      });
    });
  });

  it('should convert distance from meters to kilometers', function () {
    const testData = [1000, 2000, 1234, 344, 22, 4412];
    testData.forEach((data) => {
      const kilometers = `\u200E${(data / 1000).toFixed(2)} KM`;
      assert.equal(formatters.formatDistance(data), kilometers);
    });
  });

  it('should formatDuration from seconds to minutes and seconds', function () {
    const testData = [12345678990, 4893, 9, 4121312, 41424444];
    testData.forEach((data) => {
      const output = prettyMs(data * 1000);
      assert.equal(formatters.formatDuration(data), output);
    });
  });

  it('should convert formatDuration to humanized format', function () {
    const value = Date.now();
    const testData = Math.floor(value);

    const output = prettyMs(testData * 1000);
    // moment.formatDuration(testData, 'seconds').humanize();
    assert.equal(formatters.formatDuration(testData), output);
  });
});
