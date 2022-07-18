import { EnumClass } from './EnumClass';

export class OrderType extends EnumClass {
  _prefix: string;

  static B2C = new OrderType('B2C');
  static C2C = new OrderType('C2C');
  static ERRANDS = new OrderType('ERRANDS');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_TYPE';
  }
}
