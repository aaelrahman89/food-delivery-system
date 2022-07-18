import {
  LiveOpsPilotsResponse,
  PilotsListV2Response,
} from '../definitions/pilots';

export function pilotsListV2ResponseStub(): PilotsListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    pilots: [
      {
        id: 2165529378315486700,
        staffId: 4521,
        mobileNo: '01112345678',
        fullName: 'Virgin Gates',
        appVersion: '1.0',
        status: 'UNAVAILABLE',
        lastKnownLocationDate: '2018-09-05T19:04:53.178Z',
        creationDate: '2018-09-05T19:04:53.178Z',
        lastDeliveryDate: '2018-09-05T19:04:53.178Z',
        lastKnownLocation: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
        supervisor: false,
        reachable: false,
        active: false,
        dedicatedToHub: false,
        serviceTypeList: ['C2C'],
      },
    ],
  };
}

export function liveOpsPilotsResponseStub(): LiveOpsPilotsResponse {
  return {
    areaLevelPilots: {
      id: 2165529378315486700,
      ongoingOrdersCount: 10,
      queuedOrdersCount: 10,
      pilotsCount: 10,
      pilots: [
        {
          id: 2165529378315486700,
          fullName: 'Virgin Gates',
          status: 'UNAVAILABLE',
          staffId: 4521,
          mobileNo: '01112345678',
          creationDate: '2018-09-05T19:04:53.178Z',
          lastKnownLocationDate: '2018-09-05T19:04:53.178Z',
          supervisor: false,
          reachable: false,
          lastKnownLocation: {
            type: 'Point',
            coordinates: [-1.43, 31.3],
          },
          ordersCount: 5,
          active: false,
          serviceTypeList: ['C2C'],
          assignedServiceType: 'B2B',
        },
      ],
      serviceTypeList: ['C2C'],
    },
    hubLevelPilots: {
      serviceTypeList: ['C2C'],
      hubs: [
        {
          id: 2165529378315486700,
          label: 'downtown',
          ongoingOrdersCount: 10,
          queuedOrdersCount: 10,
          pilotsCount: 10,
          pilots: [
            {
              id: 2165529378315486700,
              fullName: 'Virgin Gates',
              ordersCount: 10,
              status: 'UNAVAILABLE',
              staffId: 4521,
              mobileNo: '01112345678',
              creationDate: '2018-09-05T19:04:53.178Z',
              lastKnownLocationDate: '2018-09-05T19:04:53.178Z',
              supervisor: false,
              reachable: false,
              lastKnownLocation: {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
              active: false,
              serviceTypeList: ['C2C'],
              assignedServiceType: 'B2C',
            },
          ],
        },
      ],
    },
  };
}
