import {
  CancelTripResponse,
  TripsResponse,
  UpdateTripTasksCountResponse,
} from '../definitions/trips';

export function tripsResponseStub(): TripsResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    trips: [
      {
        id: 9921381276774878,
        orderId: 9921381276774878,
        vendorBranch: {
          id: 2165529378315486700,
          label: 'McDonald Manial',
          vendorId: 2165529378315486700,
        },
        pilot: {
          id: 2165529378315486700,
          mobileNo: '0102312381',
          fullName: 'Bakaka Dassa',
          lastKnownLocation: {
            type: 'Point',
            coordinates: [-1.43, 31.3],
          },
          status: 'UNAVAILABLE',
        },
        status: 'CANCELLED',
        assignmentDate: '2018-09-01T18:04:53.178Z',
        pendingCollectionDate: '2018-09-01T18:04:53.178Z',
        tasks: [
          {
            taskId: 123654789,
            branchSelectedZoneName: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
          },
        ],
        creationDate: '2018-09-01T18:04:53.178Z',
        eta: 600,
        slaTier: 'LESS_THAN_5_MINUTES',
        maxAllowedTasksCount: 4,
        requestedTasksCount: 4,
        hasOnlineOrder: false,
      },
    ],
  };
}

export function updateTripTasksCountResponseStub(): UpdateTripTasksCountResponse {
  return {
    id: 21655293,
    tripTasksCount: 3,
  };
}

export function cancelTripResponseStub(): CancelTripResponse {
  return {
    tripStatus: 'CANCELLED',
  };
}
