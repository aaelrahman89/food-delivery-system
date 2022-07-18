import { Catalogue, CataloguesListItem } from '../models/Catalogue';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';

export interface CataloguesRepo {
  getCatalogue(branchId: EntityId, catalogueId: EntityId): Promise<Catalogue>;
  getCataloguesList(branchId: EntityId): Promise<ItemsList<CataloguesListItem>>;
}
