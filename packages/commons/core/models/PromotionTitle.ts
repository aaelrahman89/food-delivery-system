import { EnumClass } from './EnumClass';

export class PromotionTitle extends EnumClass {
  _prefix: string;

  constructor(value: string) {
    super(value);
    this._prefix = 'PROMOTION_TITLE';
  }

  static NEW_PARTNERSHIP_PROMOTION = new PromotionTitle(
    'NEW_PARTNERSHIP_PROMOTION'
  );
}
