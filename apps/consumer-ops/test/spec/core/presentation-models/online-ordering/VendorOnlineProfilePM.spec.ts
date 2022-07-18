import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  DisableVendorStackingRequest,
  DisableVendorStackingResponse,
  SetVendorStackingRequest,
  SetVendorStackingResponse,
} from '@survv/api/definitions/vendors';
import {
  LocalError,
  errorCodes,
  errorModel,
} from '@survv/commons/core/errors/errors';
import { VendorOnlineProfilePM } from '../../../../../src/core/presentation-models/online-ordering/VendorOnlineProfilePM';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import { cataloguesListResponseStub } from '@survv/api/stubs/catalogues';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import { mapVendorProfileToOnlineProfile } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('VendorOnlineProfilePM', function () {
  it('fetches the vendor online profile details successfully', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    const vendorOnlineProfile = mapVendorProfileToOnlineProfile(
      consumerVendorProfileResponseStub(),
      cataloguesListResponseStub(),
      albumsResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 123,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 123,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.vendorOnlineProfile, vendorOnlineProfile);
  });

  it('notifies NotificationService with error on failure', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({
      message: 'testing error',
      code: errorCodes.SERVER_ERROR,
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(errModel);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('sets vendor Stacking successfully', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 123,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 123,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });

    await pm.init();

    await wiremock
      .stub<SetVendorStackingRequest, SetVendorStackingResponse>()
      .request({
        requestLine: 'patch /consumer/api/v1/vendors/:vendorId/stacking',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200 });

    pm.stackingConfigurationForm.stackingWindowInMinutes = 30;
    pm.stackingConfigurationForm.maxStackedOrders = 5;

    await pm.stackingConfigurationForm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('notifies error if set vendor stacking form submission fails', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 123,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 123,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });

    await pm.init();

    const error = new LocalError({
      message: 'Form Submission failed',
      code: 'BAD_OPERATION',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'setVendorStacking')
      .rejects(error);

    await pm.stackingConfigurationForm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('disables vendor stacking stacking successfully', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 123,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 123,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });

    await pm.init();

    await wiremock
      .stub<DisableVendorStackingRequest, DisableVendorStackingResponse>()
      .request({
        requestLine:
          'patch /consumer/api/v1/vendors/:vendorId/stacking/disable',
        params: { vendorId: 123 },
      })
      .response({ status: 200 });

    await pm.disableVendorStacking();

    assert.isUndefined(notificationService.notification);
  });

  it('notifies error if disabling vendor stacking fails', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 123,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 123,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });

    await pm.init();

    const error = new LocalError({
      message: 'Error',
      code: 'ERR_TECHNICAL_ERROR',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'disableVendorStacking')
      .rejects(error);

    await pm.disableVendorStacking();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should open stacking configuration form', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    pm.openStackingConfigurationBottomSheet();

    assert.isTrue(pm.shouldShowStackingConfigurationBottomSheet);
  });

  it('should close stacking configuration form', async function () {
    const pm = new VendorOnlineProfilePM({
      vendorId: 123,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    pm.closeStackingConfigurationBottomSheet();

    assert.isFalse(pm.shouldShowStackingConfigurationBottomSheet);
  });
});
