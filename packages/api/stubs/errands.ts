import {
  CoveredZonesResponse,
  DetectZoneResponse,
  ErrandCategoriesListResponse,
  ErrandCategoryCreationResponse,
  ErrandOrderCalculateResponse,
  ErrandOrderResponse,
  ErrandsOrderJourneyResponse,
} from '../definitions/errands';
import { GeojsonCoordinates } from '../definitions/common';

export function errandCategoryCreationResponseStub(): ErrandCategoryCreationResponse {
  return {
    id: 2165529378315486700,
    creationDate: '2018-09-05T19:04:53.178Z',
  };
}

export function errandCategoriesListResponseStub(): ErrandCategoriesListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    categories: [
      {
        id: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        avgPreparationTime: 30,
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
        status: 'HIDDEN',
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
      },
      {
        id: 2165529378315486701,
        displayName: {
          en: 'Not so necessary menu',
          ar: 'القائمة و لكن ليست ضرورية',
        },
        avgPreparationTime: 20,
        createdBy: {
          id: 2165529378315486702,
          email: 'example@example.com',
        },
        status: 'VISIBLE',
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function errandOrderDetailsResponseStub(): ErrandOrderResponse {
  return {
    orderId: 123,
    customer: {
      id: 1234,
      name: 'user name',
      mobileNo: '01017848300',
    },
    address: {
      id: 1,
      title: 'mkany',
      countryId: 1,
      cityId: 1,
      areaId: 1,
      addressLine1: 'bla bla st',
      building: '23rd',
      floor: 2,
      apartmentNo: '80',
      companyName: '',
      landmark: 'feh koshary cart 2odam el 3mara',
      pinnedLocation: {
        type: 'Point',
        coordinates: [31.457211524248123, 30.00518028593313],
      },
    },
    customerOrderId: '1234',
    creationDate: '2021-02-14T08:00:03.434Z',
    status: 'REQUESTED',
    type: 'ERRANDS',
    subTotal: {
      amount: 10,
      currency: 'EGP',
    },
    tax: {
      amount: 10,
      currency: 'EGP',
    },
    total: {
      amount: 10,
      currency: 'EGP',
    },
    totalDueAmount: {
      amount: 10,
      currency: 'EGP',
    },
    balanceImpact: {
      amount: 10,
      currency: 'EGP',
    },
    estimatedDeliveryFees: {
      amount: 10,
      currency: 'EGP',
    },
    deliveryFees: {
      amount: 10,
      currency: 'EGP',
    },
    deliveryFeesTax: {
      amount: 10,
      currency: 'EGP',
    },
    paymentMethod: 'Cash',
    orderReceipts: [
      {
        id: 0,
        signedUrl: '',
      },
    ],
    orderPickups: [
      {
        deleted: false,
        pickupId: 12,
        categoryId: 122425234,
        pickupStatus: 'REQUESTED',
        categoryDisplayName: {
          en: 'Saudi',
          ar: 'The desert',
        },
        location: {
          description: 'behind the Giant',
          point: {
            type: 'Point',
            coordinates: [31.457211524248123, 30.00518028593313],
          },
        },
        description: 'Giant orb',
        uploadedImages: [
          {
            id: 0,
            signedUrl:
              'https://i.pinimg.com/originals/bd/3d/0d/bd3d0d5df70b29cc4e6300386f17cab6.png',
          },
        ],
        voiceNote: {
          id: 0,
          signedUrl: '',
        },
        includePictures: false,
        includeVoiceNote: false,
        items: [
          {
            name: 'Medical Giant orb',
            brand: 'Asian Giant',
            quantity: '3 lbs',
            notes: "Don't taste the orb",
          },
        ],
      },
      {
        deleted: true,
        pickupId: 10,
        categoryId: 122425234,
        pickupStatus: 'REQUESTED',
        categoryDisplayName: {
          en: 'Saudi',
          ar: 'The desert',
        },
        location: {
          description: 'behind the Giant',
          point: {
            type: 'Point',
            coordinates: [31.457211524248123, 30.00518028593313],
          },
        },
        description: 'Giant orb',
        uploadedImages: [
          {
            id: 0,
            signedUrl:
              'https://i.pinimg.com/originals/bd/3d/0d/bd3d0d5df70b29cc4e6300386f17cab6.png',
          },
        ],
        voiceNote: {
          id: 0,
          signedUrl: '',
        },
        includePictures: false,
        includeVoiceNote: false,
        items: [
          {
            name: 'Medical Giant orb',
            brand: 'Asian Giant',
            quantity: '3 lbs',
            notes: "Don't taste the orb",
          },
        ],
      },
    ],
    rated: false,
    maxErrandPoints: 5,
  };
}

export function detectZoneResponseStub(): DetectZoneResponse {
  const point: GeojsonCoordinates = [31.457211524248123, 30.00518028593313];
  return {
    zoneId: 193665522943424,
    name: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    area: {
      areaId: 2165529378315486700,
      name: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      cityId: 21234123937831514000,
      countryId: 193665522943424,
    },
    polygon: {
      type: 'Polygon',
      coordinates: [[point]],
    },
    servedServices: [
      {
        id: 2165529378315486700,
        category: 'C2C',
        type: 'ERRANDS',
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
    ],
  };
}

export function errandOrderCoveredZonesResponseStub(): CoveredZonesResponse {
  return {
    coveredZones: [
      {
        zoneId: 1,
        name: {
          en: 'z1',
          ar: 'z1',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [31.23091220855713, 30.03974911452843],
              [31.225590705871586, 30.037148518586548],
              [31.230354309082035, 30.032132890812907],
              [31.23447418212891, 30.032764502354542],
              [31.235504150390625, 30.03796585609452],
              [31.23091220855713, 30.03974911452843],
            ],
          ],
        },
      },
      {
        zoneId: 2,
        name: {
          en: 'z2',
          ar: 'z2',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [31.23091220855713, 30.03974911452843],
              [31.225590705871586, 30.037148518586548],
              [31.230354309082035, 30.032132890812907],
              [31.23447418212891, 30.032764502354542],
              [31.235504150390625, 30.03796585609452],
              [31.23091220855713, 30.03974911452843],
            ],
          ],
        },
      },
    ],
  };
}

