import {
  AccountStatementResponse,
  ConsumerVendorBranchProfileListResponse,
  ConsumerVendorCreationResponse,
  ConsumerVendorProfileResponse,
  CreateVendorUserResponse,
  GetDebitCreditPDFDownloadUrlResponse,
  ListVendorUsersResponse,
  PromotionsResponse,
  TiersResponse,
  VendorBranchProfileListResponse,
  VendorDebitCreditNotesListResponse,
  VendorDetailsResponse,
  VendorProfileResponse,
  VendorsListResponse,
} from '../definitions/vendors';

export function vendorsListResponseStub(): VendorsListResponse {
  return {
    metadata: {
      skipped: 1,
      limit: 2,
      totalCount: 3,
      totalReturned: 4,
    },
    vendors: [
      {
        id: 12312,
        branchCount: 50,
        transactionCount: 20,
        label: 'McDonald',
        active: false,
        type: 'FOOD',
        prepaid: false,
        legalInfo: {
          companyName: 'CompanyName',
          companyAddress: 'AnAddress',
        },
        trackingSMS: false,
        hasPendingReceipts: false,
        subscriptionStatus: '_01_AT_RISK',
        creationDate: '2018-09-05T19:04:53.178Z',
        tags: [
          {
            id: 123,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        dispatchPriority: 'NORMAL',
        activeOverdraft: false,
        hasProfile: false,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
    ],
  };
}

export function vendorProfileResponseStub(): VendorProfileResponse {
  return {
    id: 564465,
    label: 'Mac',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    languageSupport: {
      en: true,
      ar: true,
    },
    tax: 14,
    taxStatus: 'NOT_APPLICABLE',
    minimumOrderValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    averagePrepTime: 10,
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    hasProfile: true,
    hashTags: [
      {
        id: 435455,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tags: [
      {
        id: 254235,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'NONE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function consumerVendorProfileResponseStub(): ConsumerVendorProfileResponse {
  return {
    id: 564465,
    label: 'Mac',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    languageSupport: {
      en: true,
      ar: true,
    },
    taxStatus: 'NOT_APPLICABLE',
    minimumOrderValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    averagePrepTime: 10,
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    hashTags: [
      {
        id: 435455,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tags: [
      {
        id: 254235,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'NONE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    vendorUsers: [
      {
        vendorUserId: 123654789,
        fullName: 'Bakaka Dassa',
        mobileNo: '1062131123123',
        email: 'example@domain.com',
        title: 'Dassa',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    creationDate: '2018-09-05T19:04:53.178Z',
    type: 'FOOD',
    branchCount: 5,
    activeBranchesCount: 5,
    legalInfo: { companyName: 'SURVV', companyAddress: 'Down Town' },
    dispatchingModel: 'ORDER_AND_PICKUP',
    active: false,
    fake: false,
    stacking: true,
    deliverBy: 'SURVV_FLEET',
    rating: 5,
    transactionCount: 6,
    stackingWindowInMinutes: 30,
    maxStackedOrders: 5,
    orderingSystem: 'BRANCHES_DASHBOARD',
    ledgerId: 123654789,
    estimatedDeliveryTimeInMinutes: 40,
    deliveryFees: {
      amount: 31.01,
      currency: 'EGP',
    },
    posIntegrated: true,
    posIntegrationType: 'LINETEN',
  };
}

export function consumerVendorCreationResponseStub(): ConsumerVendorCreationResponse {
  return {
    id: 1234,
    label: 'MCDONALDS',
    creationDate: '2018-09-05T19:04:53.178Z',
    vendorUsers: [
      {
        vendorUserId: 0,
        fullName: 'Max',
        mobileNo: '01029937',
        email: 'test@test.com',
        title: 'Manager',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function vendorBranchProfileListResponseStub(): VendorBranchProfileListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 1,
      totalReturned: 1,
    },
    branches: [
      {
        id: 1,
        label: 'McDonald',
        displayName: {
          en: '',
          ar: '',
        },
        vendorId: 2165529378315486700,
        active: false,
        hasProfile: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
      {
        id: 2,
        label: 'McDonald',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorId: 2165529378315486700,
        active: false,
        hasProfile: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
      {
        id: 3,
        label: 'McDonald',
        displayName: {
          en: 'XXZ Menu',
          ar: '',
        },
        vendorId: 2165529378315486700,
        active: false,
        hasProfile: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
    ],
    missingODProfileBranchesCount: 0,
  };
}

export function consumerVendorBranchProfileListResponseStub(): ConsumerVendorBranchProfileListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 1,
      totalReturned: 1,
    },
    branches: [
      {
        id: 1,
        label: 'McDonald',
        displayName: {
          en: '',
          ar: '',
        },
        vendorId: 2165529378315486700,
        active: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
      {
        id: 2,
        label: 'McDonald',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorId: 2165529378315486700,
        active: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
      {
        id: 3,
        label: 'McDonald',
        displayName: {
          en: 'XXZ Menu',
          ar: '',
        },
        vendorId: 2165529378315486700,
        active: false,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        avgBasketSize: {
          amount: 60.15,
          currency: 'EGP',
        },
      },
    ],
  };
}

export function vendorAccountStatementResponseStub(): AccountStatementResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 1,
      totalReturned: 1,
    },
    transactions: [
      {
        transactionId: 2165529378315486700,
        referenceId: 2165529378315486700,
        referenceType: 'tagIcon',
        type: 'DEBIT',
        amount: {
          amount: 31.01,
          currency: 'EGP',
        },
        balanceAfter: {
          amount: 31.01,
          currency: 'EGP',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
        effectiveDate: '2018-09-05T19:04:53.178Z',
        details: {
          additionalProp1: {},
        },
      },
    ],
    openingBalance: {
      amount: 31.01,
      currency: 'EGP',
    },
    monthOpeningBalance: {
      amount: 31.01,
      currency: 'EGP',
    },
  };
}

export function vendorTiersResponseStub(): TiersResponse {
  return {
    currentMultipleFees: true,
    futureMultipleFees: true,
    currentTiers: [
      {
        name: 'Tier 2',
        singleTransactionFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        multipleTransactionsFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        active: false,
        remainingTransactions: 70,
        transactionsRange: {
          min: 1,
          max: 150,
        },
      },
    ],
    futureTiers: [
      {
        name: 'Tier 2',
        singleTransactionFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        multipleTransactionsFees: {
          amount: 31.01,
          currency: 'EGP',
        },
        transactionsRange: {
          min: 1,
          max: 150,
        },
      },
    ],
  };
}

export function vendorPromotionsResponseStub(): PromotionsResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    promotions: [
      {
        id: 2165529378315486700,
        percentage: 14,
        creationDate: '2018-09-05T19:04:53.178Z',
        effectiveDate: '2018-09-05T19:04:53.178Z',
        expiryDate: '2018-10-05T19:04:53.178Z',
        title: 'NEW_PARTNERSHIP_PROMOTION',
        type: 'DISCOUNT',
        lastUpdatedBy: {
          userId: 123654789,
          userEmail: 'test@email.com',
        },
      },
    ],
  };
}

export function vendorDetailsResponseStub(): VendorDetailsResponse {
  return {
    id: 2165529378315486700,
    paymentRiskStatus: '_03_NONE',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    ledgerId: 2165529378315486700,
    branchCount: 50,
    activeBranchesCount: 50,
    averagePrepTime: 10,
    transactionCount: 20,
    legalInfo: {
      companyName: 'Company Name',
      companyAddress: 'Maadi',
    },
    label: 'McDonald',
    type: 'FOOD',
    prepaid: false,
    trackingSMS: false,
    subscriptionStatus: '_01_AT_RISK',
    languageSupport: {
      en: true,
      ar: true,
    },
    creationDate: '2018-09-05T19:04:53.178Z',
    active: false,
    vendorUsers: [
      {
        vendorUserId: 123654789,
        fullName: 'Bakaka Dassa',
        mobileNo: '1062131123123',
        email: 'example@domain.com',
        title: 'Dassa',
        status: 'Registered',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tags: [
      {
        id: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'NONE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    hashTags: [
      {
        id: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tax: 14,
    taxStatus: 'NOT_APPLICABLE',
    hasProfile: true,
    minimumOrderValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    dispatchPriority: 'NORMAL',
    rating: 0,
    fake: false,
    stacking: false,
    maxStackedOrders: 1,
    stackingWindowInMinutes: 1,
  };
}

export function vendorDebitCreditNotesListResponseStub(): VendorDebitCreditNotesListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 10,
      totalReturned: 1,
    },
    notes: [
      {
        id: 2165529378315486700,
        accountId: 2165529378315486700,
        serialNumber: 'A-5151',
        description: 'a note description',
        amount: {
          amount: 31.01,
          currency: 'EGP',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
        type: 'CREDIT_BALANCE',
        pdfStatus: 'GENERATED',
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
      },
    ],
  };
}

export function getDebitCreditDownloadUrlResponseStub(): GetDebitCreditPDFDownloadUrlResponse {
  return {
    url: 'https://vrigingates.com/api/v1/invoices/1234/download?token=123987896ykjdhfa',
  };
}

export function vendorProfileDetailsResponseStub(): VendorDetailsResponse {
  return {
    id: 2165529378315486700,
    paymentRiskStatus: '_03_NONE',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    ledgerId: 2165529378315486700,
    branchCount: 50,
    activeBranchesCount: 50,
    averagePrepTime: 10,
    transactionCount: 20,
    legalInfo: {
      companyName: 'Company Name',
      companyAddress: 'Maadi',
    },
    label: 'McDonald',
    type: 'FOOD',
    prepaid: false,
    trackingSMS: false,
    subscriptionStatus: '_01_AT_RISK',
    languageSupport: {
      en: true,
      ar: true,
    },
    creationDate: '2018-09-05T19:04:53.178Z',
    active: false,
    fake: false,
    vendorUsers: [
      {
        vendorUserId: 123654789,
        fullName: 'Bakaka Dassa',
        mobileNo: '1062131123123',
        email: 'example@domain.com',
        title: 'Dassa',
        status: 'Registered',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tags: [
      {
        id: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'NONE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    hashTags: [
      {
        id: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    tax: 14,
    taxStatus: 'NOT_APPLICABLE',
    hasProfile: true,
    minimumOrderValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    dispatchPriority: 'NORMAL',
    rating: 0,
    stacking: false,
    maxStackedOrders: 1,
    stackingWindowInMinutes: 1,
  };
}

export function vendorUsersListResponse(): ListVendorUsersResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    vendorUsers: [
      {
        id: 2165529378315486700,
        vendorId: 2165529378315486700,
        active: false,
        name: 'Laila',
        mobileNo: '1062131123123',
        email: 'Laila@Laila.com',
        title: 'Princess',
        roles: ['VendorCallCenterAgent'],
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function vendorUserCreationResponse(): CreateVendorUserResponse {
  return {
    vendorUserId: 2165529378315486700,
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}
