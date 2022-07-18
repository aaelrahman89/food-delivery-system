import { arSA, enGB } from 'date-fns/locale';
import {
  format,
  formatDistance,
  formatDistanceToNow,
  getUnixTime,
} from 'date-fns';

interface DateLocales {
  ar: Locale;
  en: Locale;
  [key: string]: Locale;
}

interface LocaleConfig {
  locale: Locale;
}

interface ConfigureOptions {
  locale: string;
}

export const availableDateLocales: DateLocales = Object.freeze({
  ar: arSA,
  en: enGB,
});

const config: LocaleConfig = { locale: availableDateLocales.en };

export function configure({ locale }: ConfigureOptions): void {
  config.locale = availableDateLocales[locale];
}

export function now(): number {
  return Date.now();
}

export function extractISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function extractUTCDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export class Datetime extends Date {
  readonly _date: Date;
  constructor(unparsedDate: string | number = Date.now()) {
    super(unparsedDate);
    this._date = new Date(unparsedDate);
  }

  humanizeElapsedTime(): string {
    return formatDistanceToNow(this._date, {
      locale: config.locale,
      addSuffix: true,
      includeSeconds: false,
    });
  }

  humanizeDistanceElapsedTime(date: Datetime): string {
    return formatDistance(this._date, date, {
      locale: config.locale,
      addSuffix: true,
      includeSeconds: false,
    });
  }

  humanizeElapsedTimeWithoutSuffix(): string {
    return formatDistanceToNow(this._date, {
      locale: config.locale,
      addSuffix: false,
      includeSeconds: false,
    });
  }

  toUTCDate(): string {
    return extractUTCDate(this._date);
  }

  toISODate(): string {
    return extractISODate(this._date);
  }

  toDatetimeDeprecated(): string {
    return format(this._date, 'yyyy-MM-dd hh:mm a', {
      locale: config.locale,
    });
  }

  toDatetimeString(): string {
    let dateFormat = 'd MMM yyyy hh:mm a';
    if (config.locale == availableDateLocales.ar) {
      dateFormat = 'd MMMM yyyy hh:mm a';
    }
    return format(this._date, dateFormat, {
      locale: config.locale,
    });
  }

  toDateString(): string {
    let dateFormat = 'd MMM yyyy';
    if (config.locale == availableDateLocales.ar) {
      dateFormat = 'd MMMM yyyy';
    }
    return format(this._date, dateFormat, {
      locale: config.locale,
    });
  }

  isBlank(): boolean {
    return !getUnixTime(this._date);
  }
}

export function parseDate(unparsedDate: string | number): Datetime {
  return new Datetime(unparsedDate);
}

export function currentDate(): Datetime {
  return parseDate(now());
}
