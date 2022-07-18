import { CancelErrandOrderRepo } from '../../../core/repositories/CancelErrandOrderRepo';
import {
  CancelErrandOrderRequest,
  CancelErrandOrderResponse,
} from '@survv/api/definitions/errands';
import { CancellationReason } from '../../../core/models/OrderCancellationReasons';
import {
  CancellationReasonsListV2Request,
  CancellationReasonsListV2Response,
} from '@survv/api/definitions/cancellation-reasons';
import { EntityId } from '@survv/commons/core/types';
import {
  ListingQuery,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapErrandCancellationReasonResponseToErrandCancellationReasons } from './mappers/responses';

export class CancelErrandOrderRepoImpl implements CancelErrandOrderRepo {
  private _networkService: NetworkService = networkService;

  async listCancellationReasons(
    query?: ListingQuery
  ): Promise<CancellationReason[]> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
    });
    return mapErrandCancellationReasonResponseToErrandCancellationReasons(
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
    await this._networkService.request<
      CancelErrandOrderRequest,
      CancelErrandOrderResponse
    >({
      requestLine: 'post /api/v1/orders/errands/:orderId/cancel',
      params: { orderId },
      body: {
        cancellationReasonId,
        requestRefund,
      },
    });
  }
}
