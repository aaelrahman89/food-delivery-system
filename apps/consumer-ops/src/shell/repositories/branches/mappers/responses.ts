import {
  B2CBranchesListResponse,
  BranchesListV2Response,
  ConsumerB2CBranchesListResponse,
} from '@survv/api/definitions/branches';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Branch, CampaignBranch } from '../../../../core/models/Branch';
import { CampaignBranchesListResponse } from '@survv/api/definitions/campaigns';

export function mapBranchesListV2ResponseBranchesToBranchList(
  response: BranchesListV2Response
): Branch[] {
  return response.branches.map(
    (branch) =>
      new Branch({
        id: branch.id,
        label: branch.label,
        vendorId: branch.vendorId,
        vendorLabel: branch.vendorLabel,
      })
  );
}

export function mapBranchesListV2ResponseToBranches(
  response: BranchesListV2Response | ConsumerB2CBranchesListResponse
): Branch[] {
  return response.branches.map(
    (branch) =>
      new Branch({
        id: branch.id,
        vendorId: branch.vendorId,
        vendorLabel: branch.vendorLabel,
        label: branch.label,
      })
  );
}

export function mapBranchesListV2ResponseToBranchesBottomSheetListGroup(
  response: B2CBranchesListResponse | ConsumerB2CBranchesListResponse
): BottomSheetListGroup<Branch>[] {
  return [
    {
      items: response.branches.map((branch) => ({
        id: branch.id,
        label: branch.label,
        value: new Branch({
          id: branch.id,
          vendorId: branch.vendorId,
          vendorLabel: branch.vendorLabel,
          label: branch.label,
        }),
      })),
    },
  ];
}

export function mapBranchesListResponseToCampaignBranchesBottomSheetListGroup(
  response: CampaignBranchesListResponse
): BottomSheetListGroup<CampaignBranch>[] {
  return [
    {
      items: response.branches.map((branch) => ({
        id: branch.id,
        label: branch.label,
        value: new CampaignBranch({
          id: branch.id,
          label: branch.label,
        }),
      })),
    },
  ];
}
