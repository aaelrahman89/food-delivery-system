import {
  BottomSheetListGroup,
  ItemsList,
} from '@survv/commons/core/models/ItemsList';
import {
  Campaign,
  CampaignService,
  CampaignStatus,
  CampaignsListPromotion,
} from '../../../../core/models/Campaign';
import { CampaignsListResponse } from '@survv/api/definitions/campaigns';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../core/models/HashTag';
import { HashTagStatus } from '../../../../core/models/HashTagStatus';
import { HashTagsListResponse } from '@survv/api/definitions/hash-tags';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  PromoCodeUsageType,
  PromotionBranchesCriteria,
  PromotionCustomersCriteria,
} from '../../../../core/models/Promotion';
import { VendorType } from '../../../../core/models/VendorType';

export function mapCampaignsListResponseToCampaigns(
  response: CampaignsListResponse
): ItemsList<Campaign> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.campaigns.map(
      (campaign) =>
        new Campaign({
          id: campaign.id,
          name: campaign.name,
          status: new CampaignStatus(campaign.status),
          service: new CampaignService(campaign.service),
          budget: new Money(campaign.budget),
          spentBudget: new Money(campaign.spentBudget),
          targetActivationsCount: campaign.targetActivationsCount,
          currentActivationsCount: campaign.currentActivationsCount,
          customerCancellationCount: campaign.customerCancellationCount,
          customerPromoCodeUsageCount: campaign.customerPromoCodeUsageCount,
          promoCodeTotalUsageCount: campaign.promoCodeTotalUsageCount,
          promotions: campaign.promotions.map(
            (promotion) =>
              new CampaignsListPromotion({
                id: promotion.id,
                name: promotion.name,
                promoCodeUsage: new PromoCodeUsageType(
                  promotion.promoCodeUsage
                ),
                customersCriteria: new PromotionCustomersCriteria(
                  promotion.customersCriteria
                ),
                branchesCriteria: {
                  criteria: new PromotionBranchesCriteria(
                    promotion.branchesCriteria.criteria
                  ),
                  referenceIds: promotion.branchesCriteria.referencesIds,
                },
              })
          ),
          startDate: new Datetime(campaign.startDate),
          endDate: new Datetime(campaign.endDate),
          createdBy: campaign.createdBy,
        })
    ),
  };
}

export function mapHashTagsListToHashTags(
  response: HashTagsListResponse
): HashTag[] {
  return response.hashTags.map(
    (hashTagResponse) =>
      new HashTag({
        id: hashTagResponse.id,
        name: new MultilingualString(hashTagResponse.title),
        status: new HashTagStatus(hashTagResponse.status),
        creationDate: new Datetime(hashTagResponse.creationDate),
        vendorType: new VendorType(hashTagResponse.vendorType),
      })
  );
}

export function mapHashTagsListToHashTagsBottomSheetListGroup(
  response: HashTagsListResponse
): BottomSheetListGroup<HashTag>[] {
  return [
    {
      items: response.hashTags.map((hashTagResponse) => ({
        id: hashTagResponse.id,
        label: hashTagResponse.title,
        value: new HashTag({
          id: hashTagResponse.id,
          name: new MultilingualString(hashTagResponse.title),
          status: new HashTagStatus(hashTagResponse.status),
          creationDate: new Datetime(hashTagResponse.creationDate),
          vendorType: new VendorType(hashTagResponse.vendorType),
        }),
      })),
    },
  ];
}
