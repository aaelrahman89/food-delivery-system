import { BasePM } from './BasePM';
import {
  ListingQuery,
  ListingQueryDeprecated,
  QueryFilter,
  QueryFilterMap,
  QuerySort,
  QuerySpec,
  queryMapper,
} from '../models/Query';
import { isNotEmpty, isNumber, isObject, isString } from '../utils/checks';

function removeEmptyProps(
  obj?: QueryFilter | QuerySort
): QueryFilter | QuerySort | undefined {
  if (!isObject(obj)) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => isNotEmpty(value))
  );
}

function isValidFilter(filter?: QueryFilter): filter is QueryFilter {
  return isNotEmpty<QueryFilter>(removeEmptyProps(filter));
}

function isValidSort(sort?: QuerySort): sort is QuerySort {
  return isNotEmpty(removeEmptyProps(sort));
}

function isValidSkip(skip?: number): boolean {
  return (
    (isNumber(skip) || isString(skip)) && (skip as NonNullable<number>) >= 0
  );
}

function isValidLimit(limit?: number): boolean {
  return (
    (isNumber(limit) || isString(limit)) && (limit as NonNullable<number>) > 0
  );
}

export interface BaseListingPMOptions {
  filterMap?: QueryFilterMap;
  hardFilter?: QueryFilter;
  defaultQuery?: ListingQueryDeprecated;
  query?: ListingQueryDeprecated;
}
export class BaseListingPM extends BasePM {
  protected readonly _filterMap?: QueryFilterMap;
  protected readonly _hardFilter?: QueryFilter;
  query: Readonly<ListingQueryDeprecated>;
  constructor(options: BaseListingPMOptions) {
    super();
    const { filterMap, hardFilter, defaultQuery, query } = options;
    this._filterMap = Object.freeze(filterMap);
    this._hardFilter = Object.freeze(hardFilter);
    this.query = BaseListingPM.buildQuery(query || defaultQuery);
  }

  /**
   * @deprecated use _listingQuery instead and use the query mapper in the repo
   */
  get _backendQuery(): QuerySpec | undefined {
    return queryMapper({
      filter: {
        ...this.query.filter,
        ...(isValidFilter(this._hardFilter) &&
          removeEmptyProps(this._hardFilter)),
      },
      skip: this.query.skip,
      limit: this.query.limit,
      sort: this.query.sort,
      filterMap: this._filterMap,
    });
  }

  get _listingQuery(): ListingQuery {
    return {
      filter: {
        ...this.query.filter,
        ...(isValidFilter(this._hardFilter) &&
          removeEmptyProps(this._hardFilter)),
      },
      skip: this.query.skip,
      limit: this.query.limit,
      sort: this.query.sort,
    };
  }

  static buildQuery(
    listingQuery: ListingQueryDeprecated = {}
  ): ListingQueryDeprecated {
    const { filter, sort, skip, limit } = listingQuery;
    const query: ListingQueryDeprecated = {};

    if (isValidFilter(filter)) {
      query.filter = removeEmptyProps(filter);
    }

    if (isValidSort(sort)) {
      query.sort = removeEmptyProps(sort) as QuerySort;
    }

    if (isValidSkip(skip)) {
      query.skip = Number(skip);
    }

    if (isValidLimit(limit)) {
      query.limit = Number(limit);
    }

    return query;
  }

  async onFilterUpdate(filter?: QueryFilter): Promise<void> {
    this.query = BaseListingPM.buildQuery({
      ...this.query,
      filter,
    });

    return this.refresh();
  }

  async onSortUpdate(sort: QuerySort): Promise<void> {
    this.query = BaseListingPM.buildQuery({
      ...this.query,
      sort,
    });
    return this.refresh();
  }

  async onPaginationUpdate(pagination: {
    skip: number;
    limit: number;
  }): Promise<void> {
    const { skip, limit } = pagination;
    this.query = BaseListingPM.buildQuery({ ...this.query, skip, limit });
    return this.refresh();
  }
}
