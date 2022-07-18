import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { UnifiedTag } from './UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

interface HashTagOptions {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  status: string;
}

export class HashTag implements UnifiedTag {
  id: EntityId;
  name: MultilingualString;
  vendorType: VendorType;
  creationDate: Datetime;
  status: string;
  icon: string;
  type: string;

  constructor(options: HashTagOptions) {
    const { id, name, vendorType, creationDate, status } = options;
    this.id = id;
    this.vendorType = vendorType;
    this.name = name;
    this.creationDate = creationDate;
    this.status = status;
    this.icon = '/consumer-assets/images/hash-tags.png';
    this.type = 'HASH_TAG';
  }
}
