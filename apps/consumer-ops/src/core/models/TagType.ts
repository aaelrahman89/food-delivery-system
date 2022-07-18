import { EnumClass } from '@survv/commons/core/models/EnumClass';

interface TagTypes {
  CUISINE: string;
  DIETARY: string;
  ALLERGY: string;
  VENUE: string;
  PICKUP: string;
  HASH_TAG: string;
}

export class TagType extends EnumClass {
  _prefix: string;

  static CUISINE = new TagType('CUISINE');
  static DIETARY = new TagType('DIETARY');
  static ALLERGY = new TagType('ALLERGY');
  static VENUE = new TagType('VENUE');
  static PICKUP = new TagType('PICKUP');
  static HASH_TAG = new TagType('HASH_TAG');

  constructor(value: string) {
    super(value);
    this._prefix = 'TAG_TYPE';
  }

  toString(): string {
    return `${this._prefix}_${this.value}`;
  }

  static get values(): TagTypes {
    return {
      CUISINE: 'CUISINE',
      DIETARY: 'DIETARY',
      ALLERGY: 'ALLERGY',
      VENUE: 'VENUE',
      PICKUP: 'PICKUP',
      HASH_TAG: 'HASH_TAG',
    };
  }
}
