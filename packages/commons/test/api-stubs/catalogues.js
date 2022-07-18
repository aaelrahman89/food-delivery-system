import { wiremock } from '../utils/wiremock';

export async function stubGetCatalogueDetails({
  catalogueId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
      params: {
        catalogueId,
      },
    })
    .response({
      statusCode,
      body: resError ?? {
        catalogueId,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendor: {
          id: 123456,
          type: 'FOOD',
        },
        status: 'DRAFT',
        sections: [
          {
            catalogueSectionId: 123,
            displayName: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        publishedBranches: [
          { id: 2165529378315486700, displayName: { en: 'en', ar: 'ar' } },
        ],
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        ...resBody,
      },
    });
}

export async function stubGetItemDetails({
  itemId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/items/:itemId',
      params: { itemId },
    })
    .response({
      statusCode,
      body: resError ?? {
        itemId,
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
          amount: 75.5,
          currency: 'EGP',
        },
        tags: [
          {
            id: 222,
            type: 'NONE',
            status: 'VISIBLE',
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        hashTags: [
          {
            id: 222,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            status: 'VISIBLE',
            vendorType: 'FOOD',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        popular: true,
        options: [
          {
            optionId: 4444,
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
                relatedOptions: [23456],
              },
            ],
            template: false,
            related: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        catalogueId: 123,
        catalogueSections: [
          {
            catalogueSectionId: 111,
            displayName: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        coverPhotosIds: [3456],
        creationDate: '2018-09-05T19:04:53.178Z',
        defaultCoverPhotoId: 123456789,
        unavailableBranches: [],
        ...resBody,
      },
    });
}

export async function stubGetHashTags({
  query,
  resError,
  resBody,
  statusCode = 200,
} = {}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/hash-tags',
      query: { query },
    })
    .response({
      statusCode,
      body: resError ?? {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
          totalReturned: 0,
        },
        hashTags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            status: 'VISIBLE',
            vendorType: 'FOOD',
            vendorsCount: 19,
            itemsCount: 82,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        ...resBody,
      },
    });
}

export async function stubDetailedCatalogueSectionsFetching({
  catalogueId,
  resError,
  resBody = [],
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine:
        'get /consumer/api/v1/catalogues/:catalogueId/catalogue-sections',
      params: { catalogueId },
    })
    .response({
      statusCode,
      body: resError ?? [
        {
          catalogueSectionId: 2165529378315486700,
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorType: 'FOOD',
          creationDate: '2018-09-05T19:04:53.178Z',
          items: [
            {
              itemId: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              description: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              calories: 200,
              prepTime: 5,
              price: 75.5,
              hashTags: [
                {
                  id: 2165529378315486700,
                  title: {
                    en: 'Main Menu',
                    ar: 'القائمة الرئيسية',
                  },
                  status: 'VISIBLE',
                  vendorType: 'FOOD',
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
              coverPhotosIds: [2165529378315486700],
              creationDate: '2018-09-05T19:04:53.178Z',
              varyingPrice: false,
              available: true,
            },
          ],
        },
        ...resBody,
      ],
    });
}
