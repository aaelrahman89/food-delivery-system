import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchDetailsPM } from '../../../../../src/core/presentation-models/branches/BranchDetailsPM';
import { BranchRepoImpl } from '../../../../../src/shell/repositories/restaurants/branches/BranchRepoImpl';
import { GeoRepoImpl } from '../../../../../src/shell/repositories/geo/GeoRepoImpl';
import { Notification } from '@survv/commons/core/notification/notification';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorStackingConfigurationForm } from '../../../../../src/core/models/VendorStackingConfiguration';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import {
  areasListResponseStub,
  areasListV2ResponseStub,
} from '@survv/api/stubs/areas';
import { assert } from 'chai';
import { cataloguesListResponseStub } from '@survv/api/stubs/catalogues';
import { citiesListV2ResponseStub } from '@survv/api/stubs/cities';
import { consumerVendorBranchDetailsResponseStub } from '@survv/api/stubs/branches';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import {
  mapAreaListingResponseToAreas,
  mapCityListingResponseToCities,
} from '../../../../../src/shell/repositories/geo/mappers/responses';
import { mapBranchResponseToBranchDetails } from '../../../../../src/shell/repositories/restaurants/branches/mappers/responses';
import { mapVendorProfileToOnlineProfile } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('BranchDetailsPM', function () {
  it('Should handle hydration successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });

  it('Should handle vendor profile hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(new Error('anything'));
    $sb.stub(BranchRepoImpl.prototype, 'getBranchDetails').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle branch details hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .rejects(new Error('anything'));
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle branch code hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'getBranchDetails').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'retrieveBranchCode')
      .rejects(new Error('anything'));
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle city hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'getBranchDetails').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb.stub(GeoRepoImpl.prototype, 'getCities').rejects(new Error('anything'));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle area hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'getBranchDetails').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb.stub(GeoRepoImpl.prototype, 'getAreas').rejects(new Error('anything'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should hydrate branch details successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    const mappedBranchStub = mapBranchResponseToBranchDetails(
      consumerVendorBranchDetailsResponseStub()
    );
    const mappedCityStub = mapCityListingResponseToCities(
      citiesListV2ResponseStub()
    );
    const mappedAreaStub = mapAreaListingResponseToAreas(
      areasListResponseStub()
    );
    [mappedBranchStub.city, mappedBranchStub.area] = [
      mappedCityStub[0],
      mappedAreaStub[0],
    ];

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: consumerVendorBranchDetailsResponseStub(),
      });
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));
    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.branchDetails, mappedBranchStub);
  });

  it('Should hydrate vendor profile details successfully', async function () {
    const vendorId = 564465;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
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
          vendorId,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: vendorId,
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
            value: vendorId,
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

    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.vendorOnlineProfile, vendorOnlineProfile);
  });

  it('Should hydrate branch code successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const branchCode = '123456789';

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
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
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.branchCode, branchCode);
  });

  it('Should hydrate branch city successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const mappedBranchDetailsStub = mapBranchResponseToBranchDetails(
      consumerVendorBranchDetailsResponseStub()
    );
    const beQuery = queryMapper({
      filter: {
        id: mappedBranchDetailsStub.address.cityId,
      },
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

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(mappedBranchDetailsStub);
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/cities',
        query: { query: beQuery },
      })
      .response({
        status: 200,
        body: citiesListV2ResponseStub(),
      });
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branchDetails.city,
      mapCityListingResponseToCities(citiesListV2ResponseStub())[0]
    );
  });

  it('Should hydrate branch area successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });
    const mappedBranchDetailsStub = mapBranchResponseToBranchDetails(
      consumerVendorBranchDetailsResponseStub()
    );
    const beQuery = queryMapper({
      filter: {
        id: mappedBranchDetailsStub.address.areaId,
      },
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

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(mappedBranchDetailsStub);
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: { query: beQuery },
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
      });
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branchDetails.area,
      mapAreaListingResponseToAreas(areasListResponseStub())[0]
    );
  });

  it('Should handle stacking form actions successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const stackingFormStub = VendorStackingConfigurationForm.from(
      mapBranchResponseToBranchDetails(
        consumerVendorBranchDetailsResponseStub()
      )
    );

    await pm.init();

    assert.isUndefined(notificationService.notification);

    assert.equal(
      pm.stackingForm.maxStackedOrders,
      stackingFormStub.maxStackedOrders
    );
    assert.equal(
      pm.stackingForm.stackingWindowInMinutes,
      stackingFormStub.stackingWindowInMinutes
    );
    assert.isFalse(pm.shouldShowStackingForm);

    pm.openStackingForm();
    assert.isTrue(pm.shouldShowStackingForm);

    pm.closeStackingForm();
    assert.isFalse(pm.shouldShowStackingForm);

    pm.openStackingForm();
    pm.stackingForm.maxStackedOrders = 27;
    pm.stackingForm.stackingWindowInMinutes = 82;
    assert.equal(pm.stackingForm.maxStackedOrders, 27);
    assert.equal(pm.stackingForm.stackingWindowInMinutes, 82);

    pm.closeStackingForm();
    assert.isFalse(pm.shouldShowStackingForm);
    assert.equal(
      pm.stackingForm.maxStackedOrders,
      stackingFormStub.maxStackedOrders
    );
    assert.equal(
      pm.stackingForm.stackingWindowInMinutes,
      stackingFormStub.stackingWindowInMinutes
    );
  });

  it('Should handle stacking form submitting successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await wiremock
      .stub()
      .request({
        requestLine: 'patch /consumer/api/v1/branches/:branchId/stacking',
        params: { branchId },
        body: {
          maxStackedOrders: 27,
          stackingWindowInMinutes: 82,
        },
      })
      .response({
        status: 200,
      });
    const stackingFormStub = VendorStackingConfigurationForm.from(
      mapBranchResponseToBranchDetails(
        consumerVendorBranchDetailsResponseStub()
      )
    );

    await pm.init();

    assert.isUndefined(notificationService.notification);

    pm.stackingForm.maxStackedOrders = 27;
    pm.stackingForm.stackingWindowInMinutes = 82;
    await pm.submitStackingForm();

    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
    assert.isFalse(pm.shouldShowStackingForm);
    assert.equal(
      pm.stackingForm.maxStackedOrders,
      stackingFormStub.maxStackedOrders
    );
    assert.equal(
      pm.stackingForm.stackingWindowInMinutes,
      stackingFormStub.stackingWindowInMinutes
    );
  });

  it('Should handle stacking form submitting error successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'setStackingConfigurations')
      .rejects(new Error('anything'));

    await pm.init();

    assert.isUndefined(notificationService.notification);

    pm.stackingForm.maxStackedOrders = 27;
    pm.stackingForm.stackingWindowInMinutes = 82;
    await pm.submitStackingForm();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle disable stacking successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await wiremock
      .stub()
      .request({
        requestLine: 'patch /api/v1/branches/:branchId/stacking/disable',
        params: { branchId },
      })
      .response({
        status: 200,
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);

    await pm.disableStacking();
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('Should handle disable stacking errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'disableStacking')
      .rejects(new Error('anything'));

    await pm.init();
    assert.isUndefined(notificationService.notification);

    await pm.disableStacking();
    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle reset branch code successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/branches/:branchId/code-reset',
        params: { branchId },
      })
      .response({
        status: 200,
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);

    await pm.resetBranchCode();
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('Should handle reset branch code errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchDetailsPM({
      vendorId,
      branchId,
      geoRepo: new GeoRepoImpl(),
      branchRepo: new BranchRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb.stub(BranchRepoImpl.prototype, 'retrieveBranchCode').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'resetBranchCode')
      .rejects(new Error('anything'));

    await pm.init();
    assert.isUndefined(notificationService.notification);

    await pm.resetBranchCode();
    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
});
