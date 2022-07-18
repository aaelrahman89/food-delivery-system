import {
  ListPricingConfigurationsResponse,
  PricingConfigurationsCreateRequest,
  PricingConfigurationsUpdateRequest,
} from '../definitions/pricing-configurations';

export function pricingConfigurationsListResponseStub(): ListPricingConfigurationsResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    pricingConfigs: [
      {
        id: 2165529378315486700,
        hasSubscriptionFee: true,
        subscriptionFee: {
          amount: 31.01,
          currency: 'EGP',
        },
        hasTransactionFee: false,
        fixedTransactionFee: {
          amount: 31.01,
          currency: 'EGP',
        },
        commission: 14,
        cancellationPolicy: {
          vendorFault: {
            vendorAcceptsBaring: true,
            vendorShare: 14,
            removesTransactionFees: false,
          },
          survvFault: {
            vendorAcceptsBaring: true,
            vendorShare: 14,
            removesTransactionFees: false,
          },
        },
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        lastUpdateBy: {
          userId: 123654789,
          userEmail: 'test@email.com',
        },
      },
    ],
  };
}

export function pricingConfigurationsCreateRequestStub(): PricingConfigurationsCreateRequest {
  return {
    vendorId: 2165529378315486700,
    hasSubscriptionFee: false,
    subscriptionFee: 31.01,
    hasTransactionFee: false,
    fixedTransactionFee: 31.01,
    commission: 14,
    cancellationPolicy: {
      vendorFault: {
        vendorAcceptsBaring: false,
        vendorShare: 14,
        removesTransactionFees: false,
      },
      survvFault: {
        vendorAcceptsBaring: false,
        vendorShare: 14,
        removesTransactionFees: false,
      },
    },
  };
}

export function pricingConfigurationsUpdateRequestStub(): PricingConfigurationsUpdateRequest {
  return {
    vendorId: 2165529378315486700,
    hasSubscriptionFee: false,
    subscriptionFee: 31.01,
    hasTransactionFee: false,
    fixedTransactionFee: 31.01,
    commission: 14,
    cancellationPolicy: {
      vendorFault: {
        vendorAcceptsBaring: false,
        vendorShare: 14,
        removesTransactionFees: false,
      },
      survvFault: {
        vendorAcceptsBaring: false,
        vendorShare: 14,
        removesTransactionFees: false,
      },
    },
  };
}
