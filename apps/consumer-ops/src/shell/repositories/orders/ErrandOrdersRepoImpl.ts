import { CancellationReasonsOrderType } from '../../../core/models/OrderCancellationReasons';
import {
  CoveredZonesRequest,
  CoveredZonesResponse,
  DetectZoneRequest,
  DetectZoneResponse,
  ErrandOrderCalculateRequest,
  ErrandOrderCalculateResponse,
  ErrandOrderEditRequest,
  ErrandOrderEditResponse,
  ErrandOrderRejectRequest,
  ErrandOrderRejectResponse,
  ErrandOrderRequest,
  ErrandOrderResponse,
  ErrandOrderStructureRequest,
  ErrandOrderStructureResponse,
} from '@survv/api/definitions/errands';
import { EntityId } from '@survv/commons/core/types';
import { ErrandCharging } from '../../../core/models/ErrandCharging';
import { ErrandDetectedZone } from '../../../core/models/ErrandDetectedZone';
import { ErrandOrder } from '../../../core/models/ErrandOrder';
import { ErrandOrdersRepo } from '../../../core/repositories/ErrandOrdersRepo';
import { ErrandStructureForm } from '../../../core/models/ErrandOrderForms';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  OrderRejectionReasonsRequest,
  OrderRejectionReasonsResponse,
} from '@survv/api/definitions/orders';
import { RejectionReason } from '../../../core/models/RejectionReason';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import {
  mapCoveredZonesResponseToGeojsonCoordinatesArrays,
  mapDetectedZoneResponseToDetectedZone,
  mapErrandOrderCalculateResponseToErrandCharging,
  mapErrandOrderResponseToErrandOrder,
  mapOrderRejectionReasonsResponseToRejectionReasons,
} from './mappers/responses';
import {
  mapErrandOrderStructureFormToErrandOrderCalculateRequest,
  mapErrandOrderStructureFormToErrandOrderEditRequest,
  mapErrandOrderStructureFormToErrandOrderStructureRequest,
} from './mappers/requests';

export class ErrandOrdersRepoImpl implements ErrandOrdersRepo {
  private readonly _networkService: NetworkService = networkService;

  async getOrder(orderId: EntityId): Promise<ErrandOrder> {
    return mapErrandOrderResponseToErrandOrder(
      await this._networkService.request<
        ErrandOrderRequest,
        ErrandOrderResponse
      >({
        requestLine: 'get /api/v1/orders/errands/:orderId',
        params: { orderId },
      })
    );
  }

  async structureOrder(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<void> {
    const body =
      mapErrandOrderStructureFormToErrandOrderStructureRequest(errandOrderForm);
    await this._networkService.request<
      ErrandOrderStructureRequest,
      ErrandOrderStructureResponse
    >({
      requestLine: 'patch /api/v1/orders/errands/:orderId/structure',
      params: { orderId },
      body,
    });
  }

  async editOrder(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<void> {
    const body =
      mapErrandOrderStructureFormToErrandOrderEditRequest(errandOrderForm);
    await this._networkService.request<
      ErrandOrderEditRequest,
      ErrandOrderEditResponse
    >({
      requestLine: 'patch /api/v1/orders/errands/:orderId',
      params: { orderId },
      body,
    });
  }

  async calculateCharging(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<ErrandCharging> {
    return mapErrandOrderCalculateResponseToErrandCharging(
      await this._networkService.request<
        ErrandOrderCalculateRequest,
        ErrandOrderCalculateResponse
      >({
        requestLine:
          'post /api/v1/orders/errands/:orderId/estimated-delivery-fee',
        params: { orderId },
        body: mapErrandOrderStructureFormToErrandOrderCalculateRequest(
          errandOrderForm
        ),
      })
    );
  }

  async detectZone(point: GeojsonCoordinates): Promise<ErrandDetectedZone> {
    return mapDetectedZoneResponseToDetectedZone(
      await this._networkService.request<DetectZoneRequest, DetectZoneResponse>(
        {
          requestLine: 'get /api/v1.1/zones/detect-zone',
          query: {
            geoPoint: {
              type: 'Point',
              coordinates: point,
            },
          },
        }
      )
    );
  }

  async getSupportedZones(zoneName: string): Promise<GeojsonCoordinates[][][]> {
    return mapCoveredZonesResponseToGeojsonCoordinatesArrays(
      await this._networkService.request<
        CoveredZonesRequest,
        CoveredZonesResponse
      >({
        requestLine: 'get /consumer/api/v1/errands/covered-zones',
        query: { zoneName },
      })
    );
  }

  async getRejectionReasons(): Promise<RejectionReason[]> {
    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()] },
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

  async rejectOrder(
    orderId: EntityId,
    rejectionReasonId: EntityId
  ): Promise<void> {
    await this._networkService.request<
      ErrandOrderRejectRequest,
      ErrandOrderRejectResponse
    >({
      requestLine: 'post /api/v1/orders/errands/:orderId/reject',
      params: { orderId },
      body: { rejectionReasonId },
    });
  }
}
