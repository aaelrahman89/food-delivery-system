import { TagsListResponse } from '../definitions/tags';

export function tagsListResponseStub(): TagsListResponse {
  return {
    metadata: {
      skipped: 1,
      limit: 2,
      totalCount: 3,
      totalReturned: 4,
    },
    tags: [
      {
        id: 21655293700,
        imageId: 21655293700,
        title: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'CUISINE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
      {
        id: 2165520,
        imageId: 21655293700,
        title: {
          en: 'Main Menu 2',
          ar: ' 2القائمة الرئيسية',
        },
        vendorType: 'FOOD',
        type: 'CUISINE',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
      {
        id: 216521220,
        imageId: 21655293700,
        title: {
          en: 'Main Menu 3',
          ar: ' 3القامة ئالرئيسية',
        },
        vendorType: 'FOOD',
        type: 'DIETARY',
        status: 'VISIBLE',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}
