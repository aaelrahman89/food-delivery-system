import { $sb } from '../../../utils/sandbox';
import { Time } from '../../../../core/models/Time';
import { assert } from 'chai';

describe('Time unit', function () {
  it('defaults to empty string', function () {
    assert.equal(new Time().valueOf(), '00:00:00');
    assert.equal(new Time().toString(), '');
  });

  describe('lt', function () {
    it('checks if the time was less than given time', function () {
      assert.isTrue(new Time('10:00').lt('11:00'));
      assert.isTrue(new Time('10:00').lt(new Time('11:00')));
    });
  });

  describe('lte', function () {
    it('checks if the time was less than or equal given time', function () {
      assert.isTrue(new Time('10:00').lte('10:00'));
      assert.isTrue(new Time('10:00').lte(new Time('10:00')));
    });
  });

  describe('gt', function () {
    it('checks if the time was greater than given time', function () {
      assert.isTrue(new Time('10:00').gt('08:00'));
      assert.isTrue(new Time('10:00').gt(new Time('08:00')));
    });
  });

  describe('gte', function () {
    it('checks if the time was greater than or equal given time', function () {
      assert.isTrue(new Time('10:00').gte('10:00'));
      assert.isTrue(new Time('10:00').gte(new Time('10:00')));
    });
  });

  describe('equals', function () {
    it('checks if the time equals given time', function () {
      assert.isTrue(new Time('10:00').equals('10:00'));
      assert.isTrue(new Time('10:00').equals(new Time('10:00')));
    });
  });

  describe('notEquals', function () {
    it('checks if the time not equals given time', function () {
      assert.isTrue(new Time('10:00').notEquals('11:00'));
      assert.isTrue(new Time('10:00').notEquals(new Time('11:00')));
    });
  });

  describe('toString()', function () {
    it('returns given UTC time formatted in 12H format and in locale time', function () {
      const time = new Time('12:59:00');

      assert.equal(time.toString(), '02:59 PM');
    });

    it('formats [10 PM, 11 PM, 12 PM] UTC times correctly', function () {
      let time = new Time('22:00:00');
      assert.equal(time.toString(), '12:00 AM');

      time = new Time('23:00:00');
      assert.equal(time.toString(), '01:00 AM');

      time = new Time('00:00:00');
      assert.equal(time.toString(), '02:00 AM');
    });

    it('does not pad single digit hours by 0 ', function () {
      const time = new Time('05:05:00');

      assert.equal(time.toString(), '07:05 AM');
    });

    it('respects configured locale on formatting time', function () {
      Time.configure('ar');

      const time = new Time('05:05:00');
      assert.equal(time.toString(), '07:05 ص');
    });
  });

  describe('valueOf()', function () {
    it('returns given time formatted in 24H format', function () {
      const time = new Time('12:59:59');

      assert.equal(time.valueOf(), '12:59:59');
    });

    it('pads single digit hours by 0 ', function () {
      const time = new Time('5:05:00');

      assert.equal(time.valueOf(), '05:05:00');
    });
  });

  describe('toLocalTime', function () {
    it('returns given UTC time formatted in 24H format and in locale time', function () {
      const time = new Time('12:59:59');

      assert.equal(time.toLocalTime(), '14:59:59');
    });
  });

  describe('fromLocaleTime()', function () {
    it('returns Time from given locale time', function () {
      $sb
        .stub(Date.prototype, 'toISOString')
        .returns('2020-01-01T08:00:00.000Z');

      assert.deepEqual(Time.fromLocaleTime('10:00'), new Time('08:00:00'));
    });
  });
});
