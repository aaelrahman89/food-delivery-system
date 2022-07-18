import { EntityId } from '@survv/commons/core/types';
import { HashTagCreation, HashTagListItem } from '../../models/HashTag';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface HashTagsRepo {
  listHashTags(query?: QuerySpec): Promise<ItemsList<HashTagListItem>>;
  createHashTag(hashTag: HashTagCreation): Promise<void>;
  updateHashTag(tagId: EntityId, hashTag: HashTagCreation): Promise<void>;
}
