import {
  RefereeReportResponse,
  ReferralListResponse,
  ReferralReportListResponse,
} from '../definitions/referral';

export function referralListResponseStub(): ReferralListResponse {
  return {
    title: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    sharingMsg: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    referrerBannerMsg: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    refereeWithDeepLinkBannerMsg: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    refereeWithoutDeepLinkBannerMsg: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    referrerAmount: {
      amount: 31.01,
      currency: 'EGP',
    },
    refereeDiscountType: 'PERCENTAGE',
    refereeFixedValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    refereeMinSpending: {
      amount: 31.01,
      currency: 'EGP',
    },
    refereePercentage: 14,
    refereeCap: {
      amount: 31.01,
      currency: 'EGP',
    },
    services: ['FOOD'],
    referrerMaxAmount: {
      amount: 31.01,
      currency: 'EGP',
    },
    lastUpdateDate: '2018-09-01T18:04:53.178Z',
  };
}

export function referralReportListResponseStub(): ReferralReportListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    referrerCodes: [
      {
        id: 123456,
        name: 'EGX50',
        referrerId: 123456,
        referrerName: 'Max',
        referrerMobileNo: '01069262360',
        refereeOrderCount: 3,
        refereeSuccessfulOrderCount: 3,
        referred: false,
        referredById: 123456,
        referredByName: 'Alex',
        referredByCodeId: 123456,
        totalCashBack: {
          amount: 31.01,
          currency: 'EGP',
        },
        referrerMaxAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        remainingCashBack: 14,
        registrationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function refereeReportResponseStub(): RefereeReportResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    referees: [
      {
        refereeId: 123,
        refereeName: 'John Doe',
        refereeMobileNumber: '+201011575788',
        orderId: 456,
        customerOrderId: 'QRWNU',
        orderStatus: 'REQUESTED',
        discountType: 'PERCENTAGE',
        discountPercentage: 14,
        discountAmount: {
          amount: 31.01,
          currency: 'EGP',
        },
        registrationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}
