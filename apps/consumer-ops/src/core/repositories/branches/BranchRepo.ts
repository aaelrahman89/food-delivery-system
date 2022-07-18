import { Branch, BranchProfileListItem } from '../../models/Branch';
import { BranchForm } from '../../models/BranchForm';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';

export interface BranchRepo {
  listBranches(
    listingQuery: ListingQuery
  ): Promise<ItemsList<BranchProfileListItem>>;
  getBranchDetails(branchId: EntityId): Promise<Branch>;
  createBranch(vendorId: EntityId, branchForm: BranchForm): Promise<void>;
  updateBranch(
    vendorId: EntityId,
    branchId: EntityId,
    branchForm: BranchForm,
    branchDetails: Branch
  ): Promise<void>;
  setStackingConfigurations(
    branchId: EntityId,
    maxStackedOrders: number,
    stackingWindowInMinutes: number
  ): Promise<void>;
  disableStacking(branchId: EntityId): Promise<void>;
  resetBranchCode(branchId: EntityId): Promise<void>;
  retrieveBranchCode(branchId: EntityId): Promise<string>;
}
