import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchListingPM } from '../../../../../src/core/presentation-models/branches/BranchListingPM';
import { BranchRepoImpl } from '../../../../../src/shell/repositories/restaurants/branches/BranchRepoImpl';
import { assert } from 'chai';
import { consumerVendorBranchesListingResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { mapBranchesResponseToBranchesItemList } from '../../../../../src/shell/repositories/restaurants/branches/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('BranchListingPM', function () {
  it('Should Handle branches listing hydration successfully', async function () {
    const pm = new BranchListingPM({
      vendorId: 123456,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });

    $sb
      .stub(BranchRepoImpl.prototype, 'listBranches')
      .resolves(
        mapBranchesResponseToBranchesItemList(
          consumerVendorBranchesListingResponseStub()
        )
      );

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });

  it('Should Handle branches listing hydration errors successfully', async function () {
    const pm = new BranchListingPM({
      vendorId: 123456,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'listBranches')
      .rejects(new Error('anything'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should hydrate branches listing successfully', async function () {
    const vendorId = 123456;
    const pm = new BranchListingPM({
      vendorId,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });

    const beQuery = queryMapper({
      filter: {
        vendorId,
      },
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 25,
      filterMap: {
        vendorId: {
          fieldName: 'vendorId',
          operator: filterOperators.EQUAL,
        },
        label: {
          fieldName: 'label',
          operator: filterOperators.EQUAL,
        },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/branches',
        query: {
          query: beQuery,
        },
      })
      .response({
        status: 200,
        body: consumerVendorBranchesListingResponseStub(),
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branches,
      mapBranchesResponseToBranchesItemList(
        consumerVendorBranchesListingResponseStub()
      )
    );
  });

  it('Should hydrate filtered branches listing successfully', async function () {
    const vendorId = 123456;
    const pm = new BranchListingPM({
      vendorId,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });

    const beQuery = queryMapper({
      filter: {
        label: 'test',
        vendorId,
      },
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 25,
      filterMap: {
        vendorId: {
          fieldName: 'vendorId',
          operator: filterOperators.EQUAL,
        },
        label: {
          fieldName: 'label',
          operator: filterOperators.EQUAL,
        },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/branches',
        query: {
          query: beQuery,
        },
      })
      .response({
        status: 200,
        body: consumerVendorBranchesListingResponseStub(),
      });

    pm.filter.label = 'test';
    await pm.onFilterUpdate();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branches,
      mapBranchesResponseToBranchesItemList(
        consumerVendorBranchesListingResponseStub()
      )
    );
  });

  it('Should show branch code successfully', async function () {
    const vendorId = 123456;
    const branchId = 123456;
    const pm = new BranchListingPM({
      vendorId,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });

    const branchCode = '123456';
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/branches/:branchId/code',
        params: { branchId },
      })
      .response({
        status: 200,
        body: { id: vendorId, code: branchCode },
      });

    $sb
      .stub(BranchRepoImpl.prototype, 'listBranches')
      .resolves(
        mapBranchesResponseToBranchesItemList(
          consumerVendorBranchesListingResponseStub()
        )
      );

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branches,
      mapBranchesResponseToBranchesItemList(
        consumerVendorBranchesListingResponseStub()
      )
    );
    assert.isFalse(pm.shouldOpenBranchCodeDialog);

    await pm.showAccessCode(branchId);
    assert.isTrue(pm.shouldOpenBranchCodeDialog);
    assert.equal(pm.branchCode, branchCode);
  });

  it('Should handle branch code hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 123456;
    const pm = new BranchListingPM({
      vendorId,
      query: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      branchRepo: new BranchRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'retrieveBranchCode')
      .rejects(new Error('anything'));
    $sb
      .stub(BranchRepoImpl.prototype, 'listBranches')
      .resolves(
        mapBranchesResponseToBranchesItemList(
          consumerVendorBranchesListingResponseStub()
        )
      );

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branches,
      mapBranchesResponseToBranchesItemList(
        consumerVendorBranchesListingResponseStub()
      )
    );
    assert.isFalse(pm.shouldOpenBranchCodeDialog);

    await pm.showAccessCode(branchId);
    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
});