export function errandOrderCalculationResponseStub(): ErrandOrderCalculateResponse {
  return {
    estimatedDeliveryFee: {
      amount: 300,
      currency: 'EGP',
    },
    tax: {
      amount: 300,
      currency: 'EGP',
    },
  };
}

export function errandOrderJourneyResponseStub(): ErrandsOrderJourneyResponse {
  return {
    orderId: 1234567894125456,
    timelineJourney: [
      {
        journeyStopStatus: 'REQUESTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'ORDER',
        },
        data: { platform: 'IOS' },
      },
      {
        journeyStopStatus: 'CONFIRMED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {},
      },
      {
        journeyStopStatus: 'REJECTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {
          rejectionReason: 'Illegal Items',
        },
      },
      {
        journeyStopStatus: 'CANCELLED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {
          id: 2165529378315480,
          email: 'example@example.com',
        },
        linkedEntity: {},
        data: {
          cancellationReason: 'Sample Reason',
          cancellationReasonCategory: 'Sample Reason Category',
          refunded: 'true',
        },
      },
      {
        journeyStopStatus: 'PILOT_REQUESTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'TRIP',
        },
        data: {},
      },
      {
        journeyStopStatus: 'PILOT_ASSIGNED',
        durationInSeconds: 600,
        actionBy: {},
        stopDateTime: '2018-09-05T19:04:53.178Z',
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'PILOT',
        },
        data: {},
      },
      {
        journeyStopStatus: 'PICKUP',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315480,
          entityName: 'PICKUP',
        },
        data: {
          COLLECTING: '2018-09-05T19:04:53.178Z',
          COLLECTED: '2018-09-05T19:04:53.178Z',
          status: 'REQUESTED',
          name: 'PICKUP1',
          pickupsCount: '3',
        },
      },
      {
        journeyStopStatus: 'PICKUP',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315481,
          entityName: 'PICKUP',
        },
        data: {
          COLLECTING: '2018-09-05T19:04:53.178Z',
          COLLECTED: '2018-09-05T19:04:53.178Z',
          status: 'REQUESTED',
          name: 'PICKUP2',
          pickupsCount: '3',
        },
      },
      {
        journeyStopStatus: 'PICKUP',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {
          entityId: 2165529378315482,
          entityName: 'PICKUP',
        },
        data: {
          COLLECTING: '2018-09-05T19:04:53.178Z',
          COLLECTED: '2018-09-05T19:04:53.178Z',
          status: 'REQUESTED',
          name: 'PICKUP3',
          pickupsCount: '3',
        },
      },
      {
        journeyStopStatus: 'COLLECTED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {},
        data: {},
      },
      {
        journeyStopStatus: 'DELIVERED',
        durationInSeconds: 600,
        stopDateTime: '2018-09-05T19:04:53.178Z',
        actionBy: {},
        linkedEntity: {},
        data: {},
      },
    ],
  };
}
