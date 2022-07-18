import {
  B2CBranchesListResponse,
  BranchCataloguesListResponse,
  BranchDetailsResponse,
  BranchItemResponse,
  BranchItemsListResponse,
  BranchOrdersResponse,
  BranchPilotRequestingResponse,
  BranchPilotRequestingV2Response,
  BranchProfileResponse,
  BranchServedZonesResponse,
  BranchesListResponse,
  BranchesListV2Response,
  BusinessBranchDetailsResponse,
  ConsumerB2CBranchesListResponse,
  ConsumerBranchDetailsResponse,
  ConsumerBranchItemResponse,
  RetrieveBranchCodeResponse,
  VendorBranchProfileResponse,
  VendorBranchesListingResponse,
} from '../definitions/branches';
import { BranchCatalogueDetailsResponse } from '../definitions/catalogues';
import { ItemResponse } from '../definitions/items';

export function branchProfileResponseStub(): BranchProfileResponse {
  return {
    id: 1,
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
    minimumOrderValue: {
      amount: 31.01,
      currency: 'EGP',
    },
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    label: 'McDonald',
    hasProfile: false,
    avgBasketSize: {
      amount: 60.15,
      currency: 'EGP',
    },
  };
}

export function itemDetailsResponseStub(): ItemResponse {
  return {
    itemId: 2165529378315486700,
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    archived: false,
    calories: 200,
    prepTime: 5,
    popular: false,
    unavailableBranches: [2165529378315486700],
    price: {
      amount: 31.01,
      currency: 'EGP',
    },
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
    options: [
      {
        optionId: 2165529378315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        mandatory: false,
        multiSelection: false,
        minAllowed: 5,
        maxAllowed: 5,
        selections: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2165529378315486700],
          },
        ],
        template: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        related: true,
      },
    ],
    catalogueId: 2165529378315486700,
    defaultCoverPhotoId: 2165529378315486700,
    catalogueSections: [
      {
        catalogueSectionId: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    coverPhotosIds: [2165529378315486700],
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function branchItemResponseStub(): BranchItemResponse {
  return {
    itemId: 634573421,
    catalogueId: 35673445353,
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    price: {
      amount: 31.01,
      currency: 'EGP',
    },
    calories: 200,
    prepTime: 35,
    tags: [
      {
        id: 2165529378315486700,
        imageId: 8315486700,
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
    catalogueSections: [
      {
        catalogueSectionId: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    options: [
      {
        optionId: 415221515,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        mandatory: true,
        multiSelection: true,
        minAllowed: 2,
        maxAllowed: 3,
        related: false,
        selections: [
          {
            id: 123,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 456,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 1111,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
      {
        optionId: 213521512,
        related: true,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        mandatory: false,
        multiSelection: false,
        minAllowed: 2,
        maxAllowed: 3,
        selections: [
          {
            id: 1234,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 5678,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 91022,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 30009,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 741111,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    coverPhotosIds: [2165529378315486700],
    defaultCoverPhoto: 3423325253242,
    archived: true,
    popular: true,
    available: true,
    branchB2CStatus: 'BUSY_ONE_HOUR',
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function consumerBranchItemResponseStub(): ConsumerBranchItemResponse {
  return {
    itemId: 634573421,
    catalogueId: 35673445353,
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    price: {
      amount: 31.01,
      currency: 'EGP',
    },
    calories: 200,
    prepTime: 35,
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
    catalogueSections: [
      {
        catalogueSectionId: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    options: [
      {
        optionId: 415221515,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        mandatory: true,
        multiSelection: true,
        minAllowed: 2,
        maxAllowed: 3,
        related: false,
        selections: [
          {
            id: 123,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 456,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 1111,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
      {
        optionId: 213521512,
        related: true,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        mandatory: false,
        multiSelection: false,
        minAllowed: 2,
        maxAllowed: 3,
        selections: [
          {
            id: 1234,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 5678,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 91022,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 30009,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
          {
            id: 741111,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    coverPhotosIds: [2165529378315486700],
    defaultCoverPhoto: 3423325253242,
    archived: true,
    popular: true,
    available: true,
    branchB2CStatus: 'BUSY_ONE_HOUR',
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function branchItemsListResponseStub(): BranchItemsListResponse {
  return {
    metadata: {
      skipped: 5,
      limit: 7,
      totalCount: 34,
      totalReturned: 0,
    },
    items: [
      {
        itemId: 23421,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        calories: 200,
        prepTime: 5,
        popular: false,
        available: false,
        price: {
          amount: 31.01,
          currency: 'EGP',
        },
        tags: [
          {
            id: 42134,
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
            id: 978431,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        options: [
          {
            optionId: 869128391,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 5,
            maxAllowed: 5,
            selections: [
              {
                selectionId: 6589712,
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 200,
                price: {
                  amount: 31.01,
                  currency: 'EGP',
                },
              },
            ],
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        catalogueId: 987231412,
        defaultCoverPhotoId: 849132,
        catalogueSectionIds: [12081],
        coverPhotosIds: [98789344111],
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function branchPilotRequestingResponseStub(): BranchPilotRequestingResponse {
  return {
    tripId: 432145,
    taskId: 551,
    maxAllowedTasksCount: 3,
  };
}

export function branchPilotRequestingV2ResponseStub(): BranchPilotRequestingV2Response {
  return {
    tripId: 432145,
    taskId: 551,
    maxAllowedTasksCount: 3,
  };
}

// GET /branches
export function branchesListResponseStub(): BranchesListResponse {
  return [
    {
      id: 2165529378315486700,
      vendorId: 2165529378315486700,
      avgTransactionPerHour: 20,
      label: 'McDonald Manial',
      vendorLabel: 'McDonald',
      creationDate: '2018-09-05T19:04:53.178Z',
      displayName: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      active: false,
      deliverySMS: false,
      serviceTypes: ['B2B', 'B2C'],
      b2cStatus: 'BUSY_ONE_HOUR',
      maxStackedOrders: 0,
      stackingWindowInMinutes: 0,
    },
  ];
}

export function branchesListV2ResponseStub(): BranchesListV2Response {
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
        vendorId: 2165529378315486700,
        hubId: 2165529378315486700,
        avgTransactionPerHour: 20,
        label: 'McDonald Manial',
        vendorLabel: 'McDonald',
        serviceTypes: ['B2B'],
        creationDate: '2018-09-05T19:04:53.178Z',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        active: false,
        deliverySMS: false,
        b2cStatus: 'BUSY_TWO_HOUR',
        maxStackedOrders: 10,
        stackingWindowInMinutes: 30,
        stacking: false,
      },
    ],
  };
}

export function b2cBranchesListResponseStub(): B2CBranchesListResponse {
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
        vendorId: 2165529378315486700,
        hubId: 2165529378315486700,
        avgTransactionPerHour: 20,
        label: 'McDonald Manial',
        vendorLabel: 'McDonald',
        serviceTypes: ['B2B'],
        creationDate: '2018-09-05T19:04:53.178Z',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        active: false,
        deliverySMS: false,
        b2cStatus: 'BUSY_TWO_HOUR',
      },
    ],
  };
}

export function consumerB2cBranchesListResponseStub(): ConsumerB2CBranchesListResponse {
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
        vendorId: 2165529378315486700,
        hubId: 2165529378315486700,
        avgTransactionPerHour: 20,
        label: 'McDonald Manial',
        vendorLabel: 'McDonald',
        creationDate: '2018-09-05T19:04:53.178Z',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        active: false,
        b2cStatus: 'BUSY_TWO_HOUR',
      },
    ],
  };
}

// GET /branches/:branchId/code
export function retrieveBranchCodeResponseStub(): RetrieveBranchCodeResponse {
  return {
    id: 21655293783,
    code: '91812412',
  };
}

// GET /branches/:branchId/catalogues
export function branchCataloguesListResponseStub(): BranchCataloguesListResponse {
  return [
    {
      catalogueId: 2165529378315486700,
      title: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      description: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      vendor: {
        id: 2165529378315486700,
        type: 'FOOD',
      },
      status: 'DRAFT',
      publishedBranches: [2165529378315486700],
      orderingHours: {
        from: '19:04:53',
        to: '19:04:53',
      },
    },
  ];
}

export function branchCatalogueDetailsResponseStub(): BranchCatalogueDetailsResponse {
  return {
    catalogueId: 2165529378315486700,
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    description: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    vendor: {
      id: 2165529378315486700,
      type: 'FOOD',
    },
    availableForOrdering: true,
    catalogueSections: [
      {
        catalogueSectionId: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        items: [
          {
            id: 2165529378315486700,
            displayName: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            prepTime: 5,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            popular: true,
            archived: false,
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
            sectionReferences: [{ sectionId: 2165529378315486700, order: 1 }],
            available: true,
          },
        ],
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    status: 'DRAFT',
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    languageSupport: {
      en: true,
      ar: false,
    },
  };
}

export function branchServedZonesResponseStub(): BranchServedZonesResponse {
  return {
    branchLocation: {
      type: 'Point',
      coordinates: [-1.43, 31.3],
    },
    hubLocation: {
      type: 'Point',
      coordinates: [-1.43, 31.3],
    },
    zones: [
      {
        zoneId: 2165529378315486700,
        zoneName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        rateName: 'rate1',
        rateValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [[[-1.43, 31.3]]],
        },
      },
    ],
  };
}

export function branchOrdersResponseStub(): BranchOrdersResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    orders: [
      {
        orderId: 2165529378315486700,
        items: [
          {
            itemId: 2165529378315486700,
            price: 75.5,
            quantity: 5,
            notes: 'KFC',
            options: [
              {
                optionId: 2165529378315486700,
                selections: [
                  {
                    selectionId: 2165529378315486700,
                    price: 75.5,
                  },
                ],
              },
            ],
          },
        ],
        customerOrderId: 'AX7F8W',
        creationDate: '2018-09-05T19:04:53.178Z',
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        customerId: 2165529378315486700,
        branchId: 2165529378315486700,
        vendorId: 2165529378315486700,
        addressId: 2165529378315486700,
        scheduled: false,
        scheduledTo: { from: '', to: '' },
        paymentMethod: 'Cash',
        notes: 'add Ketchup',
        subTotal: 75.5,
        tax: 10,
        taxWithoutDeliveryFees: {
          amount: 10,
          currency: 'EGP',
        },
        deliveryFees: 10,
        totalWithoutDeliveryFees: {
          amount: 10,
          currency: 'EGP',
        },
        total: 10,
        vendorOrderId: '123',
        status: 'REQUESTED',
        type: 'C2C',
      },
    ],
  };
}

export function branchDetailsResponseStub(): BranchDetailsResponse {
  return {
    id: 2165529378315486700,
    hubId: 2165529378315486700,
    vendorId: 2165529378315486700,
    notificationToken:
      'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
    label: 'McDonald',
    active: false,
    vendorName: 'McDonald',
    vendorType: 'FOOD',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    address: {
      countryId: 2165529378315486700,
      cityId: 2165529378315486700,
      areaId: 2165529378315486700,
      street: 'Abdulaziz Al Saud, Al Manial',
      building: '12/60',
      floor: 3,
      apartment: 18,
      apartmentNo: '1A',
      companyName: 'VirginGates',
      landmark: 'string',
      geoLocation: {
        latitude: 31.01,
        longitude: 31.02,
      },
    },
    avgTransactionPerMonth: 50,
    avgTransactionPerDay: 50,
    avgTransactionPerHour: 50,
    creationDate: '2018-09-05T19:04:53.178Z',
    contactPersons: [
      {
        fullName: 'Bakaka Dassa',
        mobileNo: '75453736531',
        email: 'example@domain.com',
        title: 'Dassa',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    rushHour: [
      {
        from: '19:04:53',
        to: '19:04:53',
      },
    ],
    minimumOrderValue: 10,
    vendorTax: 10,
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    notificationSubscription: {
      auth: 'IOScBh9LW5mJ_K2JwXyNqQ==',
      key: 'ANlfcVVFB4JiMYcI74_h9h04QZ1Ks96AyEa1yrMgDwn3',
      endpoint:
        'https://fcm.googleapis.com/fcm/send/fH-M3xRoLms:APA91bGB0rkNdxTFsXaJGyyyY7LtEmtHJXy8EqW48zSssxDXXACWCvc9eXjBVU54nrBkARTj4Xvl303PoNc0_rwAMrY9dvkQzi9fkaKLP0vlwoB0uqKygPeL77Y19VYHbj_v_FolUlHa',
    },
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
    deliverySMS: false,
    tabletRent: false,
    serviceTypes: ['B2B'],
    b2cStatus: 'BUSY_ONE_HOUR',
  };
}

export function consumerBranchDetailsResponseStub(): ConsumerBranchDetailsResponse {
  return {
    id: 2165529378315486700,
    hubId: 2165529378315486700,
    vendorId: 2165529378315486700,
    notificationToken:
      'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
    label: 'McDonald',
    active: false,
    vendorName: 'McDonald',
    vendorType: 'FOOD',
    displayName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    address: {
      countryId: 2165529378315486700,
      cityId: 2165529378315486700,
      areaId: 2165529378315486700,
      street: 'Abdulaziz Al Saud, Al Manial',
      building: '12/60',
      floor: 3,
      apartmentNo: '1A',
      companyName: 'VirginGates',
      landmark: 'string',
      geoLocation: {
        latitude: 31.01,
        longitude: 31.02,
      },
    },
    avgTransactionPerMonth: 50,
    avgTransactionPerDay: 50,
    avgTransactionPerHour: 50,
    creationDate: '2018-09-05T19:04:53.178Z',
    contactPersons: [
      {
        fullName: 'Bakaka Dassa',
        mobileNo: '1062131123123',
        email: 'example@domain.com',
        title: 'Dassa',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    rushHour: [
      {
        from: '19:04:53',
        to: '19:04:53',
      },
    ],
    minimumOrderValue: 10,
    orderingHours: {
      from: '19:04:53',
      to: '19:04:53',
    },
    notificationSubscription: {
      auth: 'IOScBh9LW5mJ_K2JwXyNqQ==',
      key: 'ANlfcVVFB4JiMYcI74_h9h04QZ1Ks96AyEa1yrMgDwn3',
      endpoint:
        'https://fcm.googleapis.com/fcm/send/fH-M3xRoLms:APA91bGB0rkNdxTFsXaJGyyyY7LtEmtHJXy8EqW48zSssxDXXACWCvc9eXjBVU54nrBkARTj4Xvl303PoNc0_rwAMrY9dvkQzi9fkaKLP0vlwoB0uqKygPeL77Y19VYHbj_v_FolUlHa',
    },
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
    b2cStatus: 'BUSY_TWO_HOUR',
    avgBasketSize: {
      amount: 31.01,
      currency: 'EGP',
    },
    stacking: true,
    maxStackedOrders: 10,
    stackingWindowInMinutes: 30,
  };
}

export function businessBranchDetailsResponseStub(): BusinessBranchDetailsResponse {
  return {
    id: 2165529378315486700,
    hubId: 2165529378315486700,
    vendorId: 2165529378315486700,
    notificationToken:
      'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
    label: 'McDonald',
    active: false,
    vendorName: 'McDonald',
    address: {
      countryId: 2165529378315486700,
      cityId: 2165529378315486700,
      areaId: 2165529378315486700,
      street: 'Abdulaziz Al Saud, Al Manial',
      building: '12/60',
      floor: 3,
      apartmentNo: '1A',
      companyName: 'VirginGates',
      landmark: 'string',
      geoLocation: {
        latitude: 31.01,
        longitude: 31.02,
      },
    },
    creationDate: '2018-09-05T19:04:53.178Z',
    contactPersons: [
      {
        fullName: 'Bakaka Dassa',
        mobileNo: '1062131123123',
        email: 'example@domain.com',
        title: 'Dassa',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    notificationSubscription: {
      auth: 'IOScBh9LW5mJ_K2JwXyNqQ==',
      key: 'ANlfcVVFB4JiMYcI74_h9h04QZ1Ks96AyEa1yrMgDwn3',
      endpoint:
        'https://fcm.googleapis.com/fcm/send/fH-M3xRoLms:APA91bGB0rkNdxTFsXaJGyyyY7LtEmtHJXy8EqW48zSssxDXXACWCvc9eXjBVU54nrBkARTj4Xvl303PoNc0_rwAMrY9dvkQzi9fkaKLP0vlwoB0uqKygPeL77Y19VYHbj_v_FolUlHa',
    },
    deliverySMS: false,
    tabletRent: false,
  };
}

export function consumerVendorBranchDetailsResponseStub(): VendorBranchProfileResponse {
  return {
    id: 1308972535098256,
    label: 'سيلانترو',
    displayName: { en: '', ar: '' },
    vendorName: 'طلعت للحلويات',
    address: {
      countryId: 193665522943424,
      cityId: 540603679563664,
      areaId: 540605200588688,
      street: '20',
      building: '20',
      floor: 0,
      apartmentNo: '',
      companyName: '',
      landmark: '',
      geoLocation: {
        latitude: 31.244785251998636,
        longitude: 29.967197477817535,
      },
    },
    vendorId: 913439230642496,
    hubId: 0,
    avgTransactionPerHour: 0,
    avgTransactionPerDay: 0,
    avgTransactionPerMonth: 0,
    active: true,
    rushHour: [],
    notificationToken: '',
    contactPersons: [
      {
        fullName: 'haytham',
        mobileNo: '00',
        email: '',
        title: '',
        creationDate: '2021-02-21T13:01:35.727Z',
      },
    ],
    creationDate: '2021-02-21T11:35:43.209Z',
    minimumOrderValue: 0.0,
    notificationSubscription: { auth: '', key: '', endpoint: '' },
    orderingHours: { from: '00:00:00', to: '23:59:59' },
    tags: [
      {
        id: 1163177572172111,
        vendorType: 'FOOD',
        title: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: '2020-05-18T01:38:26.167Z',
        status: 'VISIBLE',
        type: 'DIETARY',
      },
    ],
    hashTags: [
      {
        id: 1163177572172112,
        title: { en: 'Appetizers', ar: 'مقبلات' },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        creationDate: '2020-05-18T01:38:26.167Z',
      },
    ],
    vendorType: 'FOOD',
    b2cStatus: 'AVAILABLE',
    avgBasketSize: { amount: 0.0, currency: 'EGP' },
    stacking: false,
    stackingWindowInMinutes: 0,
    maxStackedOrders: 0,
    deliveryFees: { amount: 30.0, currency: 'EGP' },
    posIntegrated: true,
    posIntegrationType: 'LINETEN',
  };
}

export function consumerVendorBranchesListingResponseStub(): VendorBranchesListingResponse {
  return {
    metadata: { skipped: 7, limit: 0, totalCount: 7, totalReturned: 7 },
    branches: [
      {
        id: 1124917187107232,
        label: 'Test0.2',
        displayName: { en: 'Test', ar: 'Testar' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 0,
        active: false,
        avgTransactionPerHour: 1,
        creationDate: '2020-10-14T11:04:56.286Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '10:00:00', to: '10:00:00' },
        stacking: true,
        stackingWindowInMinutes: 7,
        maxStackedOrders: 6,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 1140461602527344,
        label: 'TestLabel',
        displayName: { en: '', ar: '' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 0,
        active: false,
        avgTransactionPerHour: 1,
        creationDate: '2020-10-25T10:37:32.114Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '10:00:00', to: '10:00:00' },
        stacking: true,
        stackingWindowInMinutes: 7,
        maxStackedOrders: 6,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 816389977648528,
        label: 'Daddys burger House',
        displayName: { en: '', ar: '' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 1265389587562848,
        active: true,
        avgTransactionPerHour: 0,
        creationDate: '2020-03-10T12:14:49.850Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '00:00:00', to: '23:59:59' },
        stacking: false,
        stackingWindowInMinutes: 0,
        maxStackedOrders: 0,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 827626159003216,
        label: 'Daddys Burger Mobile Review City',
        displayName: {
          en: 'Daddys Burger Mobile Review City',
          ar: 'داديز برجر',
        },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 887108249381936,
        active: true,
        avgTransactionPerHour: 1,
        creationDate: '2020-03-18T10:44:51.936Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '10:00:00', to: '10:00:00' },
        stacking: true,
        stackingWindowInMinutes: 7,
        maxStackedOrders: 6,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 1014453287793377,
        label: 'Daddys burger House - New Cairo',
        displayName: { en: 'EN', ar: 'AR' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 0,
        active: true,
        avgTransactionPerHour: 10,
        creationDate: '2020-07-28T10:15:14.931Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '10:00:00', to: '10:00:00' },
        stacking: true,
        stackingWindowInMinutes: 5,
        maxStackedOrders: 2,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 1122025125753648,
        label: 'TestBranch',
        displayName: { en: '', ar: '' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 0,
        active: true,
        avgTransactionPerHour: 5,
        creationDate: '2020-10-12T10:02:58.869Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '10:00:00', to: '10:00:00' },
        stacking: true,
        stackingWindowInMinutes: 7,
        maxStackedOrders: 6,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        id: 1163090596232208,
        label: 'TestB',
        displayName: { en: '', ar: '' },
        vendorLabel: 'Daddys Burger',
        vendorId: 816387254857104,
        hubId: 0,
        active: true,
        avgTransactionPerHour: 0,
        creationDate: '2020-11-10T10:16:56.289Z',
        b2cStatus: 'AVAILABLE',
        orderingHours: { from: '00:00:00', to: '23:59:59' },
        stacking: false,
        stackingWindowInMinutes: 0,
        maxStackedOrders: 0,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
    ],
  };
}
