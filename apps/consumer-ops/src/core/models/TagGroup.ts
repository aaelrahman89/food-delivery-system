import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TagGroupStatus } from './TagGroupStatus';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface SingleTagGroup {
  id: EntityId;
  name: MultilingualString;
  status: TagGroupStatus;
  vendorType: VendorType;
  tags: UnifiedTag[];
  creationDate: Datetime;
  icon: string | { type: string; base64String: string };
}

export interface NewTagGroup {
  name: MultilingualString;
  status: string;
  vendorType: string;
  tags: UnifiedTag[];
  icon: { type: string; base64String: string };
}

export interface ListTagGroup {
  id: EntityId;
  name: MultilingualString;
  status: TagGroupStatus;
  vendorType: VendorType;
  tagsCount: number;
  hashTagsCount: number;
  creationDate: Datetime;
  icon: string;
}
