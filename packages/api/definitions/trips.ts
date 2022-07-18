import {
  GeojsonPoint,
  ListingMetadata,
  MultilingualString,
  PilotStatus,
  SlaTier,
  TripStatus,
} from './common';

export type TripsRequest = void;

export interface TripsResponse {
  metadata: ListingMetadata;
  trips: TripsItem[];
}

export interface CancelTripRequest {
  branchId: number;
  cancellationReason: string;
}
export interface CancelTripResponse {
  tripStatus: TripStatus;
}

export interface UpdateTripTasksCountRequest {
  tripTasksCount: number;
}

export interface UpdateTripTasksCountResponse {
  id: number;
  tripTasksCount: number;
}

export interface TripsItem {
  id: number;
  orderId: number;
  vendorBranch: {
    id: number;
    label: string;
    vendorId: number;
  };
  pilot: {
    id: number;
    mobileNo: string;
    fullName: string;
    lastKnownLocation: GeojsonPoint;
    status: PilotStatus;
  };
  tasks: TripsItemTask[];
  status: TripStatus;
  assignmentDate: string;
  pendingCollectionDate: string;
  creationDate: string;
  eta: number;
  slaTier: SlaTier;
  maxAllowedTasksCount: number;
  requestedTasksCount: number;
  hasOnlineOrder: boolean;
}

interface TripsItemTask {
  taskId: number;
  branchSelectedZoneName: MultilingualString;
}
