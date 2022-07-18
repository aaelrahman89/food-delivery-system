import { Catalogue, CataloguesListItem } from '../models/Catalogue';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';

export interface CataloguesRepo {
  getCatalogue(catalogueId: EntityId): Promise<Catalogue>;
  getCataloguesList(): Promise<ItemsList<CataloguesListItem>>;
}
