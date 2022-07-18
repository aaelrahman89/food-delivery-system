import { EnumClass } from './EnumClass';

export class PromotionType extends EnumClass {
  _prefix: string;

  static DISCOUNT = new PromotionType('DISCOUNT');
  static FREE_TRANSACTIONS = new PromotionType('FREE_TRANSACTIONS');

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMOTION_TYPE';
  }
}
