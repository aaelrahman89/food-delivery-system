import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class SectionType extends EnumClass {
  _prefix: string;

  static ITEM = new SectionType('ITEM');
  static VENDOR = new SectionType('VENDOR');
  static ORDER = new SectionType('ORDER');
  static OFFER = new SectionType('OFFER');
  static REFERRAL = new SectionType('REFERRAL');
  static TAG_GROUP = new SectionType('TAG_GROUP');

  constructor(value: string) {
    super(value);
    this._prefix = 'SECTION_TYPE';
  }
}
