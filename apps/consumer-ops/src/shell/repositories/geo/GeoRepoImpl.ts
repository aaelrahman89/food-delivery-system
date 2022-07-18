import { Area } from '../../../core/models/Area';
import {
  AreaListRequest,
  AreaListResponse,
} from '@survv/api/definitions/areas';
import { City } from '../../../core/models/City';
import {
  CityListRequest,
  CityListResponse,
} from '@survv/api/definitions/cities';
import { Country } from '../../../core/models/Country';
import {
  CountryListRequest,
  CountryListResponse,
} from '@survv/api/definitions/countries';
import { GeoRepo } from '../../../core/repositories/Geo/GeoRepo';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  QueryFilter,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  mapAreaListingResponseToAreas,
  mapCityListingResponseToCities,
  mapCountryListingResponseToCountries,
} from './mappers/responses';

export class GeoRepoImpl implements GeoRepo {
  private readonly _networkService: NetworkService = networkService;

  public async getCountries(): Promise<Country[]> {
    return mapCountryListingResponseToCountries(
      await this._networkService.request<
        CountryListRequest,
        CountryListResponse
      >({
        requestLine: 'get /api/v1.2/countries',
      })
    );
  }

  public async getCities(filter: QueryFilter): Promise<City[]> {
    const beQuery = queryMapper({
      filter,
      filterMap: {
        id: {
          fieldName: '_id',
          operator: filterOperators.EQUAL,
        },
        countryId: {
          fieldName: 'countryId',
          operator: filterOperators.EQUAL,
        },
      },
    });
    return mapCityListingResponseToCities(
      await this._networkService.request<CityListRequest, CityListResponse>({
        requestLine: 'get /api/v1.1/cities',
        query: { query: beQuery },
      })
    );
  }

  public async getAreas(filter: QueryFilter): Promise<Area[]> {
    const beQuery = queryMapper({
      filter,
      filterMap: {
        id: {
          fieldName: '_id',
          operator: filterOperators.EQUAL,
        },
        cityId: {
          fieldName: 'cityId',
          operator: filterOperators.EQUAL,
        },
      },
    });
    return mapAreaListingResponseToAreas(
      await this._networkService.request<AreaListRequest, AreaListResponse>({
        requestLine: 'get /api/v1.1/areas',
        query: { query: beQuery },
      })
    );
  }
}
