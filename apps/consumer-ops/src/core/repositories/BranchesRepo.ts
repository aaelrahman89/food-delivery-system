import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Branch, CampaignBranch } from '../models/Branch';
import { EntityId } from '@survv/commons/core/types';

export interface BranchesRepo {
  listAllBranches(): Promise<Branch[]>;
  listVendorBranches(vendorId: EntityId): Promise<Branch[]>;
  listBranchesBottomSheetListGroup(): Promise<BottomSheetListGroup<Branch>[]>;
  listBranchesWithHashTags(
    hashTagIds: number[]
  ): Promise<BottomSheetListGroup<Branch>[]>;

  listBranchesWithAreas(
    areaIds: number[]
  ): Promise<BottomSheetListGroup<Branch>[]>;
  listBranches(): Promise<Branch[]>;
  listCampaignBranches(
    campaignId: EntityId,
    promotionId: EntityId
  ): Promise<BottomSheetListGroup<CampaignBranch>[]>;
}
