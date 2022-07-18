import { isNotEmpty } from '../utils/checks';

export abstract class EnumClass {
  readonly value: string;
  protected abstract readonly _prefix: string;

  protected constructor(value: string) {
    this.value = value;
  }

  valueOf(): string {
    return this.value;
  }

  toString(): string {
    return `${this._prefix}_${this.value}`;
  }

  equals(operand: EnumClass | string): boolean {
    return isNotEmpty(operand) && operand.valueOf() == this.valueOf();
  }

  notEqual(operand: EnumClass | string): boolean {
    return !this.equals(operand);
  }

  in(operands: EnumClass[] | string[]): boolean {
    return operands.some(
      (operand: EnumClass | string) => operand.valueOf() == this.valueOf()
    );
  }

  static lookup<T extends EnumClass>(): T[] {
    return Object.entries(this)
      .filter(([, val]) => val instanceof this)
      .map(([, val]) => val);
  }
}
