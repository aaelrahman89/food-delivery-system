import {
  ErrandCategoriesListRequest,
  ErrandCategoriesListResponse,
} from '@survv/api/definitions/errands';
import { ErrandCategoriesRepo } from '../../../core/repositories/ErrandCategoriesRepo';
import { ErrandCategory } from '../../../core/models/ErrandCategory';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  QuerySpec,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapErrandCategoriesListResponseToErrandCategories } from './mappers/responses';

export class ErrandCategoriesRepoImpl implements ErrandCategoriesRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async listCategories(
    query?: ListingQuery
  ): Promise<ItemsList<ErrandCategory>> {
    const beQuery: QuerySpec | undefined = queryMapper({
      ...query,
      filterMap: {
        archived: {
          fieldName: 'archived',
          operator: filterOperators.EQUAL,
        },
      },
    });

    return mapErrandCategoriesListResponseToErrandCategories(
      await this._networkService.request<
        ErrandCategoriesListRequest,
        ErrandCategoriesListResponse
      >({
        requestLine: 'get /consumer/api/v1/errands/categories',
        query: beQuery ? { query: beQuery } : undefined,
      })
    );
  }
}
