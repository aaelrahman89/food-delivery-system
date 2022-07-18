import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { TagType } from '../../models/TagType';
import { UnifiedTag } from '../../models/UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';

export interface UnifiedTagsRepo {
  listVisibleTagsByType(
    types: TagType[],
    vendorType: VendorType
  ): Promise<ItemsList<UnifiedTag>>;
}
