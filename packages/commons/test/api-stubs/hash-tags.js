import { wiremock } from '../utils/wiremock';

export async function stubHashTagCreation({
  status,
  vendorType,
  title,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/hash-tags',
      body: {
        title,
        vendorType,
        status,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 2165529378315400,
        title,
        vendorType,
        status,
        ...resBody,
      },
    });
}

export async function stubHashTagUpdate(tagId, { status, title }) {
  return wiremock
    .stub()
    .request({
      requestLine: 'patch /consumer/api/v1/hash-tags/:tagId',
      params: { tagId },
      body: {
        title,
        status,
      },
    })
    .response({
      status: 200,
    });
}

export async function stubHashTagsList({
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
      body: resError || {
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
            vendorType: 'FOOD',
            status: 'VISIBLE',
            vendorsCount: 10,
            itemsCount: 10,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        ...resBody,
      },
    });
}
