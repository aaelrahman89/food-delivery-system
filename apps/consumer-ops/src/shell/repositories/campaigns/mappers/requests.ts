import {
  CampaignCreationRequest,
  CampaignEligibleBranchesCriteria,
  CampaignEligibleCustomersCriteria,
  CampaignPromotionType,
  CampaignService,
  PromoCodeType,
  PromoCodeUsage,
} from '@survv/api/definitions/campaigns';
import { CampaignForm } from '../../../../core/models/Campaign';

export function mapCampaignFormToCampaignCreationRequest(
  campaignForm: CampaignForm
): CampaignCreationRequest {
  const startDate = new Date(campaignForm.startDate);
  startDate.setHours(0);
  const endDate = new Date(campaignForm.endDate);
  endDate.setHours(24);
  const vendorBranchesHashMap: Record<string, number[]> = {};
  campaignForm.selectedBranches.forEach((branch) => {
    if (vendorBranchesHashMap[branch.vendorId]) {
      vendorBranchesHashMap[branch.vendorId].push(branch.id);
    } else {
      vendorBranchesHashMap[branch.vendorId] = [branch.id];
    }
  });

  const computedVendorIds: number[] = [];
  const computedBranchIds: number[] = [];

  Object.keys(vendorBranchesHashMap).forEach((vendorId) => {
    if (
      vendorBranchesHashMap[vendorId].length ==
      campaignForm.allBranches.filter(
        (branch) => branch.vendorId.toString() == vendorId
      ).length
    ) {
      campaignForm.selectedBranches = campaignForm.selectedBranches.filter(
        (branch) => branch.vendorId.toString() != vendorId
      );
      computedVendorIds.push(Number(vendorId));
    } else {
      computedBranchIds.push(...vendorBranchesHashMap[vendorId]);
    }
  });

  return {
    name: campaignForm.name,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    budget: campaignForm.budget,
    targetActivationsCount: campaignForm.maxActivations,
    service: campaignForm.service as CampaignService,
    promotion: {
      promotionType: campaignForm.promotionType as CampaignPromotionType,
      name: campaignForm.promoCode.name,
      maxNumberOfUse: campaignForm.promoCode.maxNumberOfUses,
      promoCodeType:
        campaignForm.promoCode.usage === 'FREE_DELIVERY'
          ? 'NONE'
          : (campaignForm.promoCode.type as PromoCodeType),
      promoCodeUsage: campaignForm.promoCode.usage as PromoCodeUsage,
      percentage: campaignForm.promoCode.percentage,
      value: campaignForm.promoCode.value
        ? campaignForm.promoCode.value
        : campaignForm.promoCode.cap,
      minSpending: campaignForm.promoCode.minSpending,
      ordersCount: Number(campaignForm.promoCode.numberOfOrders),
      ordersCountOperator:
        campaignForm.promoCode.numberOfOrdersOperator == ''
          ? 'NONE'
          : campaignForm.promoCode.numberOfOrdersOperator,
      customersCriteria: {
        criteria:
          campaignForm.eligibleUsersCriteria as CampaignEligibleCustomersCriteria,
        subsetPhoneNumbers: campaignForm.subsetPhoneNumbers,
      },
      branchesCriteria: {
        criteria:
          campaignForm.eligibleBranchesCriteria as CampaignEligibleBranchesCriteria,
        referencesIds:
          campaignForm.eligibleBranchesCriteria == 'SUBSET_OF_BRANCHES'
            ? computedBranchIds
            : campaignForm.referencesIds,
        vendorsIds: computedVendorIds,
      },
    },
  };
}
