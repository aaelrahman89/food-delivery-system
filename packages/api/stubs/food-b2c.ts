import {
  FoodB2CHubZoneRatesResponse,
  FoodB2CZoneRatingPolicyCreationResponse,
} from '../definitions/food-b2c';

export function foodB2CZoneRatingPolicyCreationResponse(): FoodB2CZoneRatingPolicyCreationResponse {
  return {
    id: 1236677,
    creationDate: '2020-03-18T14:37:11.226Z',
  };
}

export function foodB2CHubZoneRatesResponse(): FoodB2CHubZoneRatesResponse {
  return {
    metadata: {
      skipped: 1,
      limit: 2,
      totalCount: 3,
      totalReturned: 4,
    },
    hubZonesRates: [
      {
        hubId: 193665522943424,
        zoneId: 193665522943424,
        zoneName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [-1.43, 31.3],
              [-1.43, 31.2],
              [-1.43, 31.1],
              [-1.43, 31.3],
            ],
          ],
        },
        ratingPolicyId: 123444,
        rateName: 'rate2',
      },
    ],
  };
}
