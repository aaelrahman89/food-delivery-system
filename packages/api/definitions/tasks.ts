import { ListingMetadata, TaskPaymentMethod, TaskStatus } from './common';

export interface UpdateTaskStatusRequest {
  requestedStatus: TaskStatus;
  taskValue: number;
  vendorTaskId: string;
  customerMobileNo: string;
  paymentMethod: TaskPaymentMethod;
}

export interface UpdateTaskStatusResponse {
  taskStatus: TaskStatus;
}

export type TasksListRequest = void;

export interface TasksListResponse {
  metadata: ListingMetadata;
  tasks: [
    {
      id: number;
      tripId: number;
      pickupId: number;
      pilotId: number;
      pilotName: string;
      status: string;
      dailyClosingStatus: string;
      creationDate: string;
      lastStatusUpdateDate: string;
      lastUpdateDate: string;
      vendorTaskId: string;
      vendorBranchId: number;
      vendorId: number;
      vendorBranchLabel: string;
      customerMobileNo: string;
      durationInSeconds: number;
      distanceInMeters: number;
      estimatedDistanceInMeters: number;
      value: number;
      pinnedDestinationPoint: {
        type: string;
        coordinates: [number, number];
      };
      paymentMethod: string;
      cancellationReason: string;
      notes: string;
      cancellationCategory: string;
      disputeDetails: {
        status: string;
        category: string;
        description: string;
        disputeDate: string;
        reviewerDescription: string;
        reviewerId: number;
        reviewerEmail: string;
        reviewDate: string;
        allowedDisputeCategories: string[];
      };
      type: string;
      customer: {
        id: number;
        addressId: number;
        mobileNo: string;
      };
      linkStatus: string;
      hasComplaint: boolean;
    }
  ];
}
