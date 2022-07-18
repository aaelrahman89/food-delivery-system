import { HashTagsListResponse } from '../definitions/hash-tags';

export function hashTagsListResponseStub(): HashTagsListResponse {
  return {
    metadata: {
      skipped: 1,
      limit: 2,
      totalCount: 3,
      totalReturned: 4,
    },
    hashTags: [
      {
        id: 2165529,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        status: 'VISIBLE',
        vendorsCount: 19,
        itemsCount: 82,
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}
