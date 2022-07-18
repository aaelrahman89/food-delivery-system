import Clock from '../../../../../src/core/deprecated/etc/Clock';
import Duration from '../../../../../src/core/deprecated/etc/Duration';
import format from 'date-fns/format';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';

describe('Clock Unit', function () {
  it('should construct new date from global Date object', function () {
    const date = new Date();
    const globalDateMock = $sb
      .mock(global)
      .expects('Date')
      .once()
      .withExactArgs()
      .returns(date);

    assert.deepEqual(Clock.date(), date);

    globalDateMock.verify();
  });

  it('should get compactDate string in yyyyMMdd_HHmmss format', function () {
    const currentTime = new Date();
    $sb.stub(Date, 'now').returns(currentTime.getTime());

    assert.equal(
      Clock.compactDatetimeString(),
      format(currentTime, 'yyyyMMdd_HHmmss')
    );
  });

  it('should get current time in unix epoch', function () {
    const now = Date.now();

    const dateMock = $sb
      .mock(Date)
      .expects('now')
      .once()
      .withExactArgs()
      .returns(now);

    assert.deepEqual(Clock.now(), now);

    dateMock.verify();
  });

  it('should parse date strings', function () {
    assert.deepEqual(
      Clock.parse('2014-02-11T11:30:30'),
      new Date('2014-02-11T11:30:30')
    );
  });

  it('should format dates', function () {
    assert.equal(
      Clock.format('2014-02-11T11:30:30', { format: 'yyyy-MM-dd hh:mm:ss a' }),
      '2014-02-11 11:30:30 AM'
    );
  });

  it('should format dates to yyyy-MM-dd hh:mm A as default', function () {
    assert.equal(Clock.format('2014-02-11T13:30:30'), '2014-02-11 01:30 PM');
  });

  it('should format time', function () {
    assert.equal(
      Clock.formatTime('11:30:30', { format: 'hh:mm:ss a' }),
      '11:30:30 AM'
    );
  });

  it('should format time to hh:mm A as default', function () {
    assert.equal(Clock.formatTime('13:30:30'), '01:30 PM');
  });

  it('should calculate elapsedTime since given date and return the Duration compact by default', function () {
    $sb.stub(Date, 'now').returns(300);

    assert.deepEqual(
      Clock.elapsedTime({ date: '2019-01-01T00:00:00' }),
      new Duration({
        value: Clock.now() - new Date('2019-01-01T00:00:00').getTime(),
        timeUnit: Duration.timeUnits.MILLISECONDS,
        compact: true,
      })
    );
  });

  it('should be able display elapsedTime as non compact', function () {
    $sb.stub(Date, 'now').returns(300);

    assert.deepEqual(
      Clock.elapsedTime({ date: '2019-01-01T00:00:00', compact: false }),
      new Duration({
        value: Clock.now() - new Date('2019-01-01T00:00:00').getTime(),
        timeUnit: Duration.timeUnits.MILLISECONDS,
        compact: false,
      })
    );
  });

  it('should calculate elapsedTime since given date and return the Duration compact by default', function () {
    $sb.stub(Date, 'now').returns(300);

    assert.deepEqual(
      Clock.elapsedTime({ date: '2019-01-01T00:00:00' }),
      new Duration({
        value: Clock.now() - new Date('2019-01-01T00:00:00').getTime(),
        timeUnit: Duration.timeUnits.MILLISECONDS,
        compact: true,
      })
    );
  });

  it('should be able display elapsedTime as non compact', function () {
    $sb.stub(Date, 'now').returns(300);

    assert.deepEqual(
      Clock.elapsedTime({ date: '2019-01-01T00:00:00', compact: false }),
      new Duration({
        value: Clock.now() - new Date('2019-01-01T00:00:00').getTime(),
        timeUnit: Duration.timeUnits.MILLISECONDS,
        compact: false,
      })
    );
  });

  it('should calculate duration between two durations as compact by default', function () {
    assert.deepEqual(
      Clock.duration({
        start: '2019-01-01T00:00:00',
        end: '2019-01-01T00:00:01', // 1 second difference
      }),
      new Duration({
        value: 1000,
        timeUnit: Duration.timeUnits.MILLISECONDS,
        compact: true,
      })
    );
  });

  it('should have greaterThan working correctly', function () {
    assert.isTrue(
      Clock.greaterThan('2019-01-02T00:00:00', '2019-01-01T00:00:00')
    );
    assert.isFalse(
      Clock.greaterThan('2019-01-01T00:00:00', '2019-01-02T00:00:00')
    );
  });

  it('should have smallerThan working correctly', function () {
    assert.isTrue(
      Clock.smallerThan('2019-01-01T00:00:00', '2019-01-02T00:00:00')
    );
    assert.isFalse(
      Clock.smallerThan('2019-01-02T00:00:00', '2019-01-01T00:00:00')
    );
  });

  it('should have equal working correctly', function () {
    assert.isTrue(Clock.equal('2019-01-01T00:00:00', '2019-01-01T00:00:00'));
    assert.isFalse(Clock.equal('2019-01-01T00:00:00', '2019-01-02T00:00:00'));
  });

  it('notEmpty should return true if date was valid', function () {
    assert.isTrue(Clock.notEmpty('2018-09-05T19:04:53.178Z'));
  });

  it('notEmpty should return false if date was 0 ("1970-01-01T00:00:00.0Z")', function () {
    assert.isFalse(Clock.notEmpty('1970-01-01T00:00:00.0Z'));
  });
  it('should be able to subtract two arbitrary dates whether dates are numbers, strings or date objects', function () {
    assert.equal(
      Clock.subtract(
        '2000-01-01T00:00:30.0Z',
        new Date('2000-01-01T00:00:00.0Z')
      ),
      30 * 1000
    );
  });
});
