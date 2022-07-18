import { EntityId } from '@survv/commons/core/types';
import { ErrandsOrderJourney } from '../../../core/models/ErrandsOrderJourney';
import { ErrandsOrderJourneyRepo } from '../../../core/repositories/ErrandsOrderJourneyRepo';
import {
  ErrandsOrderJourneyRequest,
  ErrandsOrderJourneyResponse,
} from '@survv/api/definitions/errands';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapErrandsOrderJourneyResponseToErrandsOrderJourney } from './mappers/responses';

export class ErrandsOrderJourneyRepoImpl implements ErrandsOrderJourneyRepo {
  private readonly _networkService: NetworkService = networkService;

  async getErrandsOrderJourney(
    orderId: EntityId
  ): Promise<ErrandsOrderJourney> {
    return mapErrandsOrderJourneyResponseToErrandsOrderJourney(
      await this._networkService.request<
        ErrandsOrderJourneyRequest,
        ErrandsOrderJourneyResponse
      >({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
    );
  }
}
