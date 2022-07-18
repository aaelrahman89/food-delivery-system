import { CatalogueItem, CatalogueItemsListItem } from '../models/CatalogueItem';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface CatalogueItemsRepo {
  setItemAvailable(itemId: EntityId): Promise<void>;
  setItemUnAvailable(itemId: EntityId): Promise<void>;
  getItem(itemId: EntityId): Promise<CatalogueItem>;
  listItems(query?: QuerySpec): Promise<ItemsList<CatalogueItemsListItem>>;
}
