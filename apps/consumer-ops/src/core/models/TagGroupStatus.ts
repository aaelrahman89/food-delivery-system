import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class TagGroupStatus extends EnumClass {
  _prefix: string;

  static VISIBLE = new TagGroupStatus('VISIBLE');
  static HIDDEN = new TagGroupStatus('HIDDEN');

  constructor(value: string) {
    super(value);
    this._prefix = 'TAG_GROUP_STATUS';
  }
}
