import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { TaxTier, TaxTierForm } from '../models/TaxTier';

export interface TaxTiersRepo {
  getTier(tierId: EntityId): Promise<TaxTier>;
  listTiers(query?: ListingQuery): Promise<ItemsList<TaxTier>>;
  createTier(taxTierForm: TaxTierForm): Promise<void>;
  updateTier(tierId: EntityId, taxTierForm: TaxTierForm): Promise<void>;
}
