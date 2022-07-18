import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface TagOptions {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  type: string;
  status: string;
  creationDate: Datetime;
  icon: string;
}

export class Tag implements UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  icon: string;
  type: string;
  status: string;

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
