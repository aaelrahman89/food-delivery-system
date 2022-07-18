import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class Country implements CountryOptions {
  id: EntityId = 0;
  name = new MultilingualString();

  constructor(options?: CountryOptions) {
    Object.assign(this, options);
  }
}

interface CountryOptions {
  id: EntityId;
  name: MultilingualString;
}
