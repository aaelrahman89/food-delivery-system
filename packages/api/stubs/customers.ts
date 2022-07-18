import {
  AddCreditNoteRequest,
  AddDebitNoteRequest,
  CustomersListResponse,
  DebitCreditNotesListResponse,
  ListBusinessCustomerAddressesResponse,
  ListConsumerCustomerAddressesResponse,
  UpdateCustomerAddressResponse,
  UpdateCustomerResponse,
} from '../definitions/customers';

export function customerDebitCreditNotesListResponseStub(): DebitCreditNotesListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 10,
      totalReturned: 1,
    },
    notes: [
      {
        id: 2165529378315486700,
        accountId: 2165529378315486700,
        serialNumber: 'A-5151',
        description: 'a note description',
        amount: {
          amount: 31.01,
          currency: 'EGP',
        },
        creationDate: '2018-09-05T19:04:53.178Z',
        type: 'CREDIT_BALANCE',
        pdfStatus: 'GENERATED',
        createdBy: {
          id: 2165529378315486700,
          email: 'example@example.com',
        },
      },
    ],
  };
}

export function customerAddDebitNoteRequestStub(): AddDebitNoteRequest {
  return {
    description: 'dummy debit note description',
    amount: 30,
  };
}

export function customerAddCreditNoteRequestStub(): AddCreditNoteRequest {
  return {
    description: 'dummy credit note description',
    amount: 30,
  };
}

export function listCustomersResponseStub(): CustomersListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 30,
      totalCount: 1,
      totalReturned: 1,
    },
    customers: [
      {
        id: 2165529378315486700,
        mobileNo: '01112345678',
        name: 'Test',
        creationDate: '2018-09-05T19:04:53.178Z',
      },
    ],
  };
}

export function listBusinessCustomerAddressesResponseStub(): ListBusinessCustomerAddressesResponse {
  return [
    {
      id: 2165529378315486700,
      title: 'Address 1',
      country: {
        countryId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
      city: {
        cityId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        countryId: 21234123937831514000,
      },
      area: {
        areaId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cityId: 21234123937831514000,
      },
      addressLine1: 'Abdulaziz Al Saud, Al Manial',
      building: '12/60',
      floor: 3,
      apartmentNo: '1A',
      companyName: 'VirginGates',
      landmark: 'string',
      pinnedLocation: {
        type: 'Point',
        coordinates: [-1.43, 31.3],
      },
      status: 'ACTIVE',
    },
  ];
}

export function listConsumerCustomerAddressesResponseStub(): ListConsumerCustomerAddressesResponse {
  return [
    {
      customerAddress: {
        id: 2165529378315486700,
        title: 'Address 1',
        country: {
          countryId: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
        },
        city: {
          cityId: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          countryId: 21234123937831514000,
        },
        area: {
          areaId: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          cityId: 21234123937831514000,
        },
        addressLine1: 'Abdulaziz Al Saud, Al Manial',
        building: '12/60',
        floor: 3,
        apartmentNo: '1A',
        companyName: 'VirginGates',
        landmark: 'string',
        pinnedLocation: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
        status: 'ACTIVE',
      },
      inZone: false,
    },
  ];
}

export function updateCustomerBasicInfoResponse(): UpdateCustomerResponse {
  return {
    id: 2165529378315486700,
    mobileNo: '01112345678',
    name: 'Test',
    creationDate: '2018-09-05T19:04:53.178Z',
    addresses: [
      {
        id: 2165529378315486700,
        title: 'Address 1',
        countryId: 2165529378315486700,
        cityId: 2165529378315486700,
        areaId: 2165529378315486700,
        addressLine1: 'Abdulaziz Al Saud, Al Manial',
        building: '12/60',
        floor: 3,
        apartmentNo: '1A',
        companyName: 'VirginGates',
        landmark: 'string',
        pinnedLocation: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
      },
    ],
  };
}

export function updateCustomerAddressResponse(): UpdateCustomerAddressResponse {
  return {
    id: 123654789,
    customerId: 123654789,
  };
}
