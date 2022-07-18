import {
  TasksListResponse,
  UpdateTaskStatusResponse,
} from '../definitions/tasks';

export function updateTaskStatusResponseStub(): UpdateTaskStatusResponse {
  return {
    taskStatus: 'ASSIGNED',
  };
}

export function listTasksResponseStub(): TasksListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    tasks: [
      {
        id: 2165529378315486700,
        tripId: 2165529378315486700,
        pickupId: 2165529378315486700,
        pilotId: 2165529378315486700,
        pilotName: 'Name',
        status: 'REACHED',
        dailyClosingStatus: 'CLOSED',
        creationDate: '2018-09-01T18:04:53.178Z',
        lastStatusUpdateDate: '2018-09-05T19:04:53.178Z',
        lastUpdateDate: '2018-09-05T19:04:53.178Z',
        vendorTaskId: '2165529378315486654',
        vendorBranchId: 2165529378315486700,
        vendorId: 2165529378315486700,
        vendorBranchLabel: 'label',
        customerMobileNo: '01069262360',
        durationInSeconds: 90,
        distanceInMeters: 3350,
        estimatedDistanceInMeters: 3350,
        value: 12.5,
        pinnedDestinationPoint: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
        paymentMethod: 'Cash',
        cancellationReason: 'AnyReason',
        notes: 'Cancel Note',
        cancellationCategory: 'QUICK_CANCELLATION',
        disputeDetails: {
          status: '_01_PENDING_REVIEW',
          category: 'ZONE',
          description: 'I want tmy money back',
          disputeDate: '2018-09-05T19:04:53.178Z',
          reviewerDescription: 'No money for you',
          reviewerId: 123654789,
          reviewerEmail: 'example@domain.com',
          reviewDate: '2018-09-05T19:04:53.178Z',
          allowedDisputeCategories: ['ZONE'],
        },
        type: 'B2C',
        customer: {
          id: 2165529378315486700,
          addressId: 2165529378315486700,
          mobileNo: '01061239214',
        },
        linkStatus: 'UNDECIDED',
        hasComplaint: false,
      },
    ],
  };
}
