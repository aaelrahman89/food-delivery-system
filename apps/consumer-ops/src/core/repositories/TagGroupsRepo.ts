import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListTagGroup, NewTagGroup, SingleTagGroup } from '../models/TagGroup';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { UnifiedTag } from '../models/UnifiedTag';

export interface TagGroupsRepo {
  createTagGroup(tagGroup: NewTagGroup): Promise<void>;

  listTagGroups(query: QuerySpec): Promise<ItemsList<ListTagGroup>>;

  fetchTagGroup(tagGroupId: number): Promise<SingleTagGroup>;

  editTagGroup(tagGroup: SingleTagGroup): Promise<void>;

  getUnifiedTags(): Promise<ItemsList<UnifiedTag>>;
}
