import { wiremock } from '../utils/wiremock';

export async function stubTagCreation({
  status,
  vendorType,
  type,
  title,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /consumer/api/v1/tags',
      body: {
        title: {
          en: title.en,
          ar: title.ar,
        },
        vendorType,
        type,
        status,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 2165529378315400,
        title: {
          en: title.en,
          ar: title.ar,
        },
        vendorType,
        type,
        status,
        creationDate: '2018-09-05T19:04:53.178Z',
        ...resBody,
      },
    });
}

export async function stubTagsList({
  query,
  resError,
  resBody,
  statusCode = 200,
} = {}) {
  return wiremock
    .stub()
    .request({ requestLine: 'get /consumer/api/v1/tags', query: { query } })
    .response({
      statusCode,
      body: resError || {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
          totalReturned: 0,
        },
        tags: [
          {
            id: 2165529378315486700,
            imageId: 15486700,
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
        ...resBody,
      },
    });
}

export async function stubFetchSingleTag({
  tagId,
  resError,
  resBody,
  statusCode,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/tags/:tagId',
      params: { tagId },
    })
    .response({
      statusCode,
      body: resError || {
        id: tagId,
        imageId: 315486700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'NONE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
        ...resBody,
      },
    });
}

export async function stubUpdateTag({ tagId, statusCode = 200 }) {
  return wiremock
    .stub()
    .request({
      requestLine: 'put /consumer/api/v1/tags/:tagId',
      params: { tagId },
    })
    .response(statusCode);
}
