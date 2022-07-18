import { wiremock } from '../utils/wiremock';

export async function stubHomepageSectionCreation({
  title,
  sectionType,
  contentCriteria,
  headerType,
  thresholdValue,
  vendorType,
  status,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /consumer/api/v1/homepage-sections',
      body: {
        title: {
          en: title.en,
          ar: title.ar,
        },
        sectionType,
        contentCriteria,
        headerType,
        thresholdValue,
        vendorType,
        status,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 2165529378315486700,
        creationDate: '2018-09-05T19:04:53.178Z',
        ...resBody,
      },
    });
}

export async function stubHomepageSectionsList({
  query,
  statusCode = 200,
  resError,
  resBody,
} = {}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /consumer/api/v1/homepage-sections',
      query,
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
        homepageSections: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            sectionType: 'NONE',
            contentCriteria: 'NONE',
            headerType: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
            vendorType: 'FOOD',
            thresholdValue: 0,
          },
        ],
        ...resBody,
      },
    });
}

export async function stubArrangeHomepageSections({ statusCode = 200 } = {}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /consumer/api/v1/homepage-sections/arrange-sections',
    })
    .response({
      status: statusCode,
    });
}
