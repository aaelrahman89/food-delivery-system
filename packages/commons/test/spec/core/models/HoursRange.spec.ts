import { HoursRange } from '../../../../core/models/HoursRange';
import { Time } from '../../../../core/models/Time';
import { assert } from 'chai';

describe('HoursRange unit', function () {
  it('expects values of [from, to]', function () {
    const hoursRange = new HoursRange({
      from: new Time('00:00'),
      to: new Time('12:00'),
    });

    assert.deepEqual(hoursRange.from, new Time('00:00'));
    assert.deepEqual(hoursRange.to, new Time('12:00'));
  });

  it('has default values for undefined given range', function () {
    const hoursRange = new HoursRange();

    assert.deepEqual(hoursRange.from, new Time(''));
    assert.deepEqual(hoursRange.to, new Time(''));
  });
  it('stringifies to [h:mm AM/PM - h:mm AM/PM] string', function () {
    const hoursRange = new HoursRange({
      from: Time.fromLocaleTime('00:00'),
      to: Time.fromLocaleTime('12:00'),
    });

    assert.equal(hoursRange.toString(), '12:00 AM - 12:00 PM');
  });
});
