import { ItemResponse, ItemsListResponse } from '../definitions/items';

export function itemResponseStub(): ItemResponse {
  return {
    itemId: 12341,
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
    price: {
      amount: 31.01,
      currency: 'EGP',
    },
    tags: [
      {
        id: 12341,
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
        id: 12341,
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
        optionId: 123,
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
        related: false,
        selections: [
          {
            id: 1234,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 75.5,
              currency: 'EGP',
            },
            relatedOptions: [456],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
      {
        optionId: 456,
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
        related: true,
        selections: [
          {
            id: 1234,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            calories: 200,
            price: {
              amount: 75.5,
              currency: 'EGP',
            },
            relatedOptions: [123],
          },
        ],
        template: false,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    catalogueId: 12341,
    catalogueSections: [
      {
        catalogueSectionId: 12341,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    coverPhotosIds: [12341],
    creationDate: '2018-09-05T19:04:53.178Z',
    popular: false,
    defaultCoverPhotoId: 12341,
    unavailableBranches: [],
  };
}

export function itemsListResponseStub(): ItemsListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    items: [
      {
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
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        catalogueId: 2165529378315486700,
        vendorId: 2165529378315486700,
        catalogueSectionIds: [2165529378315486700],
        coverPhotosIds: [2165529378315486700],
        defaultCoverPhotoId: 2165529378315486700,
        creationDate: '2018-09-05T19:04:53.178Z',
        popular: true,
        unavailableBranches: [2165529378315486700],
      },
    ],
  };
}
