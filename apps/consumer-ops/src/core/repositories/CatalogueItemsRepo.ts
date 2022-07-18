import {
  CatalogueItem,
  CatalogueItemForm,
  CatalogueItemsListItem,
} from '../models/CatalogueItem';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface CatalogueItemsRepo {
  createItem(item: CatalogueItemForm, catalogueId: EntityId): Promise<void>;
  updateItem(item: CatalogueItemForm, itemId: EntityId): Promise<void>;
  listItems(query?: QuerySpec): Promise<ItemsList<CatalogueItemsListItem>>;
  getItem(itemId: EntityId): Promise<CatalogueItem>;
  setPopular(itemId: EntityId): Promise<void>;
  unSetPopular(itemId: EntityId): Promise<void>;
  archiveItem(catalogueId: EntityId, itemId: EntityId): Promise<void>;
  deleteOption(
    catalogueId: EntityId,
    itemId: EntityId,
    optionId: EntityId
  ): Promise<void>;
}
