import { assert } from 'chai';
import {
  backendQueryMapper,
  fieldMapper,
  filterOperators,
  queryMapper,
} from '../../../../core/models/Query';

describe('QueryMapper unit', function () {
  it('should return backendQuery with the filter mapped correctly if given valid filter and valid filterMap', function () {
    assert.deepEqual(
      queryMapper({
        filter: { taskId: 1234 },
        filterMap: {
          taskId: { fieldName: '_id', operator: filterOperators.EQUAL },
        },
      }),
      {
        vgql: 'v1',
        filter: {
          elements: [{ field: '_id', operator: 'eq', value: 1234 }],
        },
      }
    );
  });

  context('invalid filter', function () {
    const invalidFiltersTestCases = [
      {
        description: 'no filter map given',
        input: { filter: { taskId: 1234 } },
      },
      {
        description: 'no filter given',
        input: {
          filterMap: { taskId: { fieldName: 'taskId', operator: 'eq' } },
        },
      },
      {
        description: 'its keys does not match with given filterMap keys',
        input: {
          filter: { notExpectedFilter: 'value' },
          filterMap: { taskId: { fieldName: 'taskId', operator: 'eq' } },
        },
      },
      {
        description: 'it has invalid values',
        input: {
          filter: {
            emptyString: '',
            emptyArray: [],
            undefinedFilter: undefined,
            nullFilter: null,
            emptyStringWithSpaces: '  ',
            undefinedString: 'undefined',
            nullString: 'null',
          },
          filterMap: {
            emptyString: { fieldName: 'irrelevant', operator: 'irrelevant' },
            emptyArray: { fieldName: 'irrelevant', operator: 'irrelevant' },
            undefinedFilter: {
              fieldName: 'irrelevant',
              operator: 'irrelevant',
            },
            nullFilter: { fieldName: 'irrelevant', operator: 'irrelevant' },
            emptyStringWithSpaces: {
              fieldName: 'irrelevant',
              operator: 'irrelevant',
            },
            undefinedString: {
              fieldName: 'irrelevant',
              operator: 'irrelevant',
            },
            nullString: { fieldName: 'irrelevant', operator: 'irrelevant' },
          },
        },
      },
    ];

    invalidFiltersTestCases.forEach((testCase) => {
      it(`should ignore given filter in case ${testCase.description}`, function () {
        assert.isUndefined(queryMapper(testCase.input));
      });
    });
  });

  it('should return backendQuery with the sort mapped correctly if there was given sort', function () {
    assert.deepEqual(queryMapper({ sort: { id: 'desc' } }), {
      vgql: 'v1',
      sort: {
        elements: [{ field: 'id', order: 'Desc' }],
      },
    });
  });

  it('should return backendQuery with sort order "Asc" if given sort order with neither "Desc" or "Asc"', function () {
    assert.deepEqual(queryMapper({ sort: { id: 'invalidOrder' } }), {
      vgql: 'v1',
      sort: {
        elements: [{ field: 'id', order: 'Asc' }],
      },
    });
  });

  it('should return backendQuery with skip if given valid skip', function () {
    assert.deepEqual(queryMapper({ skip: 5 }), {
      vgql: 'v1',
      skip: 5,
    });
  });

  it('should return backendQuery with limit if given valid limit', function () {
    assert.deepEqual(queryMapper({ limit: 5 }), {
      vgql: 'v1',
      limit: 5,
    });
  });

  it('should ignore sort and filter if they were empty', function () {
    assert.deepEqual(
      queryMapper({
        limit: 5,
        sort: {},
        filter: { x: 1 },
        filterMap: {},
      }),
      {
        vgql: 'v1',
        limit: 5,
      }
    );
  });
});

describe('backendQueryMapper Unit', function () {
  it('should return backendQuery with the filter mapped correctly if given valid filter and valid filterMap', function () {
    assert.deepEqual(
      backendQueryMapper({
        filter: { taskId: 1234 },
        filterMap: {
          taskId: (val) => {
            return [
              fieldMapper({
                fieldName: '_id',
                operator: filterOperators.EQUAL,
                value: val,
              }),
            ];
          },
        },
      }),
      {
        vgql: 'v1',
        filter: {
          elements: [{ field: '_id', operator: 'eq', value: 1234 }],
        },
      }
    );
  });

  context('invalid filter', function () {
    const invalidFiltersTestCases = [
      {
        description: 'no filter map given',
        input: { filter: { taskId: 1234 } },
      },
      {
        description: 'no filter given',
        input: {
          filterMap: {
            taskId: (val) => {
              return [
                fieldMapper({
                  fieldName: 'taskId',
                  operator: filterOperators.EQUAL,
                  value: val,
                }),
              ];
            },
          },
        },
      },
      {
        description: 'its keys does not match with given filterMap keys',
        input: {
          filter: { notExpectedFilter: 'value' },
          filterMap: {
            taskId: (val) => {
              return [
                fieldMapper({
                  fieldName: 'taskId',
                  operator: filterOperators.EQUAL,
                  value: val,
                }),
              ];
            },
          },
        },
      },
      {
        description: 'it has invalid values',
        input: {
          filter: {
            emptyString: '',
            emptyArray: [],
            undefinedFilter: undefined,
            nullFilter: null,
            emptyStringWithSpaces: '  ',
            undefinedString: 'undefined',
            nullString: 'null',
          },
          filterMap: {
            emptyString: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            emptyArray: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            undefinedFilter: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            nullFilter: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            emptyStringWithSpaces: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            undefinedString: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
            nullString: (val) => {
              return [
                fieldMapper({
                  fieldName: 'irrelevant',
                  operator: 'irrelevant',
                  value: val,
                }),
              ];
            },
          },
        },
      },
    ];

    invalidFiltersTestCases.forEach((testCase) => {
      it(`should ignore given filter in case ${testCase.description}`, function () {
        assert.isUndefined(backendQueryMapper(testCase.input));
      });
    });
  });

  it('should return backendQuery with the sort mapped correctly if there was given sort', function () {
    assert.deepEqual(
      backendQueryMapper({ sort: { id: 'desc' }, sortMap: { id: '_id' } }),
      {
        vgql: 'v1',
        sort: {
          elements: [{ field: '_id', order: 'Desc' }],
        },
      }
    );
  });

  it('should return backendQuery with sort order "Asc" if given sort order with neither "Desc" or "Asc"', function () {
    assert.deepEqual(
      backendQueryMapper({
        sort: { id: 'invalidOrder' },
        sortMap: { id: '_id' },
      }),
      {
        vgql: 'v1',
        sort: {
          elements: [{ field: '_id', order: 'Asc' }],
        },
      }
    );
  });

  it('should return backendQuery with skip if given valid skip', function () {
    assert.deepEqual(backendQueryMapper({ skip: 5 }), {
      vgql: 'v1',
      skip: 5,
    });
  });

  it('should return backendQuery with limit if given valid limit', function () {
    assert.deepEqual(backendQueryMapper({ limit: 5 }), {
      vgql: 'v1',
      limit: 5,
    });
  });

  it('should ignore sort and filter if they were empty', function () {
    assert.deepEqual(
      backendQueryMapper({
        limit: 5,
        sort: {},
        filter: { x: 1 },
        filterMap: {},
        sortMap: {},
      }),
      {
        vgql: 'v1',
        limit: 5,
      }
    );
  });
});
