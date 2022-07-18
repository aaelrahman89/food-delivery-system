import { wiremock } from '../utils/wiremock';

export async function stubTagGroupCreation({
  status,
  vendorType,
  title,
  tagIds,
  hashTagIds,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /consumer/api/v1/tag-groups',
      body: {
        title: {
          en: title.en,
          ar: title.ar,
        },
        vendorType,
        status,
        tagIds,
        hashTagIds,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 2165529378315400,
        ...resBody,
      },
    });
}

export async function stubTagGroupUpdate({
  tagGroupId,
  title,
  status,
  tagIds,
  hashTagIds,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'put /consumer/api/v1/tag-groups/:tagGroupId',
      params: { tagGroupId },
      body: {
        title,
        status,
        tagIds,
        hashTagIds,
      },
    })
    .response(statusCode);
}

export async function stubGetTagGroup({
  tagGroupId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/tag-groups/:tagGroupId',
      params: { tagGroupId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: tagGroupId,
        title: { en: 'en text', ar: 'ar text' },
        status: 'VISIBLE',
        vendorType: 'FOOD',
        tagGroupImageId: 15486700,
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
            imageId: 315486700,
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
            status: 'VISIBLE',
            vendorType: 'FOOD',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        creationDate: '2018-09-05T19:04:53.178Z',
        ...resBody,
      },
    });
}

export async function stubTagGroupsList({
  query,
  statusCode = 200,
  resError,
  resBody,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/tag-groups',
      query: {
        query,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
          totalReturned: 0,
        },
        tagGroups: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            status: 'VISIBLE',
            vendorType: 'FOOD',
            tagsCount: 10,
            hashTagsCount: 5,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        ...resBody,
      },
    });
}
