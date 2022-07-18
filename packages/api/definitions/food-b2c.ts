import {
  GeojsonPolygon,
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
  ZoneBasedRateName,
} from './common';

export interface FoodB2CZoneRatingPolicyCreationRequest {
  name: string;
  rates: {
    rate1: MoneyWithCurrency;
    rate2: MoneyWithCurrency;
    rate3: MoneyWithCurrency;
    rate4: MoneyWithCurrency;
    outOfZone: MoneyWithCurrency;
  };
}

export interface FoodB2CZoneRatingPolicyCreationResponse {
  id: number;
  creationDate: string;
}

export interface FoodB2CZoneRatingPoliciesListResponse {
  metadata: ListingMetadata;
  policies: FoodB2CZoneRatingPolicy[];
}

export type FoodB2CZoneRatingPoliciesRequest = void;

export interface FoodB2CHubZoneRatesResponse {
  metadata: ListingMetadata;
  hubZonesRates: FoodB2CHubZoneRate[];
}

export interface FoodB2CZoneAssignmentRequest {
  hubId: number;
  ratingPolicyId: string;
  assignments: ZoneRateAssignment[];
}

export interface ZoneRateAssignment {
  zoneName: string;
  rateName: ZoneBasedRateName;
}

export type FoodB2CZoneAssignmentResponse = void;

export interface FoodB2CZoneUnassignmentRequest {
  hubId: number;
  zoneNames: string[];
}

export type FoodB2CZoneUnssignmentResponse = void;

export interface FoodB2CHubZoneRate {
  hubId: number;
  zoneId: number;
  zoneName: MultilingualString;
  polygon: GeojsonPolygon;
  ratingPolicyId: number;
  rateName: ZoneBasedRateName;
}

export interface FoodB2CZoneRatingPolicy {
  id: number;
  name: string;
  rates: {
    rate1: MoneyWithCurrency;
    rate2: MoneyWithCurrency;
    rate3: MoneyWithCurrency;
    rate4: MoneyWithCurrency;
    outOfZone: MoneyWithCurrency;
  };
}
