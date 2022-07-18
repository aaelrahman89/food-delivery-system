// eslint-disable-next-line max-classes-per-file
import { EnumClass } from './EnumClass';

export class Currency extends EnumClass {
  protected readonly _prefix = 'CURRENCY';
  static EGP = new Currency('EGP');
  constructor(value = 'EGP') {
    super(value);
  }
}

export interface MoneyOptions {
  amount: number;
  currency: string;
}

export class Money {
  private readonly value: number;
  readonly currency: Currency;

  constructor(options: MoneyOptions = { amount: 0, currency: 'EGP' }) {
    const { amount, currency } = options;
    this.value = amount;
    this.currency = new Currency(currency);
  }

  toString(): string {
    return Number(this.value).toFixed(2);
  }

  toAccountingFormat(): string {
    if (this.value < 0) {
      return `(${Math.abs(this.value).toFixed(2)})`;
    }
    return Number(this.value).toFixed(2);
  }

  add(amount: Money | number): Money {
    return new Money({
      amount: this.value + amount.valueOf(),
      currency: this.currency.valueOf(),
    });
  }

  equals(operand: Money | number): boolean {
    return operand.valueOf() == this.valueOf();
  }

  notEqual(operand: Money | number): boolean {
    return !this.equals(operand);
  }

  valueOf(): number {
    return Number(this.value);
  }

  isPositive(): boolean {
    return this.value > 0;
  }

  isNegative(): boolean {
    return this.value < 0;
  }

  toAbsolute(): number {
    return Math.abs(this.value);
  }
}

export function money(options: MoneyOptions): Money {
  const { amount, currency } = options;
  return new Money({ amount, currency });
}
