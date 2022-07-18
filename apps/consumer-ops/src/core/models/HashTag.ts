import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { HashTagStatus } from './HashTagStatus';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TagType } from './TagType';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface HashTagCreation {
  name: MultilingualString;
  vendorType: VendorType;
  status: HashTagStatus;
}

export interface HashTagOptions {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  status: HashTagStatus;
}

export interface HashTagListItemOptions {
  id: EntityId;
  name: MultilingualString;
  status: HashTagStatus;
  vendorType: VendorType;
  vendorsCount: number;
  itemsCount: number;
  creationDate: Datetime;
}

export class HashTagListItem {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  status: HashTagStatus;
  vendorsCount: number;
  itemsCount: number;
  icon: string;
  type: typeof TagType.HASH_TAG;

  constructor(options: HashTagListItemOptions) {
    const {
      id,
      name,
      vendorType,
      creationDate,
      status,
      itemsCount,
      vendorsCount,
    } = options;
    this.id = id;
    this.vendorType = vendorType;
    this.name = name;
    this.creationDate = creationDate;
    this.status = status;
    this.vendorsCount = vendorsCount;
    this.itemsCount = itemsCount;
    this.icon = '/consumer-assets/images/hash-tags.png';
    this.type = TagType.HASH_TAG;
  }
}

export class HashTag implements UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  status: HashTagStatus;
  icon: string;
  type: typeof TagType.HASH_TAG;

  constructor(options: HashTagOptions) {
    const { id, name, vendorType, creationDate, status } = options;
    this.id = id;
    this.vendorType = vendorType;
    this.name = name;
    this.creationDate = creationDate;
    this.status = status;
    this.icon = '/consumer-assets/images/hash-tags.png';
    this.type = TagType.HASH_TAG;
  }
}
