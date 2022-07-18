import {
  C2CBrandCreationResponse,
  HubProfileResponse,
  HubZoneRatesResponse,
  HubsListV2Response,
} from '../definitions/hubs';

export function hubZoneRatesResponse(): HubZoneRatesResponse {
  return [
    {
      areaZone: {
        zoneId: 193665522943424,
        name: {
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
      },
      rateName: 'rate1',
    },
  ];
}

export function c2cBrandCreationResponseStub(): C2CBrandCreationResponse {
  return {
    id: 123,
  };
}

export function hubProfileResponseStub(): HubProfileResponse {
  return {
    id: 2165529378315486700,
    label: 'string',
    status: 'ACTIVE',
    address: {
      countryId: 2165529378315486700,
      cityId: 2165529378315486700,
      areaId: 2165529378315486700,
      street: 'Abdulaziz Al Saud, Al Manial',
      building: '12/60',
      floor: 3,
      apartment: 18,
      apartmentNo: '1A',
      companyName: 'VirginGates',
      landmark: 'string',
      geoLocation: {
        latitude: 31.01,
        longitude: 31.02,
      },
    },
    maxTasksPerTrip: 3,
    ratingPolicyId: 2165529378315486700,
    rates: {
      rate1: {
        amount: 31.01,
        currency: 'EGP',
      },
      rate2: {
        amount: 31.01,
        currency: 'EGP',
      },
      rate3: {
        amount: 31.01,
        currency: 'EGP',
      },
      rate4: {
        amount: 31.01,
        currency: 'EGP',
      },
      outOfZone: {
        amount: 31.01,
        currency: 'EGP',
      },
    },
    c2cBrands: [
      {
        id: 89283928413,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function hubsListV2ResponseStub(): HubsListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    hubs: [
      {
        id: 2165529378315486700,
        label: 'string',
        status: 'ACTIVE',
        address: {
          countryId: 2165529378315486700,
          cityId: 2165529378315486700,
          areaId: 2165529378315486700,
          street: 'Abdulaziz Al Saud, Al Manial',
          building: '12/60',
          floor: 3,
          apartment: 18,
          apartmentNo: '1A',
          companyName: 'VirginGates',
          landmark: 'string',
          geoLocation: {
            latitude: 31.01,
            longitude: 31.02,
          },
        },
        maxTasksPerTrip: 3,
      },
    ],
  };
}
