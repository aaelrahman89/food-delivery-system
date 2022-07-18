import { arSA, enGB } from 'date-fns/locale';
import { format } from 'date-fns';

export const availableDateLocales: Record<string, Locale> = Object.freeze({
  ar: arSA,
  en: enGB,
});

const config = { locale: availableDateLocales.en };

export class Time {
  private readonly _value: string;

  constructor(utcTime = '') {
    this._value = utcTime;
  }

  static configure(locale: string): void {
    config.locale = availableDateLocales[locale];
  }

  toString(): string {
    if (this._value) {
      return format(new Date(`2000-01-01T${this._value}.000Z`), 'hh:mm a', {
        locale: config.locale,
      });
    }
    return this._value;
  }

  toLocalTime(): string {
    return format(new Date(`2000-01-01T${this._value}.000Z`), 'HH:mm:ss');
  }

  lt(time: Time | string): boolean {
    return (
      new Date(`2000-01-01 ${this._value.valueOf()}`) <
      new Date(`2000-01-01 ${time.valueOf()}`)
    );
  }

  lte(time: Time | string): boolean {
    return (
      new Date(`2000-01-01 ${this._value.valueOf()}`) <=
      new Date(`2000-01-01 ${time.valueOf()}`)
    );
  }

  gt(time: Time | string): boolean {
    return (
      new Date(`2000-01-01 ${this._value.valueOf()}`) >
      new Date(`2000-01-01 ${time.valueOf()}`)
    );
  }

  gte(time: Time | string): boolean {
    return (
      new Date(`2000-01-01 ${this._value.valueOf()}`) >=
      new Date(`2000-01-01 ${time.valueOf()}`)
    );
  }

  equals(time: Time | string): boolean {
    return (
      new Date(`2000-01-01 ${this._value.valueOf()}`).valueOf() ===
      new Date(`2000-01-01 ${time.valueOf()}`).valueOf()
    );
  }

  notEquals(time: Time | string): boolean {
    return !this.equals(time);
  }

  static fromLocaleTime(localeTime: string): Time {
    const utcTime = new Date(`2000-01-01 ${localeTime}`)
      .toISOString()
      .substring(11, 19);
    return new Time(utcTime);
  }

  valueOf(): string {
    return format(new Date(`2000-01-01 ${this._value}`), 'HH:mm:ss');
  }
}
