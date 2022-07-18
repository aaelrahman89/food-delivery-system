import { EnumClass } from '@survv/commons/core/models/EnumClass';

interface TagStatuses {
  VISIBLE: string;
  HIDDEN: string;
}

export class TagStatus extends EnumClass {
  _prefix: string;

  static VISIBLE = new TagStatus('VISIBLE');
  static HIDDEN = new TagStatus('HIDDEN');

  constructor(value: string) {
    super(value);
    this._prefix = 'TAG_STATUS';
  }

  toString(): string {
    return `${this._prefix}_${this.value}`;
  }

  static get values(): TagStatuses {
    return {
      VISIBLE: 'VISIBLE',
      HIDDEN: 'HIDDEN',
    };
  }
}
