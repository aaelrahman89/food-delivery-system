import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class HeaderType extends EnumClass {
  _prefix: string;

  constructor(value: string) {
    super(value);
    this._prefix = 'HEADER_TYPE';
  }

  static NONE = new HeaderType('NONE');
  static TEXT = new HeaderType('TEXT');
  static THRESHOLD = new HeaderType('THRESHOLD');
}
