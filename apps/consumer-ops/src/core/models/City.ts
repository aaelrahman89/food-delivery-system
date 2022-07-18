import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class City implements CityOptions {
  id: EntityId = 0;
  name = new MultilingualString();
  countryId: EntityId = 0;

  constructor(options?: CityOptions) {
    Object.assign(this, options);
  }
}

interface CityOptions {
  id: EntityId;
  name: MultilingualString;
  countryId: EntityId;
}
