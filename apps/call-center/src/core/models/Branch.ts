import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class Branch implements BranchOptions {
  id = 0;
  vendorId = 0;
  label = '';
  displayName = new MultilingualString();
  active = false;
  b2cStatus = new BranchB2CStatus('');
  creationDate = new Datetime(0);

  constructor(options?: BranchOptions) {
    Object.assign(this, options);
  }
}

interface BranchOptions {
  id: EntityId;
  vendorId: EntityId;
  label: string;
  displayName?: MultilingualString;
  active?: boolean;
  b2cStatus?: BranchB2CStatus;
  creationDate?: Datetime;
}
