import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class ContentCriteria extends EnumClass {
  protected readonly _prefix: string;

  static OFFERS = new ContentCriteria('OFFERS');
  static SUGGESTED_ITEMS = new ContentCriteria('SUGGESTED_ITEMS');
  static SUGGESTED_VENDORS = new ContentCriteria('SUGGESTED_VENDORS');
  static ORDER_HISTORY = new ContentCriteria('ORDER_HISTORY');
  static TAG_GROUPS = new ContentCriteria('TAG_GROUPS');
  static REFERRAL = new ContentCriteria('REFERRAL');
  static PRICE_CAP = new ContentCriteria('PRICE_CAP');
  static CALORIES_CAP = new ContentCriteria('CALORIES_CAP');

  constructor(value: string) {
    super(value);
    this._prefix = 'CONTENT_CRITERIA';
  }
}
