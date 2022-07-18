import Duration from '../../../core/deprecated/etc/Duration';
import date from 'date-and-time';

/**
 * format date
 * @param {string} value time ISO UTC
 * @returns {string} formatted date
 */
export function formatDate(value) {
  if (!value) {
    return '';
  }
  const defaultFormat = '\u200EYYYY-MM-DD';
  return date.format(new Date(value), defaultFormat);
}

export function formatTime(value) {
  if (!value) {
    return '';
  }
  const defaultFormat = '\u200Ehh:mm A';
  return date.format(new Date(value), defaultFormat);
}

/**
 * format datetime
 * @param {string} value time ISO UTC
 * @returns {string} formatted date
 */
export function formatDateTime(value) {
  if (!value) {
    return '';
  }
  const defaultFormat = '\u200EYYYY-MM-DD hh:mm A\u200E';
  return date.format(new Date(value), defaultFormat);
}

/**
 * format distance in kilometers
 * @param meters
 * @returns {string}
 */
export function formatDistance(meters) {
  if (meters === 0.0) {
    return '0.00 KM';
  }
  if (!meters) {
    return '';
  }
  return `\u200E${(meters / 1000).toFixed(2)} KM`;
}

/**
 * format duration to be human readable "minutes and seconds"
 * @param time
 * @returns {string}
 */

/**
 * format duration to be more human readable "years, months, days, hours, minutes, seconds"
 * @param seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds) {
    return '';
  }
  return new Duration({ value: seconds }).humanize();
}
