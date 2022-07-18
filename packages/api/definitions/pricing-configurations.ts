import { ListingMetadata, MoneyWithCurrency } from './common';

export type ListPricingConfigurationsRequest = void;
export interface ListPricingConfigurationsResponse {
  metadata: ListingMetadata;
  pricingConfigs: Array<{
    id: number;
    hasSubscriptionFee: boolean;
    subscriptionFee: MoneyWithCurrency;
    hasTransactionFee: boolean;
    fixedTransactionFee: MoneyWithCurrency;
    commission: number;
    cancellationPolicy: {
      vendorFault: {
        vendorAcceptsBaring: boolean;
        vendorShare: number;
        removesTransactionFees: boolean;
      };
      survvFault: {
        vendorAcceptsBaring: boolean;
        vendorShare: number;
        removesTransactionFees: boolean;
      };
    };
    lastUpdateDate: string;
    lastUpdateBy: {
      userId: number;
      userEmail: string;
    };
  }>;
}

export interface PricingConfigurationsCreateRequest {
  vendorId: number;
  hasSubscriptionFee: boolean;
  subscriptionFee: number;
  hasTransactionFee: boolean;
  fixedTransactionFee: number;
  commission: number;
  cancellationPolicy: {
    vendorFault: {
      vendorAcceptsBaring: boolean;
      vendorShare: number;
      removesTransactionFees: boolean;
    };
    survvFault: {
      vendorAcceptsBaring: boolean;
      vendorShare: number;
      removesTransactionFees: boolean;
    };
  };
}
export type PricingConfigurationsCreateResponse = void;

export interface PricingConfigurationsUpdateRequest {
  vendorId: number;
  hasSubscriptionFee: boolean;
  subscriptionFee: number;
  hasTransactionFee: boolean;
  fixedTransactionFee: number;
  commission: number;
  cancellationPolicy: {
    vendorFault: {
      vendorAcceptsBaring: boolean;
      vendorShare: number;
      removesTransactionFees: boolean;
    };
    survvFault: {
      vendorAcceptsBaring: boolean;
      vendorShare: number;
      removesTransactionFees: boolean;
    };
  };
}
export type PricingConfigurationsUpdateResponse = void;
