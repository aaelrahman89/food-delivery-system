import { EntityId } from '@survv/commons/core/types';

export interface CatalogueItemsRepo {
  setItemAvailable(branchId: EntityId, itemId: EntityId): Promise<void>;
  setItemUnAvailable(branchId: EntityId, itemId: EntityId): Promise<void>;
}
