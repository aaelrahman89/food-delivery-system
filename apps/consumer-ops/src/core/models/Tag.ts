import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TagStatus } from './TagStatus';
import { TagType } from './TagType';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface SingleTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: TagType;
  status: TagStatus;
  creationDate: Datetime;
  icon: string | { type: string; base64String: string };
}

export interface TagCreation {
  name: MultilingualString;
  vendorType: VendorType;
  type: TagType;
  status: TagStatus;
  icon: { type: string; base64String: string };
}

export interface ListTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: TagType;
  status: TagStatus;
  creationDate: Datetime;
  icon: string;
}

export interface TagOptions {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: TagType;
  status: TagStatus;
  creationDate: Datetime;
  icon: string;
}

export class Tag implements UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  icon: string;
  type: TagType;
  status: TagStatus;

  constructor(options: TagOptions) {
    const { id, name, vendorType, creationDate, icon, type, status } = options;
    this.id = id;
    this.vendorType = vendorType;
    this.name = name;
    this.creationDate = creationDate;
    this.icon = icon;
    this.type = type;
    this.status = status;
  }
}
