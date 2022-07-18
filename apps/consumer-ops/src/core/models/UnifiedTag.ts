import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { HashTagStatus } from './HashTagStatus';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TagStatus } from './TagStatus';
import { TagType } from './TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: TagType;
  status: TagStatus | HashTagStatus;
  creationDate: Datetime;
  icon: string;
}
