import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: string;
  status: string;
  creationDate: Datetime;
  icon: string;
}
