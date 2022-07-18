import Duration from './Duration';
import formatter from 'date-fns/format';

class Clock {
  static date() {
    return new Date();
  }

  static compactDatetimeString() {
    return formatter(Date.now(), 'yyyyMMdd_HHmmss');
  }

  static now() {
    return Date.now();
  }

  static parse(dateString) {
    return new Date(dateString) > 0 ? new Date(dateString) : new Date(0);
  }

  static format(date, { format = 'yyyy-MM-dd hh:mm a' } = {}) {
    return formatter(Clock.parse(date), format);
  }

  static formatTime(time, { format = 'hh:mm a' } = {}) {
    const date = `2000-01-01 ${time}`;
    return formatter(Clock.parse(date), format);
  }

  static elapsedTime({ date, compact = true }) {
    const currentDateEpoch = Date.now();
    const startDateEpoch = new Date(date).getTime();

    return new Duration({
      compact,
      value: currentDateEpoch - startDateEpoch,
      timeUnit: Duration.timeUnits.MILLISECONDS,
    });
  }

  static notEmpty(dateString) {
    return new Date(dateString).getTime() > 0;
  }

  static duration({ start, end, compact = true }) {
    return new Duration({
      compact,
      value: new Date(end).getTime() - new Date(start).getTime(),
      timeUnit: Duration.timeUnits.MILLISECONDS,
    });
  }

  static subtract(leftSide, rightSide) {
    return new Date(leftSide).getTime() - new Date(rightSide).getTime();
  }

  static greaterThan(leftSide, rightSide) {
    return new Date(leftSide).getTime() > new Date(rightSide).getTime();
  }

  static smallerThan(leftSide, rightSide) {
    return new Date(leftSide).getTime() < new Date(rightSide).getTime();
  }

  static equal(leftSide, rightSide) {
    return new Date(leftSide).getTime() === new Date(rightSide).getTime();
  }
}

export default Clock;
