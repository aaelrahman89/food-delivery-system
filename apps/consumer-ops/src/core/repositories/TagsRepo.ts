import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListTag, SingleTag, TagCreation } from '../models/Tag';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface TagsRepo {
  createTag(tag: TagCreation): Promise<void>;

  listTags(query: QuerySpec): Promise<ItemsList<ListTag>>;

  fetchTag(tagId: number): Promise<SingleTag>;

  editTag(tag: SingleTag): Promise<void>;
}
