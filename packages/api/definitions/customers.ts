import {
  GeojsonPoint,
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
} from './common';

export type DebitCreditNotesListRequest = void;

export interface DebitCreditNotesListResponse {
  metadata: ListingMetadata;
  notes: DebitCreditNotesListResponseItem[];
}

export interface DebitCreditNotesListResponseItem {
  id: number;
  accountId: number;
  serialNumber: string;
  description: string;
  amount: MoneyWithCurrency;
  creationDate: string;
  type: DebitCreditNoteType;
  pdfStatus: DebitCreditPdfStatus;
  createdBy: {
    id: number;
    email: string;
  };
}

export type DebitCreditNoteType = string & ('DEBIT_BALANCE' | 'CREDIT_BALANCE');

export type DebitCreditPdfStatus = string &
  ('PENDING' | 'GENERATED' | 'NOT_APPLICABLE');

export interface AddCreditNoteRequest {
  description: string;
  amount: number;
}

export type AddDebitNoteResponse = void;

export interface AddDebitNoteRequest {
  description: string;
  amount: number;
}

export type AddCreditNoteResponse = void;

export interface UpdateCustomerAddressRequest {
  address: {
    id: number;
    title: string;
    countryId: number;
    cityId: number;
    areaId: number;
    addressLine1: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    pinnedLocation: {
      type: string;
      coordinates: number[];
    };
  };
}

export interface UpdateCustomerAddressResponse {
  id: number;
  customerId: number;
}

type CustomerAddressStatus = string & ('ACTIVE' | 'INACTIVE');

export type ListBusinessCustomerAddressesRequest = void;

export type ListBusinessCustomerAddressesResponse = {
  id: number;
  title: string;
  country: {
    countryId: number;
    name: MultilingualString;
  };
  city: {
    cityId: number;
    name: MultilingualString;
    countryId: number;
  };
  area: {
    areaId: number;
    name: MultilingualString;
    cityId: number;
  };
  addressLine1: string;
  building: string;
  floor: number;
  apartmentNo: string;
  companyName: string;
  landmark: string;
  status: CustomerAddressStatus;
  pinnedLocation: GeojsonPoint;
}[];

export type GetBusinessCustomerByIdRequest = void;

export interface GetBusinessCustomerByIdResponse {
  id: number;
  name: string;
  mobileNo: string;
  firstName: string;
  lastName: string;
  addresses: [
    {
      id: number;
      title: string;
      countryId: number;
      cityId: number;
      areaId: number;
      addressLine1: string;
      building: string;
      floor: number;
      apartmentNo: string;
      companyName: string;
      landmark: string;
      pinnedLocation: {
        type: string;
        coordinates: [number, number];
      };
      status: string;
    }
  ];
  creationDate: string;
}

export type CustomersListRequest = void;

export interface CustomersListResponse {
  metadata: ListingMetadata;
  customers: [
    {
      id: number;
      mobileNo: string;
      name: string;
      creationDate: string;
    }
  ];
}

export interface UpdateCustomerRequest {
  mobileNo: string;
  name: string;
}

export interface UpdateCustomerResponse {
  id: number;
  mobileNo: string;
  name: string;
  addresses: [
    {
      id: number;
      title: string;
      countryId: number;
      cityId: number;
      areaId: number;
      addressLine1: string;
      building: string;
      floor: number;
      apartmentNo: string;
      companyName: string;
      landmark: string;
      pinnedLocation: {
        type: string;
        coordinates: [number, number];
      };
    }
  ];
  creationDate: string;
}

export type GetConsumerCustomerByIdRequest = void;

export interface GetConsumerCustomerByIdResponse {
  id: number;
  name: string;
  mobileNo: string;
  firstName: string;
  lastName: string;
  addresses: [
    {
      id: number;
      title: string;
      countryId: number;
      cityId: number;
      areaId: number;
      addressLine1: string;
      building: string;
      floor: number;
      apartmentNo: string;
      companyName: string;
      landmark: string;
      pinnedLocation: {
        type: string;
        coordinates: [number, number];
      };
      status: string;
    }
  ];
  ledgerId: number;
  imageId: number;
  email: string;
  birthDate: string;
  gender: string;
  balance: MoneyWithCurrency;
  favoriteVendors: number[];
  deviceToken: string;
  referralCode: {
    id: number;
    name: string;
    status: string;
  };
  creationDate: string;
}

export type ListConsumerCustomerAddressesRequest = void;

export type ListConsumerCustomerAddressesResponse = {
  customerAddress: {
    id: number;
    title: string;
    country: {
      countryId: number;
      name: MultilingualString;
    };
    city: {
      cityId: number;
      name: MultilingualString;
      countryId: number;
    };
    area: {
      areaId: number;
      name: MultilingualString;
      cityId: number;
    };
    addressLine1: string;
    building: string;
    floor: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    status: CustomerAddressStatus;
    pinnedLocation: GeojsonPoint;
  };
  inZone: boolean;
}[];
