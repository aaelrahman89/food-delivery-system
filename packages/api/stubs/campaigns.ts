import {
  CampaignBranchesListResponse,
  CampaignCreationResponse,
  CampaignsListResponse,
} from '../definitions/campaigns';

export function campaignCreationResponseStub(): CampaignCreationResponse {
  return {
    id: 2165529378315486700,
    promotionId: 2165529378315486700,
  };
}

export function campaignsListResponseStub(): CampaignsListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 3,
    },
    campaigns: [
      {
        id: 2165529378315486700,
        name: 'Campaign 1',
        budget: {
          amount: 10000,
          currency: 'EGP',
        },
        spentBudget: {
          amount: 7560.54,
          currency: 'EGP',
        },
        targetActivationsCount: 5000,
        customerCancellationCount: 1000,
        customerPromoCodeUsageCount: 3000,
        promoCodeTotalUsageCount: 10000,
        currentActivationsCount: 3000,
        status: 'INACTIVE',
        service: 'B2C_FOOD',
        startDate: '2018-09-05T19:04:53.178Z',
        endDate: '2018-09-05T19:04:53.178Z',
        promotions: [
          {
            id: 2165529378315486700,
            name: 'halloween20',
            type: 'PROMO_CODE',
            maxNumberOfUse: 2165529378315486700,
            percentage: 14,
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
            minSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            promoCodeType: 'PERCENTAGE',
            promoCodeUsage: 'DISCOUNT',
            customersCriteria: 'ALL_CUSTOMERS',
            branchesCriteria: {
              criteria: 'ALL_VENDORS',
              referencesIds: [2165529378315486700],
            },
          },
        ],
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
      },
      {
        id: 2165529378315486701,
        name: 'Campaign 2',
        budget: {
          amount: 16000,
          currency: 'EGP',
        },
        spentBudget: {
          amount: 10560.54,
          currency: 'EGP',
        },
        targetActivationsCount: 2000,
        currentActivationsCount: 1000,
        customerCancellationCount: 1000,
        customerPromoCodeUsageCount: 3000,
        promoCodeTotalUsageCount: 10000,
        status: 'ENDED',
        service: 'B2C_FOOD',
        startDate: '2018-09-05T19:04:53.178Z',
        endDate: '2018-09-05T19:04:53.178Z',
        promotions: [
          {
            id: 2165529378315486700,
            name: 'halloween20',
            type: 'PROMO_CODE',
            maxNumberOfUse: 2165529378315486700,
            percentage: 14,
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
            minSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            promoCodeType: 'FIXED_VALUE',
            promoCodeUsage: 'CASH_BACK',
            customersCriteria: 'REGISTERED_CUSTOMERS',
            branchesCriteria: {
              criteria: 'BRANCHES_WITH_TAGS',
              referencesIds: [2165529378315486700],
            },
          },
        ],
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
      },
      {
        id: 2165529378315486702,
        name: 'Campaign 3',
        budget: {
          amount: 5000,
          currency: 'EGP',
        },
        spentBudget: {
          amount: 3560.54,
          currency: 'EGP',
        },
        targetActivationsCount: 1000,
        currentActivationsCount: 300,
        customerCancellationCount: 1000,
        customerPromoCodeUsageCount: 3000,
        promoCodeTotalUsageCount: 10000,
        status: 'ACTIVE',
        service: 'B2C_FOOD',
        startDate: '2018-09-05T19:04:53.178Z',
        endDate: '2018-09-05T19:04:53.178Z',
        promotions: [
          {
            id: 2165529378315486700,
            name: 'halloween20',
            type: 'PROMO_CODE',
            maxNumberOfUse: 2165529378315486700,
            percentage: 14,
            value: {
              amount: 31.01,
              currency: 'EGP',
            },
            minSpending: {
              amount: 31.01,
              currency: 'EGP',
            },
            promoCodeType: 'FIXED_VALUE',
            promoCodeUsage: 'DISCOUNT',
            customersCriteria: 'SUBSET_OF_CUSTOMERS',
            branchesCriteria: {
              criteria: 'BRANCHES_IN_AREAS',
              referencesIds: [2165529378315486700],
            },
          },
        ],
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
      },
    ],
  };
}

export function campaignBranchesListResponseStub(): CampaignBranchesListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    branches: [
      {
        id: 2165529378315486700,
        label: 'kfc Katameya',
      },
    ],
  };
}
