import {
  AcceptOrderRequest,
  AcceptOrderResponse,
  OrderEnrichmentRequest,
  OrderEnrichmentResponse,
  OrderRequest,
  OrderResponse,
  RejectOrderRequest,
  RejectOrderResponse,
} from '@survv/api/definitions/orders';
import { C2COrder, C2CStructuredOrder } from '../../../core/models/C2COrder';
import { C2COrdersRepo } from '../../../core/repositories/C2COrdersRepo';
import { EntityId } from '@survv/commons/core/types';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { mapC2COrderResponseToC2COrder } from './mappers/responses';
import { mapC2CStructuredOrderToOrderEnrichmentRequest } from './mappers/requests';

export class C2COrdersRepoImpl implements C2COrdersRepo {
  private readonly _networkService: NetworkService;

  constructor() {
    this._networkService = networkService;
  }

  async getOrder(orderId: EntityId): Promise<C2COrder> {
    const c2cOrderResponse = await this._networkService.request<
      OrderRequest,
      OrderResponse
    >({
      requestLine: 'get /api/v1/orders/:orderId',
      params: { orderId },
    });

    return mapC2COrderResponseToC2COrder(c2cOrderResponse);
  }

  async acceptC2COrder(order: C2CStructuredOrder): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<
      OrderEnrichmentRequest,
      OrderEnrichmentResponse
    >({
      requestLine: 'post /api/v1/orders/:orderId/enrich-items',
      params: { orderId: order.id },
      body: mapC2CStructuredOrderToOrderEnrichmentRequest(order),
    });

    await this._networkService.request<AcceptOrderRequest, AcceptOrderResponse>(
      {
        requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
        params: { branchId },
        body: { orderId: order.id },
      }
    );
  }

  async rejectC2COrder(orderId: EntityId): Promise<void> {
    const branchId = await authTokenRepo.getUserId();

    await this._networkService.request<RejectOrderRequest, RejectOrderResponse>(
      {
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId },
        body: { orderId },
      }
    );
  }
}
