import {
  AcceptOrderRequest,
  AcceptOrderResponse,
  ConsumerOrderResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderJourneyRequest,
  OrderJourneyResponse,
  OrderRejectionReasonsRequest,
  OrderRejectionReasonsResponse,
  OrderRequest,
  OrderUpdateRequest,
  OrderUpdateResponse,
  RejectOrderRequest,
  RejectOrderResponse,
} from '@survv/api/definitions/orders';
import {
  BranchOrdersRequest,
  BranchOrdersResponse,
} from '@survv/api/definitions/branches';
import { EntityId } from '@survv/commons/core/types';
import {
  FilterSpecElement,
  ListingQuery,
  backendQueryMapper,
  fieldMapper,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { Order, OrderStatus } from '../../../core/models/Order';
import { OrderJourney } from '../../../core/models/OrderJourney';
import { OrdersRepo } from '../../../core/repositories/OrdersRepo';
import {
  RejectionReason,
  RejectionReasonOrderType,
} from '../../../core/models/RejectionReason';
import { RejectionReasonForm } from '../../../core/models/RejectionReasonForm';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { currentDate } from '@survv/commons/core/utils/datetime';
import {
  mapBranchOrdersToOrdersList,
  mapOrderCalculationResponseToOrder,
  mapOrderJourneyResponseToOrderJourney,
  mapOrderRejectionReasonsResponseToRejectionReasons,
  mapOrderResponseToOrder,
} from './mappers/responses';
import {
  mapOrderToOrderCalculationRequest,
  mapOrderToOrderUpdateRequest,
  mapRejectionFormToRejectOrderRequest,
} from './mappers/requests';

const ORDERS_FILTERS_MAP = {
  customerOrderId: (val: string): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'customerOrderId',
      operator: filterOperators.EQUAL,
      value: val,
    }),
  ],
  statuses: (val: string): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'status',
      operator: filterOperators.IN,
      value: val,
    }),
  ],
  scheduled: (val: { from: string; to: string }[]): FilterSpecElement[] => {
    return [
      fieldMapper({
        fieldName: 'scheduledTo.from',
        operator: filterOperators.IN,
        value: val.map((v) => {
          const time = v.from.split(':');
          return (
            (Number(time[0]) * 60 + Number(time[1])) * 60 + Number(time[2])
          );
        }),
      }),
      fieldMapper({
        fieldName: 'scheduledTo.to',
        operator: filterOperators.IN,
        value: val.map((v) => {
          const time = v.to.split(':');
          return (
            (Number(time[0]) * 60 + Number(time[1])) * 60 + Number(time[2])
          );
        }),
      }),
    ];
  },
  totalFrom: (val: number): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'total.amount',
      operator: filterOperators.GTE,
      value: val,
    }),
  ],
  totalTo: (val: number): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'total.amount',
      operator: filterOperators.LTE,
      value: val,
    }),
  ],
  creationDateFrom: (val: string): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'creationDate',
      operator: filterOperators.GTE,
      value: val,
    }),
  ],
  creationDateTo: (val: string): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'creationDate',
      operator: filterOperators.LTE,
      value: val,
    }),
  ],
} as Record<string, (value: unknown) => FilterSpecElement[]>;

const ORDERS_SORT_MAP = {
  customerOrderId: 'customerOrderId',
  total: 'total.amount',
  creationDate: 'creationDate',
};

export class OrdersRepoImpl implements OrdersRepo {
  private readonly _networkService: NetworkService;

  constructor() {
    this._networkService = networkService;
  }

  async acceptOrder(orderId: EntityId): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<AcceptOrderRequest, AcceptOrderResponse>(
      {
        requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
        params: { branchId },
        body: { orderId },
      }
    );
  }

  async rejectOrder(
    orderId: EntityId,
    rejectionForm: RejectionReasonForm
  ): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<RejectOrderRequest, RejectOrderResponse>(
      {
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId },
        body: mapRejectionFormToRejectOrderRequest(orderId, rejectionForm),
      }
    );
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

  async getOrder(orderId: EntityId): Promise<Order> {
    return mapOrderResponseToOrder(
      await this._networkService.request<OrderRequest, ConsumerOrderResponse>({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId },
      })
    );
  }

  async updateOrder(order: Order): Promise<void> {
    await this._networkService.request<OrderUpdateRequest, OrderUpdateResponse>(
      {
        requestLine: 'put /api/v1/orders/:orderId/b2c-order',
        params: { orderId: order.id },
        body: mapOrderToOrderUpdateRequest(order),
      }
    );
  }

  async calculateOrder(order: Order): Promise<Order> {
    return mapOrderCalculationResponseToOrder(
      order,
      await this._networkService.request<
        OrderCalculationRequest,
        OrderCalculationResponse
      >({
        requestLine: 'post /api/v1/orders/:orderId/b2c-order-prices',
        params: { orderId: order.id },
        body: mapOrderToOrderCalculationRequest(order),
      })
    );
  }

  async getPendingOrders(): Promise<ItemsList<Order>> {
    const branchId = await authTokenRepo.getUserId();
    const query = queryMapper({
      filter: {
        status: OrderStatus.REQUESTED.valueOf(),
      },
      filterMap: {
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
      },
      sort: {
        orderId: 'asc',
      },
    });

    return mapBranchOrdersToOrdersList(
      await this._networkService.request<
        BranchOrdersRequest,
        BranchOrdersResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: { query },
      })
    );
  }

  async getScheduledOrders(): Promise<ItemsList<Order>> {
    const branchId = await authTokenRepo.getUserId();
    const now = currentDate().toISOString();
    const query = queryMapper({
      filter: {
        notifyVendorAt: now,
        scheduled: true,
        status: [
          OrderStatus.SCHEDULED.valueOf(),
          OrderStatus.PILOT_REQUESTED.valueOf(),
          OrderStatus.PILOT_ASSIGNED.valueOf(),
        ],
      },
      filterMap: {
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
        orderId: 'asc',
      },
    });

    return mapBranchOrdersToOrdersList(
      await this._networkService.request<
        BranchOrdersRequest,
        BranchOrdersResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: { query },
      })
    );
  }

  async getWorkingOrders(): Promise<ItemsList<Order>> {
    const branchId = await authTokenRepo.getUserId();
    const query = queryMapper({
      filter: {
        status: OrderStatus.CONFIRMED.valueOf(),
      },
      filterMap: {
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
      },
      sort: {
        orderId: 'asc',
      },
    });

    return mapBranchOrdersToOrdersList(
      await this._networkService.request<
        BranchOrdersRequest,
        BranchOrdersResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: { query },
      })
    );
  }

  async listOrders(args: ListingQuery): Promise<ItemsList<Order>> {
    const branchId = await authTokenRepo.getUserId();
    return mapBranchOrdersToOrdersList(
      await this._networkService.request<
        BranchOrdersRequest,
        BranchOrdersResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: {
          query: backendQueryMapper({
            ...args,
            filterMap: ORDERS_FILTERS_MAP,
            sortMap: ORDERS_SORT_MAP,
          }),
        },
      })
    );
  }
}
