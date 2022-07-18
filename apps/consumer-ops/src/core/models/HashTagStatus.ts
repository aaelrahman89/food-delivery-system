import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class HashTagStatus extends EnumClass {
  _prefix: string;

  static VISIBLE = new HashTagStatus('VISIBLE');
  static HIDDEN = new HashTagStatus('HIDDEN');

  constructor(value: string) {
    super(value);
    this._prefix = 'HASH_TAG_STATUS';
  }
}
