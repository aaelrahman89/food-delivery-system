import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class ErrandDetectedZone {
  id = 0;
  name = new MultilingualString();

  constructor(options?: ErrandDetectedZoneOptions) {
    Object.assign(this, options);
  }
}

interface ErrandDetectedZoneOptions {
  id: EntityId;
  name: MultilingualString;
}
