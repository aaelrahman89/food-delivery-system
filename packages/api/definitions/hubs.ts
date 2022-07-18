import {
  GeojsonPolygon,
  ListingMetadata,
  MultilingualString,
  ZoneBasedRateName,
} from './common';

export interface HubZonesAssignmentRequest {
  assignments: ZoneRateAssignment[];
}

export interface ZoneRateAssignment {
  zoneName: string;
  rateName: ZoneBasedRateName;
}

export type HubZoneAssignmentResponse = void;

export interface HubZonesUnassignmentRequest {
  zones: string[];
}
export type HubZonesUnassignmentResponse = void;

export type HubZoneRatesRequest = void;

export type HubZoneRatesResponse = HubZoneRate[];

export interface HubZoneRate {
  areaZone: {
    zoneId: number;
    name: MultilingualString;
    polygon: GeojsonPolygon;
  };
  rateName: ZoneBasedRateName;
}

export interface C2CBrandCreationRequest {
  name: MultilingualString;
}

export interface C2CBrandCreationResponse {
  id: number;
}

export type HubProfileRequest = void;

export interface HubProfileResponse {
  id: number;
  label: string;
  status: string;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartment: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  maxTasksPerTrip: number;
  ratingPolicyId: number;
  rates: {
    rate1: {
      amount: number;
      currency: string;
    };
    rate2: {
      amount: number;
      currency: string;
    };
    rate3: {
      amount: number;
      currency: string;
    };
    rate4: {
      amount: number;
      currency: string;
    };
    outOfZone: {
      amount: number;
      currency: string;
    };
  };
  c2cBrands: [
    {
      id: number;
      name: MultilingualString;
      creationDate: string;
    }
  ];
}

export interface AssignErrandsZonesRequest {
  hubId: number;
  zones: string[];
}

export type AssignErrandsZonesResponse = void;

export interface UnAssignErrandsZonesRequest {
  hubId: number;
  zones: string[];
}

export type UnAssignErrandsZonesResponse = void;

export type HubsListV2Request = void;
export interface HubsListV2Response {
  metadata: ListingMetadata;
  hubs: {
    id: number;
    label: string;
    status: HubStatus;
    maxTasksPerTrip: number;
    address: {
      countryId: number;
      cityId: number;
      areaId: number;
      street: string;
      building: string;
      floor: number;
      apartment: number;
      apartmentNo: string;
      companyName: string;
      landmark: string;
      geoLocation: {
        latitude: number;
        longitude: number;
      };
    };
  }[];
}

type HubStatus = string & ('ACTIVE' | 'INACTIVE');

export interface HubsListV1Response {
  metadata: ListingMetadata;
  hubs: HubsDetailsV1Response[];
}

export interface HubsDetailsV1Response {
  id: number;
  label: string;
  status: HubStatus;
  maxTasksPerTrip: number;
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    floor: number;
    apartment: number;
    apartmentNo: string;
    companyName: string;
    landmark: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
}
