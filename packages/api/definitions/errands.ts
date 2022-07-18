import {
  CreatedByUser,
  CustomerAddress,
  GeojsonPoint,
  GeojsonPolygon,
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
} from './common';
import { OrderPaymentMethod, OrderType } from './orders';

export type ErrandCategoriesListRequest = void;
export interface ErrandCategoriesListResponse {
  metadata: ListingMetadata;
  categories: ErrandCategory[];
}

export interface ErrandCategoryCreationRequest {
  displayName: MultilingualString;
  avgPreparationTime: number;
  status: ErrandCategoryStatus;
}
export interface ErrandCategoryCreationResponse {
  id: number;
  creationDate: string;
}

export interface ErrandCategoryUpdatingRequest {
  displayName: MultilingualString;
  avgPreparationTime: number;
  status: ErrandCategoryStatus;
}
export type ErrandCategoryUpdatingResponse = void;

export type ErrandCategoryArchiveRequest = void;
export type ErrandCategoryArchiveResponse = void;

export type ErrandOrderRequest = void;
export interface ErrandOrderResponse {
  orderId: number;
  customer: {
    id: number;
    name: string;
    mobileNo: string;
  };
  address: CustomerAddress;
  customerOrderId: string;
  creationDate: string;
  status: ErrandOrderStatus;
  type: OrderType;
  subTotal: MoneyWithCurrency;
  tax: MoneyWithCurrency;
  total: MoneyWithCurrency;
  totalDueAmount: MoneyWithCurrency;
  balanceImpact: MoneyWithCurrency;
  estimatedDeliveryFees: MoneyWithCurrency;
  deliveryFees: MoneyWithCurrency;
  deliveryFeesTax: MoneyWithCurrency;
  paymentMethod: OrderPaymentMethod;
  orderReceipts: {
    id: number;
    signedUrl: string;
  }[];
  orderPickups: {
    pickupId: number;
    pickupStatus: ErrandOrderPickupStatus;
    categoryDisplayName: MultilingualString;
    categoryId: number;
    location: {
      description: string;
      point: GeojsonPoint;
    };
    description: string;
    uploadedImages: {
      id: number;
      signedUrl: string;
    }[];
    voiceNote: {
      id: number;
      signedUrl: string;
    };
    includePictures: boolean;
    includeVoiceNote: boolean;
    items: {
      name: string;
      brand: string;
      quantity: string;
      notes: string;
    }[];
    deleted: boolean;
  }[];
  rated: boolean;
  maxErrandPoints: number;
}

export type ErrandsOrderJourneyRequest = void;
export interface ErrandsOrderJourneyResponse {
  orderId: number;
  timelineJourney: ErrandsOrderTimeLineJourneyStop[];
}

export interface ErrandOrderStructureRequest {
  pickups: {
    id: number;
    categoryId: number;
    locationDescription: string;
    locationCoordinates: GeojsonPoint;
    includeImages: boolean;
    includeVoiceNote: boolean;
    items: {
      name: string;
      brand: string;
      quantity: string;
      notes: string;
    }[];
  }[];
  zoneName: string;
}
export type ErrandOrderStructureResponse = void;

export interface ErrandOrderEditRequest {
  pickups: {
    id: number;
    categoryId: number;
    locationDescription: string;
    locationCoordinates: GeojsonPoint;
    includeImages: boolean;
    includeVoiceNote: boolean;
    items: {
      name: string;
      brand: string;
      quantity: string;
      notes: string;
    }[];
  }[];
  zoneName: string;
}
export type ErrandOrderEditResponse = void;

export interface ErrandOrderCalculateRequest {
  pickups: {
    id: number;
    locationCoordinates: GeojsonPoint;
    categoryId: number;
  }[];
}
export interface ErrandOrderCalculateResponse {
  estimatedDeliveryFee: MoneyWithCurrency;
  tax: MoneyWithCurrency;
}

export type CoveredZonesRequest = void;
export interface CoveredZonesResponse {
  coveredZones: {
    zoneId: number;
    name: MultilingualString;
    polygon: GeojsonPolygon;
  }[];
}

export type DetectZoneRequest = void;
export interface DetectZoneResponse {
  zoneId: number;
  name: MultilingualString;
  area: {
    areaId: number;
    name: MultilingualString;
    cityId: number;
    countryId: number;
  };
  polygon: GeojsonPolygon;
  servedServices: {
    id: number;
    category: string;
    type: string;
    name: MultilingualString;
  }[];
}

interface ErrandCategory {
  id: number;
  displayName: MultilingualString;
  avgPreparationTime: number;
  createdBy: CreatedByUser;
  lastUpdateDate: string;
  status: ErrandCategoryStatus;
}
interface ErrandsOrderTimeLineJourneyStop {
  journeyStopStatus: ErrandsOrderJourneyStopStatus;
  durationInSeconds: number;
  stopDateTime: string;
  actionBy: ActionBy;
  linkedEntity: LinkedEntity;
  data: Record<string, unknown>;
}
interface ActionBy {
  id?: number;
  email?: string;
}
interface LinkedEntity {
  entityId?: number;
  entityName?: string;
}
export type ErrandCategoryStatus = string & ('VISIBLE' | 'HIDDEN' | 'NONE');
export type ErrandOrderStatus = string &
  (
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'PILOT_REQUESTED'
    | 'PILOT_ASSIGNED'
    | 'COLLECTED'
    | 'DELIVERED'
    | 'CANCELLED'
  );

export type ErrandOrderPickupStatus = string &
  ('REQUESTED' | 'COLLECTING' | 'COLLECTED' | 'DELIVERED' | 'DELETED');

export type ErrandsOrderJourneyStopStatus = string &
  (
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'PILOT_REQUESTED'
    | 'PILOT_ASSIGNED'
    | 'COLLECTED'
    | 'DELIVERED'
    | 'PICKUP'
  );

export interface ErrandOrderRejectRequest {
  rejectionReasonId: number;
}
export type ErrandOrderRejectResponse = void;

interface ErrandCategory {
  id: number;
  displayName: MultilingualString;
  avgPreparationTime: number;
  createdBy: CreatedByUser;
  lastUpdateDate: string;
  status: ErrandCategoryStatus;
}

export interface CancelErrandOrderRequest {
  cancellationReasonId: number;
  requestRefund: boolean;
}

export type CancelErrandOrderResponse = void;
