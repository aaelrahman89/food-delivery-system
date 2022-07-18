export interface ListingMetadata {
  skipped: number;
  limit: number;
  totalCount: number;
  totalReturned: number;
}

export interface MultilingualString {
  en: string;
  ar: string;
}

export interface OrderingHours {
  from: string;
  to: string;
}

export interface MoneyWithCurrency {
  amount: number;
  currency: string;
}

export interface CreatedByUser {
  id: number;
  email: string;
}

export type ZoneBasedRateName = string &
  ('rate1' | 'rate2' | 'rate3' | 'rate4' | 'outOfZone');

export interface GeojsonPolygon {
  type: 'Polygon';
  coordinates: GeojsonCoordinates[][];
}

export interface GeojsonLineString {
  type: 'LineString';
  coordinates: GeojsonCoordinates[];
}

export interface GeojsonPoint {
  type: 'Point';
  coordinates: GeojsonCoordinates;
}

export interface GeojsonFeature {
  type: 'Feature';
  geometry: GeojsonPoint | GeojsonLineString | GeojsonPolygon;
  properties: JSON;
}

export interface GeojsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeojsonFeature[];
}

export type GeojsonCoordinates = number[];

export type JSON =
  | null
  | boolean
  | number
  | string
  | undefined
  | JSON[]
  | { [prop: string]: JSON };

export interface CustomerAddress {
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
  street?: string;
  landmark: string;
  pinnedLocation: GeojsonPoint;
}

export type EmptyRequestObject = Record<string, unknown>;

export type VendorType = string &
  ('FOOD' | 'PHARMACY' | 'PETS' | 'GROCERIES' | 'C2C' | 'SURVV_SHOP');

export type PilotStatus = string &
  (
    | 'UNAVAILABLE'
    | 'AVAILABLE'
    | 'LOADED'
    | 'IN_HUB'
    | 'ASSIGNED'
    | 'CANDIDATE'
    | 'WAITING'
    | 'COLLECTING'
    | 'NONE'
  );

export type PilotServiceType = string & ('B2B' | 'B2C' | 'C2C' | 'NONE');

export type TripStatus = string &
  ('PENDING' | 'REQUESTED' | 'OPENED' | 'CLOSED' | 'ASSIGNED' | 'CANCELLED');

export type SlaTier = string &
  (
    | 'LESS_THAN_5_MINUTES'
    | 'LESS_THAN_10_MINUTES'
    | 'LESS_THAN_15_MINUTES'
    | 'LESS_THAN_20_MINUTES'
    | 'MORE_THAN_20_MINUTES'
  );

export type ComplaintCategory = string &
  (
    | 'PILOT_AVAILABILITY'
    | 'WRONG_PROCESS'
    | 'LATE_DELIVERY'
    | 'ATTITUDE'
    | 'PILOT_ABUSE'
    | 'MISSING_ITEMS'
    | 'CHANGE'
    | 'PACKING'
    | 'VISA'
    | 'WRONG_ORDER'
    | 'VENDOR'
    | 'APPEARANCE'
    | 'SYSTEM_ISSUE'
    | 'WRONG_REQUEST'
    | 'CANCELLING_ORDER'
    | 'CANCELLING_ORDER_PAID'
    | 'WRONG_PAYMENT'
    | 'NONE'
  );

export type TaskStatus = string &
  (
    | 'COLLECTED'
    | 'DELIVERED'
    | 'UNKNOWN'
    | 'CANCELED'
    | 'REACHED'
    | 'ASSIGNED'
    | 'REQUESTED'
    | 'NOT_FULFILLED'
    | 'PENDING'
    | 'RETURNED'
    | 'RECALLED'
    | 'CANCELLED_PAID'
    | 'PENDING_COLLECTION'
    | 'ON_DELIVERY'
  );

export type TaskPaymentMethod = string &
  ('Cash' | 'Credit' | 'None' | 'Already_Paid');

export type CompensationType = string & ('NONE' | 'CUSTOM' | 'FULL');

export type TripServiceType = string & ('B2B' | 'B2C' | 'C2C' | 'NONE');

export type VendorPosIntegrationType = string & ('LINETEN' | 'NONE');
