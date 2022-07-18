import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class Gender extends EnumClass {
  _prefix: string;

  static NONE = new Gender('NONE');
  static MALE = new Gender('MALE');
  static FEMALE = new Gender('FEMALE');

  constructor(value: string) {
    super(value);
    this._prefix = 'GENDER';
  }
}
