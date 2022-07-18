import {
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
} from './common';

export type CityAreasListV2Request = void;
export type CityAreasListV2Response = {
  areaId: number;
  name: MultilingualString;
  cityId: number;
  dispatchingConfigurationList: {
    serviceType: DispatchingServiceType;
    level: DispatchingServiceLevel;
    maxDistanceInKm: number;
    stackingRadiusInKm: number;
  }[];
}[];

export type AreasListV2Request = void;
export interface AreasListV2Response {
  metadata: ListingMetadata;
  areas: {
    areaId: number;
    name: MultilingualString;
    cityId: number;
    cityName: MultilingualString;
    dispatchingConfigurationList: {
      serviceType: DispatchingServiceType;
      level: DispatchingServiceLevel;
      maxDistanceInKm: number;
      stackingRadiusInKm: number;
    }[];
    c2CPricingConfiguration: {
      distanceScaleInMeters: number;
      distanceScalePrice: MoneyWithCurrency;
      durationScaleInMinutes: number;
      durationScalePrice: MoneyWithCurrency;
      startingFee: MoneyWithCurrency;
      minimumTripFare: MoneyWithCurrency;
      surgeCharge: number;
    };
  }[];
}

export type AreasC2CServiceConfigRequest = void;
export interface AreasC2CServiceConfigResponse {
  metadata: ListingMetadata;
  areas: {
    areaId: number;
    areaName: MultilingualString;
    cityId: number;
    cityName: MultilingualString;
    pricingConfig: {
      distanceScaleInMeters: number;
      distanceScalePrice: MoneyWithCurrency;
      durationScaleInMinutes: number;
      durationScalePrice: MoneyWithCurrency;
      startingFee: MoneyWithCurrency;
      minimumTripFare: MoneyWithCurrency;
      surgeCharge: number;
    };
    workingHours: {
      from: string;
      to: string;
    }[];
    maxErrandPoints: number;
    twentyFourHours: boolean;
  }[];
}

export type AreaDetailsV2Request = void;
export interface AreasDetailsV2Response {
  areaId: number;
  cityId: number;
  cityName: MultilingualString;
  name: MultilingualString;
  dispatchingConfigurationList: {
    serviceType: DispatchingServiceType;
    level: DispatchingServiceLevel;
    maxDistanceInKm: number;
    stackingRadiusInKm: number;
  }[];
  c2CPricingConfiguration: {
    distanceScaleInMeters: number;
    distanceScalePrice: MoneyWithCurrency;
    durationScaleInMinutes: number;
    durationScalePrice: MoneyWithCurrency;
    startingFee: MoneyWithCurrency;
    minimumTripFare: MoneyWithCurrency;
    surgeCharge: number;
  };
}

export interface UpdateAreaDispatchRequest {
  dispatchingConfigurationList: {
    serviceType: DispatchingServiceType;
    level: DispatchingServiceLevel;
    maxDistanceInKm: number;
    stackingRadiusInKm: number;
  }[];
}

export type UpdateAreaDispatchResponse = Record<string, unknown>;

export type DispatchingServiceType = string & ('B2C' | 'B2B' | 'C2C');
export type DispatchingServiceLevel = string & ('HUB' | 'AREA');

export interface C2CPricingConfigurationRequest {
  areaIds: number[];
  areaC2CPricingConfig: {
    distanceScaleInMeters: number;
    distanceScalePrice: number;
    durationScaleInMinutes: number;
    durationScalePrice: number;
    startingFee: number;
    minimumTripFare: number;
    surgeCharge: number;
  };
  areaC2CWorkingHours: {
    from: string;
    to: string;
  }[];
  twentyFourHours: boolean;
  maxErrandPoints: number;
}

export type C2CPricingConfigurationResponse = void;

export type AreaListRequest = void;
export interface AreaListResponse {
  metadata: ListingMetadata;
  areas: {
    areaId: number;
    cityId: number;
    name: MultilingualString;
    cityName: MultilingualString;
  }[];
}
