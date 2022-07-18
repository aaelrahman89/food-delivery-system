import {
  AreaListResponse,
  AreasC2CServiceConfigResponse,
  AreasDetailsV2Response,
  AreasListV2Response,
} from '../definitions/areas';

export function areasListV2ResponseStub(): AreasListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    areas: [
      {
        areaId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cityId: 21234123937831514000,
        cityName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        dispatchingConfigurationList: [
          {
            serviceType: 'C2C',
            level: 'HUB',
            maxDistanceInKm: 90,
            stackingRadiusInKm: 1,
          },
        ],
        c2CPricingConfiguration: {
          distanceScaleInMeters: 4.5,
          distanceScalePrice: {
            amount: 31.01,
            currency: 'EGP',
          },
          durationScaleInMinutes: 4.5,
          durationScalePrice: {
            amount: 31.01,
            currency: 'EGP',
          },
          startingFee: {
            amount: 31.01,
            currency: 'EGP',
          },
          minimumTripFare: {
            amount: 31.01,
            currency: 'EGP',
          },
          surgeCharge: 4.5,
        },
      },
    ],
  };
}

export function areasDetailsV2ResponseStub(): AreasDetailsV2Response {
  return {
    areaId: 789,
    cityId: 456,
    name: {
      en: 'Manial',
      ar: 'المنيل',
    },
    cityName: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    dispatchingConfigurationList: [
      {
        serviceType: 'B2B',
        level: 'HUB',
        maxDistanceInKm: 90,
        stackingRadiusInKm: 1,
      },
      {
        serviceType: 'B2C',
        level: 'HUB',
        maxDistanceInKm: 4,
        stackingRadiusInKm: 1,
      },
      {
        serviceType: 'C2C',
        level: 'AREA',
        maxDistanceInKm: 1,
        stackingRadiusInKm: 1,
      },
    ],
    c2CPricingConfiguration: {
      distanceScaleInMeters: 0,
      distanceScalePrice: { amount: 0, currency: 'EGP' },
      durationScaleInMinutes: 0,
      durationScalePrice: { amount: 0, currency: 'EGP' },
      startingFee: { amount: 0, currency: 'EGP' },
      minimumTripFare: { amount: 0, currency: 'EGP' },
      surgeCharge: 0,
    },
  };
}

export function areasC2CServiceConfigResponseStub(): AreasC2CServiceConfigResponse {
  return {
    metadata: {
      totalCount: 1,
      limit: 25,
      skipped: 1,
      totalReturned: 1,
    },
    areas: [
      {
        areaName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        areaId: 2165529378315486700,
        cityName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cityId: 2165529378315486700,
        pricingConfig: {
          distanceScaleInMeters: 4.5,
          distanceScalePrice: {
            amount: 31.01,
            currency: 'EGP',
          },
          durationScaleInMinutes: 4.5,
          durationScalePrice: {
            amount: 31.01,
            currency: 'EGP',
          },
          startingFee: {
            amount: 31.01,
            currency: 'EGP',
          },
          minimumTripFare: {
            amount: 31.01,
            currency: 'EGP',
          },
          surgeCharge: 4.5,
        },
        workingHours: [
          {
            from: '19:04:53',
            to: '19:04:53',
          },
        ],
        maxErrandPoints: 123,
        twentyFourHours: false,
      },
    ],
  };
}

export function areasListResponseStub(): AreaListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    areas: [
      {
        areaId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cityId: 21234123937831514000,
        cityName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
    ],
  };
}
