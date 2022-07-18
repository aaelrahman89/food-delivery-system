import VgQueryBuilder from '../../../../../src/core/deprecated/etc/VgQueryBuilder';
import { assert } from 'chai';

describe('VgQueryBuilder Unit', function () {
  it('should build VgQuery filter property correctly', function () {
    const vgQuery = new VgQueryBuilder()
      .setFilterModel({
        pilotId: { mapTo: 'id', operator: 'eq' },
        mobileNo: { mapTo: 'mobile', operator: 'ne' },
        rangeStart: { mapTo: 'range', operator: 'gt' },
        rangeEnd: { mapTo: 'range', operator: 'lt' },
        from: { mapTo: 'creationDate', operator: 'gte' },
        to: { mapTo: 'creationDate', operator: 'lte' },
        statusAvailable: { mapTo: 'status', operator: 'in' },
        statusNotAvailable: { mapTo: 'status', operator: 'nin' },
        mapBoundary: { mapTo: 'lastKnownLocation', operator: 'geowithin' },
      })
      .setFilter({
        pilotId: 1234,
        mobileNo: '01234567891',
        rangeStart: 507,
        rangeEnd: 607,
        from: '2019-03-17T11:02:21.349Z',
        to: '2019-03-17T11:02:31.349Z',
        statusAvailable: ['available, loaded'],
        statusNotAvailable: ['unavailable'],
        mapBoundary: {
          type: 'Polygon',
          coordinates: [
            [
              [31.253217749040232, 30.030618543006295],
              [31.253217749040232, 30.011742358622435],
              [31.191902450959788, 30.011742358622435],
              [31.191902450959788, 30.030618543006295],
              [31.253217749040232, 30.030618543006295],
            ],
          ],
        },
        unmappedField: 'should not map this field',
      })
      .build();

    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      filter: {
        elements: [
          { field: 'id', operator: 'eq', value: 1234 },
          { field: 'mobile', operator: 'ne', value: '01234567891' },
          { field: 'range', operator: 'gt', value: 507 },
          { field: 'range', operator: 'lt', value: 607 },
          {
            field: 'creationDate',
            operator: 'gte',
            value: '2019-03-17T11:02:21.349Z',
          },
          {
            field: 'creationDate',
            operator: 'lte',
            value: '2019-03-17T11:02:31.349Z',
          },
          { field: 'status', operator: 'in', value: ['available, loaded'] },
          { field: 'status', operator: 'nin', value: ['unavailable'] },
          {
            field: 'lastKnownLocation',
            operator: 'geowithin',
            value: {
              type: 'Polygon',
              coordinates: [
                [
                  [31.253217749040232, 30.030618543006295],
                  [31.253217749040232, 30.011742358622435],
                  [31.191902450959788, 30.011742358622435],
                  [31.191902450959788, 30.030618543006295],
                  [31.253217749040232, 30.030618543006295],
                ],
              ],
            },
          },
        ],
      },
    });
  });

  it('should return undefined filter is not an object is given', function () {
    const vgQuery = new VgQueryBuilder().setFilter('string').build();
    assert.isUndefined(vgQuery);
  });

  it('should return undefined if filterModel is not an object', function () {
    const vgQuery = new VgQueryBuilder()
      .setFilterModel('this is a string')
      .build();
    assert.isUndefined(vgQuery);
  });

  it('should build VgQuery sort property correctly', function () {
    const vgQueryBuilder = new VgQueryBuilder();
    const vgQuery = vgQueryBuilder
      .setSort({
        ascendingUpperCase: 'ASC',
        ascendingLowerCase: 'asc',
        ascendingMixCase: 'AsC',
        descendingUpperCase: 'DESC',
        descendingLowerCase: 'desc',
        descendingMixedCase: 'DeSc',
        notDetermined: {},
      })
      .build();

    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      sort: {
        elements: [
          { field: 'ascendingUpperCase', order: 'Asc' },
          { field: 'ascendingLowerCase', order: 'Asc' },
          { field: 'ascendingMixCase', order: 'Asc' },
          { field: 'descendingUpperCase', order: 'Desc' },
          { field: 'descendingLowerCase', order: 'Desc' },
          { field: 'descendingMixedCase', order: 'Desc' },
        ],
      },
    });
  });

  it('should undefined if sort is not an object', function () {
    const vgQuery = new VgQueryBuilder().setSort(false).build();

    assert.isUndefined(vgQuery);
  });

  it('should build VgQuery skip property correctly', function () {
    const vgQuery = new VgQueryBuilder().setSkip(200).build();

    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      skip: 200,
    });
  });

  it('should return undefined if skip is not a number', function () {
    const vgQuery = new VgQueryBuilder().setSkip('fff').build();
    assert.isUndefined(vgQuery);
  });
  it('should build VgQuery skip and limit properties correctly', function () {
    const vgQuery = new VgQueryBuilder().setLimit(200).build();

    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      limit: 200,
    });
  });

  it('should undefined if limit is not a number', function () {
    const vgQuery = new VgQueryBuilder().setLimit('fff').build();
    assert.isUndefined(vgQuery);
  });

  it('should undefined if no valid params is given', function () {
    const vgQuery = new VgQueryBuilder().build();
    assert.isUndefined(vgQuery);
  });

  it('should call with skip = 0', function () {
    const vgQuery = new VgQueryBuilder().setSkip(0).build();
    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      skip: 0,
    });
  });

  it('should call with limit = 0', function () {
    const vgQuery = new VgQueryBuilder().setLimit(0).build();
    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      limit: 0,
    });
  });

  it('should return undefined if skip < 0', function () {
    const vgQuery = new VgQueryBuilder().setSkip(-90).build();
    assert.isUndefined(vgQuery);
  });

  it('should return undefined if limit < 0', function () {
    const vgQuery = new VgQueryBuilder().setLimit(-10).build();
    assert.isUndefined(vgQuery);
  });

  it('should accept the parameters at construction and be able to build the query successfully', function () {
    const vgQuery = new VgQueryBuilder({
      filterModel: {
        hubId: { mapTo: 'id', operator: 'eq' },
        areaId: { mapTo: 'areaId', operator: 'eq' },
      },
      filter: {
        hubId: 123124,
        areaId: 12345,
      },
      sort: {
        label: 'asc',
      },
      skip: 100,
      limit: 200,
    }).build();

    assert.deepEqual(vgQuery, {
      vgql: 'v1',
      filter: {
        elements: [
          { field: 'id', operator: 'eq', value: 123124 },
          { field: 'areaId', operator: 'eq', value: 12345 },
        ],
      },
      sort: {
        elements: [{ field: 'label', order: 'Asc' }],
      },
      skip: 100,
      limit: 200,
    });
  });
});
