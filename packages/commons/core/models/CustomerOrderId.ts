export class CustomerOrderId {
  private readonly _value: string;

  constructor(value = '0') {
    this._value = value;
  }

  toString(): string {
    return `#${this._value}`;
  }

  valueOf(): string {
    return this._value;
  }
}
