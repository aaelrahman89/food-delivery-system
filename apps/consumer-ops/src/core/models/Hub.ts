import { EntityId } from '@survv/commons/core/types';

export class Hub implements HubOptions {
  id: EntityId = 0;
  label = '';

  constructor(options?: HubOptions) {
    Object.assign(this, options);
  }
}

interface HubOptions {
  id: EntityId;
  label: string;
}
