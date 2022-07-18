import {
  GeojsonPoint,
  ListingMetadata,
  PilotServiceType,
  PilotStatus,
  TripServiceType,
} from './common';

export type PilotsListV2Request = void;
export interface PilotsListV2Response {
  metadata: ListingMetadata;
  pilots: {
    id: number;
    staffId: number;
    mobileNo: string;
    fullName: string;
    status: PilotStatus;
    dedicatedToHub: boolean;
    serviceTypeList: PilotServiceType[];
    appVersion: string;
    supervisor: boolean;
    reachable: boolean;
    lastKnownLocation: GeojsonPoint;
    active: boolean;
    creationDate: string;
    lastDeliveryDate: string;
    lastKnownLocationDate: string;
  }[];
}

export type LiveOpsPilotsRequest = void;
export interface LiveOpsPilotsResponse {
  areaLevelPilots: {
    id: number;
    ongoingOrdersCount: number;
    queuedOrdersCount: number;
    pilotsCount: number;
    serviceTypeList: PilotServiceType[];
    pilots: {
      id: number;
      fullName: string;
      status: PilotStatus;
      staffId: number;
      serviceTypeList: PilotServiceType[];
      mobileNo: string;
      creationDate: string;
      lastKnownLocationDate: string;
      supervisor: boolean;
      reachable: boolean;
      lastKnownLocation: GeojsonPoint;
      active: boolean;
      ordersCount: number;
      assignedServiceType: TripServiceType;
    }[];
  };
  hubLevelPilots: {
    serviceTypeList: PilotServiceType[];
    hubs: {
      id: number;
      label: string;
      ongoingOrdersCount: number;
      queuedOrdersCount: number;
      pilotsCount: number;
      pilots: {
        id: number;
        fullName: string;
        status: PilotStatus;
        staffId: number;
        mobileNo: string;
        creationDate: string;
        lastKnownLocationDate: string;
        supervisor: boolean;
        reachable: boolean;
        lastKnownLocation: GeojsonPoint;
        active: boolean;
        serviceTypeList: PilotServiceType[];
        ordersCount: number;
        assignedServiceType: TripServiceType;
      }[];
    }[];
  };
}
