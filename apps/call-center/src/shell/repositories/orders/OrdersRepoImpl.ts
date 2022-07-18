import {
  AssignOrderRequest,
  AssignOrderResponse,
  CallCenterAcceptOrderRequest,
  CallCenterAcceptOrderResponse,
  CallCenterRejectOrderRequest,
  CallCenterRejectOrderResponse,
  ConsumerOrderRequest,
  ConsumerOrderResponse,
  OrderJourneyRequest,
  OrderJourneyResponse,
  OrderRejectionReasonsRequest,
  OrderRejectionReasonsResponse,
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { Order, OrderStatus } from '../../../core/models/Order';
import { OrderJourney } from '../../../core/models/OrderJourney';
import { OrdersRepo } from '../../../core/repositories/OrdersRepo';
import { RejectOrderFormArgs } from '../../../core/blocs/agent/AgentOrderDetailsMessage';
import {
  RejectionReason,
  RejectionReasonOrderType,
} from '../../../core/models/RejectionReason';
import { currentDate } from '@survv/commons/core/utils/datetime';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import {
  mapOrderJourneyResponseToOrderJourney,
  mapOrderRejectionReasonsResponseToRejectionReasons,
  mapOrderResponseToOrder,
  mapOrdersListV2ResponseToOrders,
} from './mappers/responses';
import { mapRejectionFormToRejectOrderRequest } from './mappers/requests';

export class OrdersRepoImpl implements OrdersRepo {
  private readonly _networkService: NetworkService;

  constructor() {
    this._networkService = networkService;
  }

  async getOrder(orderId: EntityId): Promise<Order> {
    return mapOrderResponseToOrder(
      await this._networkService.request<
        ConsumerOrderRequest,
        ConsumerOrderResponse
      >({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId },
      })
    );
  }

  async getOrderJourney(orderId: EntityId): Promise<OrderJourney> {
    return mapOrderJourneyResponseToOrderJourney(
      await this._networkService.request<
        OrderJourneyRequest,
        OrderJourneyResponse
      >({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
    );
  }

  async listOrders(query?: ListingQuery): Promise<ItemsList<Order>> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const beQuery = queryMapper({
      ...query,
      filter: {
        ...query?.filter,
        vendorId,
      },
      filterMap: {
        vendorId: {
          fieldName: 'pickups.vendorId',
          operator: filterOperators.EQUAL,
        },
        branchIds: {
          fieldName: 'pickups.branchId',
          operator: filterOperators.IN,
        },
        statuses: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        customerOrderId: {
          fieldName: 'customerOrderId',
          operator: filterOperators.REGEX,
        },
        vendorOrderId: {
          fieldName: 'pickups.vendorOrderId',
          operator: filterOperators.REGEX,
        },
        agent: {
          fieldName: 'assignedAgent.email',
          operator: filterOperators.REGEX,
        },
        from: {
          fieldName: 'creationDate',
          operator: filterOperators.GTE,
        },
        to: {
          fieldName: 'creationDate',
          operator: filterOperators.LTE,
        },
      },
    });

    return mapOrdersListV2ResponseToOrders(
      await this._networkService.request<
        OrdersListV2Request,
        OrdersListV2Response
      >({
        requestLine: 'get /api/v1.1/orders',
        query: { query: beQuery },
      })
    );
  }

  async listAgentQueuedOrders(): Promise<ItemsList<Order>> {
    const userId = Number(await kvStorage.getItem('user-id'));
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const query = queryMapper({
      filter: {
        vendorId,
        status: OrderStatus.REQUESTED.valueOf(),
        assignedAgent: [0, userId],
      },
      filterMap: {
        vendorId: {
          fieldName: 'pickups.vendorId',
          operator: filterOperators.EQUAL,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
        assignedAgent: {
          fieldName: 'assignedAgent.id',
          operator: filterOperators.IN,
        },
      },
      sort: {
        creationDate: 'asc',
      },
    });

    return mapOrdersListV2ResponseToOrders(
      await this._networkService.request<
        OrdersListV2Request,
        OrdersListV2Response
      >({
        requestLine: 'get /api/v1.1/orders',
        query: { query },
      })
    );
  }

  async listSupervisorQueuedOrders(): Promise<ItemsList<Order>> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const query = queryMapper({
      filter: {
        vendorId,
        status: OrderStatus.REQUESTED.valueOf(),
      },
      filterMap: {
        vendorId: {
          fieldName: 'pickups.vendorId',
          operator: filterOperators.EQUAL,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
      },
      sort: {
        creationDate: 'asc',
      },
    });

    return mapOrdersListV2ResponseToOrders(
      await this._networkService.request<
        OrdersListV2Request,
        OrdersListV2Response
      >({
        requestLine: 'get /api/v1.1/orders',
        query: { query },
      })
    );
  }

  async listWorkingOrders(): Promise<ItemsList<Order>> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const query = queryMapper({
      filter: {
        vendorId,
        status: [
          OrderStatus.CONFIRMED.valueOf(),
          OrderStatus.PILOT_REQUESTED.valueOf(),
          OrderStatus.PILOT_ASSIGNED.valueOf(),
          OrderStatus.COLLECTED.valueOf(),
        ],
      },
      filterMap: {
        vendorId: {
          fieldName: 'pickups.vendorId',
          operator: filterOperators.EQUAL,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
      },
      sort: {
        creationDate: 'asc',
      },
    });

    return mapOrdersListV2ResponseToOrders(
      await this._networkService.request<
        OrdersListV2Request,
        OrdersListV2Response
      >({
        requestLine: 'get /api/v1.1/orders',
        query: { query },
      })
    );
  }

  async listScheduledOrders(): Promise<ItemsList<Order>> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const now = currentDate().toISOString();
    const query = queryMapper({
      filter: {
        vendorId,
        notifyVendorAt: now,
        scheduled: true,
        status: [
          OrderStatus.SCHEDULED.valueOf(),
          OrderStatus.PILOT_REQUESTED.valueOf(),
          OrderStatus.PILOT_ASSIGNED.valueOf(),
        ],
      },
      filterMap: {
        vendorId: {
          fieldName: 'pickups.vendorId',
          operator: filterOperators.EQUAL,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        scheduled: {
          fieldName: 'scheduled',
          operator: filterOperators.EQUAL,
        },
        notifyVendorAt: {
          fieldName: 'notifyVendorAt',
          operator: filterOperators.LTE,
        },
      },
      sort: {
        creationDate: 'asc',
      },
    });

    return mapOrdersListV2ResponseToOrders(
      await this._networkService.request<
        OrdersListV2Request,
        OrdersListV2Response
      >({
        requestLine: 'get /api/v1.1/orders',
        query: { query },
      })
    );
  }

  async acceptOrder(
    branchId: EntityId,
    orderId: EntityId,
    vendorOrderId: string
  ): Promise<void> {
    await this._networkService.request<
      CallCenterAcceptOrderRequest,
      CallCenterAcceptOrderResponse
    >({
      requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
      params: { branchId },
      body: {
        orderId,
        vendorOrderId,
      },
    });
  }

  async rejectOrder(
    orderId: EntityId,
    branchId: EntityId,
    rejectionForm: RejectOrderFormArgs
  ): Promise<void> {
    await this._networkService.request<
      CallCenterRejectOrderRequest,
      CallCenterRejectOrderResponse
    >({
      requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
      params: { branchId },
      body: mapRejectionFormToRejectOrderRequest(orderId, rejectionForm),
    });
  }

  async getRejectionReasons(): Promise<RejectionReason[]> {
    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
    });
    return mapOrderRejectionReasonsResponseToRejectionReasons(
      await this._networkService.request<
        OrderRejectionReasonsRequest,
        OrderRejectionReasonsResponse
      >({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: { query: beQuery },
      })
    );
  }

  async assignOrder(orderId: EntityId): Promise<void> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));

    await this._networkService.request<AssignOrderRequest, AssignOrderResponse>(
      {
        requestLine: 'post /consumer/api/v1/vendors/:vendorId/assign-order',
        params: { vendorId },
        body: {
          orderId,
        },
      }
    );
  }
}
