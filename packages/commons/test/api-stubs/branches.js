import { wiremock } from '../utils/wiremock';

export async function stubBranchesList({
  query,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1.1/branches',
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
        branches: [
          {
            id: 2165529378315486700,
            vendorId: 2165529378315486700,
            avgTransactionPerHour: 20,
            label: 'McDonald Manial',
            vendorLabel: 'McDonald',
            creationDate: '2018-09-05T19:04:53.178Z',
            active: false,
            deliverySMS: false,
            displayName: {
              en: 'en name',
              ar: 'ar name',
            },
            serviceTypes: ['B2B', 'B2C'],
            b2cStatus: 'BUSY_ONE_HOUR',
          },
        ],
        ...resBody,
      },
    });
}

export async function stubGetBranchDetails({
  branchId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/branches/:branchId',
      params: { branchId },
    })
    .response({
      statusCode,
      body: resError ?? {
        id: 2165529378315486700,
        hubId: 2165529378315486700,
        vendorId: 2165529378315486700,
        notificationToken:
          'cjNFU9Cvavk:APA91bELJxqwc8h8FhHkZmiua-0TzLSfYGXBDFu0eBA_u2f_jLptfq_7881kd1F10TkX7ksGMl2gvU1FpCAtBrQvDUwpcIx90IPj9VSVpil7F_NhgO7twwWctevngUrULA8tKo2wTIho',
        label: 'McDonald',
        active: false,
        vendorName: 'McDonald',
        displayName: {
          en: 'en name',
          ar: 'ar name',
        },
        notificationSubscription: {
          endpoint: 'any',
          key: 'any',
          auth: 'any',
        },
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
        avgTransactionPerMonth: 50,
        avgTransactionPerDay: 50,
        avgTransactionPerHour: 50,
        creationDate: '2018-09-05T19:04:53.178Z',
        contactPersons: [
          {
            fullName: 'Bakaka Dassa',
            mobileNo: '1062131123123',
            email: 'example@domain.com',
            title: 'Dassa',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        rushHour: [
          {
            from: '19:04:53',
            to: '19:04:53',
          },
        ],
        minimumOrderValue: 10,
        vendorTax: 10,
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
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
        deliverySMS: false,
        tabletRent: false,
        vendorType: 'SURVV_SHOP',
        serviceTypes: ['B2B', 'B2C'],
        b2cStatus: 'BUSY_ONE_HOUR',
        ...resBody,
      },
    });
}
