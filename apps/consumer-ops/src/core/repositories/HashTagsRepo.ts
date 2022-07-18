import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { EntityId } from '@survv/commons/core/types';
import { HashTag } from '../models/HashTag';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface HashTagsRepo {
  listHashTags(query?: QuerySpec): Promise<HashTag[]>;
  listCampaignHashTags(
    referenceIds: EntityId[]
  ): Promise<BottomSheetListGroup<HashTag>[]>;
  listHashTagsBottomSheetListGroup(): Promise<BottomSheetListGroup<HashTag>[]>;
}
