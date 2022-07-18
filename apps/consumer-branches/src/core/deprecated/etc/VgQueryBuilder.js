class VgQueryBuilder {
  constructor({ filter, filterModel, sort, skip, limit } = {}) {
    this._filter = filter;
    this._filterModel = filterModel;
    this._sort = sort;
    this._skip = skip;
    this._limit = limit;
  }

  setFilterModel(filterModel) {
    this._filterModel = filterModel;
    return this;
  }

  setFilter(filter) {
    this._filter = filter;
    return this;
  }

  setSort(sort) {
    this._sort = sort;
    return this;
  }

  setSkip(skip) {
    this._skip = skip;
    return this;
  }

  setLimit(limit) {
    this._limit = limit;
    return this;
  }

  build() {
    const queryLanguageVersion = 'v1';
    const vgQuery = {};
    const filter = this._buildQueryFilter();
    const sort = this._buildQuerySort();

    if (filter) {
      vgQuery.filter = filter;
    }

    if (sort) {
      vgQuery.sort = sort;
    }

    if (this._skip >= 0) {
      vgQuery.skip = this._skip;
    }

    if (this._limit >= 0) {
      vgQuery.limit = this._limit;
    }

    if (Object.keys(vgQuery).length) {
      vgQuery.vgql = queryLanguageVersion;
      return vgQuery;
    }

    return undefined;
  }

  _buildQueryFilter() {
    const filterElements = [];

    if (this._filter && this._filterModel) {
      Object.entries(this._filter).forEach(([key, value]) => {
        if (this._filterModel[key]) {
          filterElements.push({
            value,
            field: this._filterModel[key].mapTo,
            operator: this._filterModel[key].operator,
          });
        }
      });
    }

    if (filterElements.length) {
      return {
        elements: filterElements,
      };
    }
    return undefined;
  }

  _buildQuerySort() {
    const sortElements = [];

    if (this._sort) {
      Object.entries(this._sort).forEach(([key, value]) => {
        if (String(value).toLowerCase() == 'desc') {
          sortElements.push({
            field: key,
            order: 'Desc',
          });
        } else if (String(value).toLowerCase() == 'asc') {
          sortElements.push({
            field: key,
            order: 'Asc',
          });
        }
      });
    }

    if (sortElements.length) {
      return {
        elements: sortElements,
      };
    }

    return undefined;
  }
}

export default VgQueryBuilder;
