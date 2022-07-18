import {
  ArchiveItemResponse,
  CatalogueCreationResponse,
  CatalogueDetailsResponse,
  CatalogueItemCreationResponse,
  CatalogueItemUpdateResponse,
  CataloguePublishResponse,
  CatalogueSectionCreationResponse,
  CatalogueSetAsReadyResponse,
  CatalogueUnpublishResponse,
  CataloguesListResponse,
} from '../definitions/catalogues';

export function catalogueCreationResponseStub(): CatalogueCreationResponse {
  return {
    id: 2165529378315486700,
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function catalogueDetailsResponseStub(): CatalogueDetailsResponse {
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
        vatTier: {
          id: 123,
          name: { en: 'en', ar: '' },
          percentage: 20,
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
            sectionReferences: [
              {
                sectionId: 2165529378315486700,
                order: 2,
              },
            ],
            unavailableBranches: [2165529378315486700],
          },
        ],
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
    status: 'DRAFT',
    publishedBranches: [
      {
        id: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
    ],
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

export function cataloguesListResponseStub(): CataloguesListResponse {
  return {
    metadata: {
      skipped: 1,
      limit: 2,
      totalCount: 3,
      totalReturned: 4,
    },
    catalogues: [
      {
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
        status: 'DRAFT',
        publishedBranches: [2165529378315486700],
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
      },
    ],
  };
}

export function catalogueSectionCreationResponseStub(): CatalogueSectionCreationResponse {
  return {
    id: 2165529378315486700,
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function catalogueItemCreationResponseStub(): CatalogueItemCreationResponse {
  return {
    itemId: 216552937831548230,
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function catalogueItemUpdateResponseStub(): CatalogueItemUpdateResponse {
  return {
    itemId: 123,
  };
}

export function catalogueSetAsReadyResponseStub(): CatalogueSetAsReadyResponse {
  return {
    catalogueId: 1122,
    status: 'READY',
  };
}

export function cataloguePublishResponseStub(): CataloguePublishResponse {
  return {
    catalogueId: 1122,
    status: 'PUBLISHED',
  };
}

export function catalogueUnpublishResponseStub(): CatalogueUnpublishResponse {
  return {
    catalogueId: 1122,
    status: 'DRAFT',
  };
}

export function archiveItemResponseStub(): ArchiveItemResponse {
  return {
    itemId: 666,
    catalogueId: 1122,
    archived: true,
  };
}
