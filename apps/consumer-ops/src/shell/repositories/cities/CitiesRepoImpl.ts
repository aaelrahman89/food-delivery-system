import {
  CitiesListV2Request,
  CitiesListV2Response,
} from '@survv/api/definitions/cities';
import { CitiesRepo } from '../../../core/repositories/CitiesRepo';
import { City } from '../../../core/models/City';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapCitiesListV2ResponseToCities } from './mappers/responses';

export class CitiesRepoImpl implements CitiesRepo {
  private readonly _networkService: NetworkService = networkService;

  async listCities(): Promise<City[]> {
    return mapCitiesListV2ResponseToCities(
      await this._networkService.request<
        CitiesListV2Request,
        CitiesListV2Response
      >({
        requestLine: 'get /api/v1.1/cities',
      })
    );
  }
}
