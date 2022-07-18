import { BaseListingPM } from '../../../../core/base/BaseListingPM';
import { assert } from 'chai';
import { filterOperators, queryMapper } from '../../../../core/models/Query';

class FakeImplementation extends BaseListingPM {
  constructor({ query, filterMap, hardFilter }) {
    super({
      query,
      defaultQuery: {
        filter: { taskId: 1234 },
        sort: { taskId: 'Asc' },
        skip: 0,
        limit: 100,
      },
      filterMap,
      hardFilter,
    });
    this.refreshed = false;
  }

  async refresh() {
    this.refreshed = true;
  }

  get backendQuery() {
    return this._backendQuery;
  }
}

describe('BaseListingPM unit', function () {
  describe('initial query state', function () {
    it('should equal the default query without empty props if no query was given', function () {
      const pm = new BaseListingPM({
        defaultQuery: {
          filter: { status: 'DELIVERED', taskId: 1234, empty: '', props: {} },
          sort: { status: 'desc', sort: undefined, dummy: [] },
          skip: 25,
          limit: 30,
        },
      });

      assert.deepEqual(pm.query, {
        filter: { status: 'DELIVERED', taskId: 1234 },
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
    });

    it('should equal the given query without empty props and ignore the default query', function () {
      const pm = new BaseListingPM({
        query: {
          filter: {
            status: 'DELIVERED',
            taskId: 1234,
            empty: '',
            props: {},
            dummy: null,
          },
          sort: {
            sort: undefined,
            dummy: [],
          },
        },
        defaultQuery: {
          filter: { xyz: 'xyz' },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      assert.deepEqual(pm.query, {
        filter: { status: 'DELIVERED', taskId: 1234 },
      });
    });
    it('should be an empty object if no query or default query was given', function () {
      const pm = new BaseListingPM({});

      assert.isObject(pm.query);
      assert.isEmpty(pm.query);
    });
  });

  describe('onFilterUpdate', function () {
    it('should save the new filter and refresh', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onFilterUpdate({ status: 'DELIVERED' });

      assert.deepEqual(pm.query, {
        filter: { status: 'DELIVERED' },
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the filter and refresh when given a non-object filter', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onFilterUpdate('string');

      assert.deepEqual(pm.query, {
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the filter and refresh when given an empty filter object', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onFilterUpdate({});

      assert.deepEqual(pm.query, {
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the filter and refresh when all given filter props are empty', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onFilterUpdate({
        hi: undefined,
        status: {},
        task: '',
        pilot: null,
      });

      assert.deepEqual(pm.query, {
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the empty filter props when saving it and refresh', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onFilterUpdate({ hi: '', bye: null, valid: 'string' });

      assert.deepEqual(pm.query, {
        filter: { valid: 'string' },
        sort: { status: 'desc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });
  });

  describe('onSortUpdate', function () {
    it('should save the new sort and refresh', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onSortUpdate({ helloWorld: 'asc' });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { helloWorld: 'asc' },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the sort but refresh when given a non-object sort', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onSortUpdate('sort');

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the sort but refresh when given an empty sort object', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onSortUpdate({});

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        skip: 25,
        limit: 30,
      });
      assert.isTrue(pm.refreshed);
    });

    it('should remove the sort but refresh when all given sort props are empty', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onSortUpdate({
        hi: undefined,
        status: {},
        task: '',
        pilot: null,
      });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        skip: 25,
        limit: 30,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the empty sort props when saving it and refresh', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onSortUpdate({
        hi: undefined,
        status: {},
        task: '',
        pilot: 'asc',
      });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { pilot: 'asc' },
        skip: 25,
        limit: 30,
      });

      assert.isTrue(pm.refreshed);
    });
  });

  describe('onPaginationUpdate', function () {
    it('should save the new skip and limit and refresh', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: 0, limit: 100 });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        skip: 0,
        limit: 100,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the skip but save the limit and refresh when skip is not a number', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: 'string', limit: 100 });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        limit: 100,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the skip but save the limit and refresh when skip is less than zero', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: -10, limit: 100 });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        limit: 100,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the limit but save the skip and refresh when limit is not a number', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: 100, limit: 'string' });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        skip: 100,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the limit but save the skip and refresh when limit equals zero', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: 100, limit: 0 });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        skip: 100,
      });

      assert.isTrue(pm.refreshed);
    });

    it('should remove the limit but save the skip and refresh when limit is less than zero', async function () {
      const pm = new FakeImplementation({
        query: {
          filter: { status: 'CANCELED', taskId: 1234 },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        },
      });

      await pm.onPaginationUpdate({ skip: 100, limit: -10 });

      assert.deepEqual(pm.query, {
        filter: { status: 'CANCELED', taskId: 1234 },
        sort: { status: 'desc' },
        skip: 100,
      });

      assert.isTrue(pm.refreshed);
    });
  });

  describe('backendQuery getter', function () {
    context('given a valid hard filter', function () {
      it('should return a mapped backend query with the hard filter applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 100,
            limit: 200,
          },
          filterMap: {
            status: { fieldName: 'st', operator: filterOperators.EQUAL },
            taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
            pilotStatus: {
              fieldName: 'pStatus',
              operator: filterOperators.EQUAL,
            },
          },
          hardFilter: {
            pilotStatus: 'AVAILABLE',
          },
        });

        assert.deepEqual(
          pm.backendQuery,
          queryMapper({
            filter: {
              status: 'CANCELED',
              taskId: 1234,
              pilotStatus: 'AVAILABLE',
            },
            sort: { status: 'desc' },
            skip: 100,
            limit: 200,
            filterMap: {
              status: { fieldName: 'st', operator: filterOperators.EQUAL },
              taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
              pilotStatus: {
                fieldName: 'pStatus',
                operator: filterOperators.EQUAL,
              },
            },
          })
        );
      });
    });
    context('given an empty hard filter', function () {
      it('should return a mapped backend query without the hard filter being applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 0,
            limit: 25,
          },
          filterMap: {
            status: { fieldName: 'st', operator: filterOperators.EQUAL },
            taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
            pilotStatus: {
              fieldName: 'pStatus',
              operator: filterOperators.EQUAL,
            },
          },
          hardFilter: {},
        });

        assert.deepEqual(
          pm.backendQuery,
          queryMapper({
            filter: {
              status: 'CANCELED',
              taskId: 1234,
            },
            sort: { status: 'desc' },
            skip: 0,
            limit: 25,
            filterMap: {
              status: { fieldName: 'st', operator: filterOperators.EQUAL },
              taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
              pilotStatus: {
                fieldName: 'pStatus',
                operator: filterOperators.EQUAL,
              },
            },
          })
        );
      });
    });
    context('given a non-object hard filter', function () {
      it('should return a mapped backend query without the hard filter being applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
          },
          filterMap: {
            status: { fieldName: 'st', operator: filterOperators.EQUAL },
            taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
            pilotStatus: {
              fieldName: 'pStatus',
              operator: filterOperators.EQUAL,
            },
          },
          hardFilter: 'string',
        });

        assert.deepEqual(
          pm.backendQuery,
          queryMapper({
            filter: {
              status: 'CANCELED',
              taskId: 1234,
            },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
            filterMap: {
              status: { fieldName: 'st', operator: filterOperators.EQUAL },
              taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
              pilotStatus: {
                fieldName: 'pStatus',
                operator: filterOperators.EQUAL,
              },
            },
          })
        );
      });
    });
    context('given a hard filter object with empty props', function () {
      it('should return a mapped backend query with the hard filter applied without the empty props', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { taskId: 1234 },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
          },
          filterMap: {
            status: { fieldName: 'st', operator: filterOperators.EQUAL },
            taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
            pilotStatus: {
              fieldName: 'pStatus',
              operator: filterOperators.EQUAL,
            },
          },
          hardFilter: {
            pilotStatus: '',
            status: '',
          },
        });

        assert.deepEqual(
          pm.backendQuery,
          queryMapper({
            filter: {
              taskId: 1234,
            },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
            filterMap: {
              status: { fieldName: 'st', operator: filterOperators.EQUAL },
              taskId: { fieldName: 'id', operator: filterOperators.EQUAL },
              pilotStatus: {
                fieldName: 'pStatus',
                operator: filterOperators.EQUAL,
              },
            },
          })
        );
      });
    });
  });

  describe('listingQuery getter', function () {
    context('given a valid hard filter', function () {
      it('should return a mapped listing query with the hard filter applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 100,
            limit: 200,
          },
          hardFilter: {
            pilotStatus: 'AVAILABLE',
          },
        });

        assert.deepEqual(pm._listingQuery, {
          filter: {
            status: 'CANCELED',
            taskId: 1234,
            pilotStatus: 'AVAILABLE',
          },
          sort: { status: 'desc' },
          skip: 100,
          limit: 200,
        });
      });
    });
    context('given an empty hard filter', function () {
      it('should return a mapped listing query without the hard filter being applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 0,
            limit: 25,
          },
          hardFilter: {},
        });

        assert.deepEqual(pm._listingQuery, {
          filter: {
            status: 'CANCELED',
            taskId: 1234,
          },
          sort: { status: 'desc' },
          skip: 0,
          limit: 25,
        });
      });
    });
    context('given a non-object hard filter', function () {
      it('should return a mapped listing query without the hard filter being applied', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { status: 'CANCELED', taskId: 1234 },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
          },
          hardFilter: 'string',
        });

        assert.deepEqual(pm._listingQuery, {
          filter: {
            status: 'CANCELED',
            taskId: 1234,
          },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        });
      });
    });
    context('given a hard filter object with empty props', function () {
      it('should return a mapped listing query with the hard filter applied without the empty props', function () {
        const pm = new FakeImplementation({
          query: {
            filter: { taskId: 1234 },
            sort: { status: 'desc' },
            skip: 25,
            limit: 30,
          },
          hardFilter: {
            pilotStatus: '',
            status: '',
          },
        });

        assert.deepEqual(pm._listingQuery, {
          filter: {
            taskId: 1234,
          },
          sort: { status: 'desc' },
          skip: 25,
          limit: 30,
        });
      });
    });
  });
});
