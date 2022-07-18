import { BranchB2CStatus } from '@survv/api/definitions/branches';
import {
  CancelOrderRequest,
  CancelOrderResponse,
  ConsumerOrderRequest,
  ConsumerOrderResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderJourneyRequest,
  OrderJourneyResponse,
  OrderRejectionReasonsRequest,
  OrderRejectionReasonsResponse,
  OrderStatus,
  OrderUpdateRequest,
  OrderUpdateResponse,
  OrdersListV2Request,
  OrdersListV2Response,
  QueuedOrdersCountsRequest,
  QueuedOrdersCountsResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '@survv/api/definitions/orders';
import {
  CancellationReason,
  CancellationReasonsOrderType,
} from '../../../core/models/OrderCancellationReasons';
import {
  CancellationReasonsListV2Request,
  CancellationReasonsListV2Response,
} from '@survv/api/definitions/cancellation-reasons';
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
import { Order, QueuedOrdersCounts } from '../../../core/models/Order';
import { OrderJourney } from '../../../core/models/OrderJourney';
import {
  OrdersRepo,
  UpdateOrderStatusParams,
} from '../../../core/repositories/OrdersRepo';
import { RejectionReason } from '../../../core/models/RejectionReason';
import { actionAuthTokenRepo } from '@survv/commons/shell/repositories/ActionAuthTokenRepoImpl';
import {
  mapCancellationReasonsListV2ResponseToCancellationReasons,
  mapOrderCalculationResponseToOrder,
  mapOrderJourneyResponseToOrderJourney,
  mapOrderRejectionReasonsResponseToRejectionReasons,
  mapOrderResponseToOrder,
  mapOrderToOrderCalculationRequest,
  mapOrderToOrderUpdateRequest,
  mapOrdersListV2ResponseToOrders,
  mapQueuedOrdersCountsResponseToQueuedOrdersCounts,
} from './mappers/responses';

export class OrdersRepoImpl implements OrdersRepo {
  private readonly _networkService: NetworkService;
  private readonly _actionAuthTokenRepo = actionAuthTokenRepo;

  constructor() {
    this._networkService = networkService;
  }

  async listOrders(query?: ListingQuery): Promise<ItemsList<Order>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        branchId: {
          fieldName: 'pickups.branchId',
          operator: filterOperators.EQUAL,
        },
        branchIds: {
          fieldName: 'pickups.branchId',
          operator: filterOperators.IN,
        },
        customerId: {
          fieldName: 'customerId',
          operator: filterOperators.EQUAL,
        },
        scheduledTo: {
          fieldName: 'scheduledTo',
          operator: filterOperators.IN,
        },
        statuses: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
        types: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        type: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        customerMobileNo: {
          fieldName: 'customerMobileNo',
          operator: filterOperators.EQUAL,
        },
        customerOrderId: {
          fieldName: 'customerOrderId',
          operator: filterOperators.EQUAL,
        },
        hubIds: {
          fieldName: 'hubId',
          operator: filterOperators.IN,
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

  async listQueuedOrders(query?: ListingQuery): Promise<ItemsList<Order>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        cityId: {
          fieldName: 'cityId',
          operator: filterOperators.EQUAL,
        },
        areaId: {
          fieldName: 'areaId',
          operator: filterOperators.EQUAL,
        },
        types: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        hubIds: {
          fieldName: 'hubId',
          operator: filterOperators.IN,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
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

  async listOngoingOrders(query?: ListingQuery): Promise<ItemsList<Order>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        cityId: {
          fieldName: 'cityId',
          operator: filterOperators.EQUAL,
        },
        areaId: {
          fieldName: 'areaId',
          operator: filterOperators.EQUAL,
        },
        types: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        hubIds: {
          fieldName: 'hubId',
          operator: filterOperators.IN,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
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

  async getQueuedOrdersCounts(
    query?: ListingQuery
  ): Promise<QueuedOrdersCounts> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        cityId: {
          fieldName: 'cityId',
          operator: filterOperators.EQUAL,
        },
        areaId: {
          fieldName: 'areaId',
          operator: filterOperators.EQUAL,
        },
        types: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        hubIds: {
          fieldName: 'hubId',
          operator: filterOperators.IN,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
      },
    });

    return mapQueuedOrdersCountsResponseToQueuedOrdersCounts(
      await this._networkService.request<
        QueuedOrdersCountsRequest,
        QueuedOrdersCountsResponse
      >({
        requestLine: 'get /api/v1/orders/queued-orders-count',
        query: beQuery ? { query: beQuery } : undefined,
      })
    );
  }

  async listCancellationReasons(
    query: ListingQuery
  ): Promise<Record<string, CancellationReason[]>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
    });
    return mapCancellationReasonsListV2ResponseToCancellationReasons(
      await this._networkService.request<
        CancellationReasonsListV2Request,
        CancellationReasonsListV2Response
      >({
        requestLine: 'get /api/v1/orders/cancellation-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
    );
  }

  async cancelOrder(
    orderId: EntityId,
    cancellationReasonId: EntityId,
    requestRefund: boolean
  ): Promise<void> {
    await this._networkService.request<CancelOrderRequest, CancelOrderResponse>(
      {
        requestLine: 'post /api/v1/orders/:orderId/cancel',
        params: { orderId },
        body: {
          cancellationReasonId,
          requestRefund,
        },
      }
    );
  }

  async getRejectionReasons(): Promise<RejectionReason[]> {
    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [CancellationReasonsOrderType.B2C.valueOf()] },
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
        query: beQuery ? { query: beQuery } : undefined,
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

  async updateOrderStatus({
    orderId,
    status,
    totalPaid,
    rejectionForm,
  }: UpdateOrderStatusParams): Promise<void> {
    const token = await this._actionAuthTokenRepo.getToken();

    await this._networkService.request<
      UpdateOrderStatusRequest,
      UpdateOrderStatusResponse
    >({
      requestLine: 'patch /api/v1/orders/:orderId/status',
      params: { orderId },
      body: {
        orderStatus: status.valueOf() as OrderStatus,
        totalPaid,
        rejectionReasonId: rejectionForm.reasonId
          ? rejectionForm.reasonId
          : undefined,
        unavailableItems: rejectionForm.unavailableItems.length
          ? rejectionForm.unavailableItems
          : undefined,
        unavailableSelections: rejectionForm.unavailableSelections.length
          ? rejectionForm.unavailableSelections
          : undefined,
        b2cBranchStatus:
          rejectionForm.b2cBranchStatus.valueOf() != ''
            ? (rejectionForm.b2cBranchStatus.valueOf() as BranchB2CStatus)
            : undefined,
        notes: rejectionForm.notes != '' ? rejectionForm.notes : undefined,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
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
}
