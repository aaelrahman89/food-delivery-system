import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class SectionStatus extends EnumClass {
  _prefix: string;

  static VISIBLE = new SectionStatus('VISIBLE');
  static HIDDEN = new SectionStatus('HIDDEN');

  constructor(value: string) {
    super(value);
    this._prefix = 'SECTION_STATUS';
  }
}
