import { CreatedByUser, ListingMetadata, MoneyWithCurrency } from './common';

export type CampaignStatus = string & ('ACTIVE' | 'INACTIVE' | 'ENDED');
export type CampaignService = string & 'B2C_FOOD';
export type CampaignPromotionType = string & 'PROMO_CODE';
export type PromoCodeType = string & ('FIXED_VALUE' | 'PERCENTAGE' | 'NONE');
export type PromoCodeUsage = string &
  ('DISCOUNT' | 'CASH_BACK' | 'FREE_DELIVERY');
export type CampaignEligibleCustomersCriteria = string &
  (
    | 'ALL_CUSTOMERS'
    | 'NEW_CUSTOMERS'
    | 'REGISTERED_CUSTOMERS'
    | 'SUBSET_OF_CUSTOMERS'
  );
export type CampaignEligibleBranchesCriteria = string &
  (
    | 'ALL_VENDORS'
    | 'BRANCHES_IN_AREAS'
    | 'BRANCHES_WITH_TAGS'
    | 'SUBSET_OF_BRANCHES'
  );

export type CampaignBranchesListRequest = void;
export interface CampaignBranchesListResponse {
  metadata: ListingMetadata;
  branches: { id: number; label: string }[];
}

export interface CampaignCreationRequest {
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  targetActivationsCount: number;
  service: CampaignService;
  promotion: {
    promotionType: CampaignPromotionType;
    name: string;
    maxNumberOfUse: number;
    promoCodeType: PromoCodeType;
    promoCodeUsage: PromoCodeUsage;
    percentage: number;
    value: number;
    minSpending: number;
    ordersCount: number;
    ordersCountOperator: string;
    customersCriteria: {
      criteria: CampaignEligibleCustomersCriteria;
      subsetPhoneNumbers: string[];
    };
    branchesCriteria: {
      criteria: CampaignEligibleBranchesCriteria;
      referencesIds: number[];
      vendorsIds: number[];
    };
  };
}
export interface CampaignCreationResponse {
  id: number;
  promotionId: number;
}

export type EnableCampaignRequest = void;
export type EnableCampaignResponse = void;

export type DisableCampaignRequest = void;
export type DisableCampaignResponse = void;

export type CampaignsListRequest = void;
export interface CampaignsListResponse {
  metadata: ListingMetadata;
  campaigns: {
    id: number;
    name: string;
    budget: MoneyWithCurrency;
    spentBudget: MoneyWithCurrency;
    targetActivationsCount: number;
    currentActivationsCount: number;
    customerCancellationCount: number;
    customerPromoCodeUsageCount: number;
    promoCodeTotalUsageCount: number;
    status: CampaignStatus;
    service: CampaignService;
    startDate: string;
    endDate: string;
    promotions: {
      id: number;
      name: string;
      type: CampaignPromotionType;
      maxNumberOfUse: number;
      percentage: number;
      value: MoneyWithCurrency;
      minSpending: MoneyWithCurrency;
      promoCodeType: PromoCodeType;
      promoCodeUsage: PromoCodeUsage;
      customersCriteria: CampaignEligibleCustomersCriteria;
      branchesCriteria: {
        criteria: CampaignEligibleBranchesCriteria;
        referencesIds: number[];
      };
    }[];
    createdBy: CreatedByUser;
  }[];
}
