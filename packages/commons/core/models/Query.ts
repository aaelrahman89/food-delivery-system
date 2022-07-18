import { Primitive } from '../types';
import { isEmpty, isNotEmpty } from '../utils/checks';

export const filterOperators = Object.freeze({
  EQUAL: 'eq',
  NOT_EQUAL: 'neq',
  GT: 'gt',
  LT: 'lt',
  GTE: 'gte',
  LTE: 'lte',
  IN: 'in',
  NOT_IN: 'nin',
  REGEX: 'regex-i',
});

export interface FilterSpecElement {
  field: string;
  operator: string;
  value: Primitive | Primitive[];
}
export interface FilterSpec {
  elements: FilterSpecElement[];
}
interface SortSpecElement {
  field: string;
  order: string;
}
interface SortSpec {
  elements: SortSpecElement[];
}

export interface QuerySpec {
  vgql?: string;
  filter?: FilterSpec;
  sort?: SortSpec;
  skip?: number;
  limit?: number;
}

export type QueryFilterMap = Record<
  string,
  { fieldName: string; operator: string }
>;
export type QuerySortMap = Record<string, string>;
export type QueryFilter = Record<
  string,
  Primitive | Primitive[] | Record<string, string>[] | undefined
>;
export type QuerySort = Record<string, 'desc' | 'asc' | undefined>;
export type Query = Record<
  string,
  Primitive | Primitive[] | QuerySpec | QueryFilter | FilterSpec | undefined
>;

export interface ListingQueryDeprecated {
  filter?: QueryFilter;
  sort?: QuerySort;
  skip?: number;
  limit?: number;
  filterMap?: QueryFilterMap;
}

export interface ListingQuery {
  filter?: QueryFilter;
  sort?: QuerySort;
  skip?: number;
  limit?: number;
}

export interface backendQueryMapperArgs {
  filter?: QueryFilter;
  sort?: QuerySort;
  skip?: number;
  limit?: number;
  filterMap?: Record<string, (value: unknown) => FilterSpecElement[]>;
  sortMap?: QuerySortMap;
}

export type processorQueryDeprecated =
  | {
      filter: { [key: string]: string | number | Array<string | number> };
      sort: { [key: string]: string | number | Array<string | number> };
      skip: number;
      limit: number;
      vgql: string;
    }
  | undefined;

export type VgQueryBuilderParamsDeprecated =
  | {
      filterModel?: {
        [key: string]:
          | string
          | number
          | Array<string | number>
          | { [key: string]: string };
      };
      filter?: { [key: string]: string | number | Array<string | number> };
      sort?: { [key: string]: string | number | Array<string | number> };
      skip?: number;
      limit?: number;
      vgql?: string;
    }
  | undefined;

function deprecatedMapFilter(
  filter?: QueryFilter,
  filterMap?: QueryFilterMap
): FilterSpec | undefined {
  if (!filter || !filterMap) {
    return undefined;
  }
  let filterElements: FilterSpecElement[] = [];
  if (isNotEmpty(filter) && isNotEmpty(filterMap)) {
    filterElements = Object.entries(filter)
      .filter(([key, value]) => filterMap[key] && isNotEmpty(value))
      .map(([key, value]) => ({
        value,
        field: filterMap[key].fieldName,
        operator: filterMap[key].operator,
      })) as FilterSpecElement[];
  }

  if (isNotEmpty(filterElements)) {
    return {
      elements: filterElements,
    };
  }
  return undefined;
}

function mapFilter(
  filter?: QueryFilter,
  filterMap?: Record<string, (val: unknown) => FilterSpecElement[]>
): FilterSpec | undefined {
  if (isEmpty(filter) || isEmpty(filterMap)) {
    return undefined;
  }

  const mappedFilter = {
    elements: Object.keys(filter!).reduce((acc, key) => {
      if (filterMap![key] && isNotEmpty(filter![key])) {
        acc.push(...filterMap![key](filter![key]!));
      }
      return acc;
    }, [] as FilterSpecElement[]),
  };

  if (isEmpty(mappedFilter.elements)) {
    return undefined;
  }
  return mappedFilter;
}

function deprecatedMapSort(sort: QuerySort | undefined): SortSpec | undefined {
  if (!sort) {
    return undefined;
  }

  let sortElements: SortSpecElement[] = [];

  if (isNotEmpty(sort)) {
    sortElements = Object.entries(sort).map(([key, value]) => ({
      field: key,
      order: value!.toLowerCase() === 'desc' ? 'Desc' : 'Asc',
    }));
  }

  if (isNotEmpty(sortElements)) {
    return {
      elements: sortElements,
    };
  }

  return undefined;
}

function mapSort(
  sort: QuerySort | undefined,
  sortMap: QuerySortMap | undefined
): SortSpec | undefined {
  if (!sort || !sortMap) {
    return undefined;
  }

  let sortElements: SortSpecElement[] = [];

  if (isNotEmpty(sort) && isNotEmpty(sortMap)) {
    sortElements = Object.entries(sort)
      .filter(([key, value]) => sortMap[key] && isNotEmpty(value))
      .map(([key, value]) => ({
        field: sortMap[key],
        order: value!.toLowerCase() === 'desc' ? 'Desc' : 'Asc',
      }));
  }

  if (isNotEmpty(sortElements)) {
    return {
      elements: sortElements,
    };
  }

  return undefined;
}

export function queryMapper({
  filter,
  sort,
  skip,
  limit,
  filterMap,
}: ListingQueryDeprecated): QuerySpec | undefined {
  const mappedFilter = deprecatedMapFilter(filter, filterMap);
  const mappedSort = deprecatedMapSort(sort);

  const mappedQuery: QuerySpec = {};

  if (mappedFilter) {
    mappedQuery.filter = mappedFilter;
  }

  if (mappedSort) {
    mappedQuery.sort = mappedSort;
  }

  if (skip != undefined && skip >= 0) {
    mappedQuery.skip = skip;
  }

  if (limit && limit > 0) {
    mappedQuery.limit = limit;
  }

  if (isEmpty(mappedQuery)) {
    return undefined;
  }

  mappedQuery.vgql = 'v1';

  return mappedQuery;
}

export function fieldMapper({
  fieldName,
  operator,
  value,
}: {
  fieldName: string;
  operator: string;
  value: Primitive | Primitive[];
}): FilterSpecElement {
  return {
    field: fieldName,
    operator,
    value,
  };
}

export function backendQueryMapper({
  filter,
  sort,
  skip,
  limit,
  filterMap,
  sortMap,
}: backendQueryMapperArgs): QuerySpec | undefined {
  const mappedFilter = mapFilter(filter, filterMap);
  const mappedSort = mapSort(sort, sortMap);

  const mappedQuery: QuerySpec = {};

  if (mappedFilter) {
    mappedQuery.filter = mappedFilter;
  }

  if (mappedSort) {
    mappedQuery.sort = mappedSort;
  }

  if (skip != undefined && skip >= 0) {
    mappedQuery.skip = skip;
  }

  if (limit && limit > 0) {
    mappedQuery.limit = limit;
  }

  if (isEmpty(mappedQuery)) {
    return undefined;
  }

  mappedQuery.vgql = 'v1';

  return mappedQuery;
}
