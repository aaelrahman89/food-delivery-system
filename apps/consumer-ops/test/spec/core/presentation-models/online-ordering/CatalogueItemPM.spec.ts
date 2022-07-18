import { $sb } from '@survv/commons/test/utils/sandbox';
import { AlbumsResponse } from '@survv/api/definitions/albums';
import { CatalogueItemPM } from '../../../../../src/core/presentation-models/online-ordering/CatalogueItemPM';
import { CatalogueItemsRepoImpl } from '../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CataloguesRepoImpl';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import {
  catalogueDetailsResponseStub,
  cataloguesListResponseStub,
} from '@survv/api/stubs/catalogues';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import { itemResponseStub } from '@survv/api/stubs/items';
import {
  mapCatalogueDetailsResponseToCatalogueDetails,
  mapItemResponseToCatalogueItem,
  mapVendorProfileToOnlineProfile,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueItemPM', function () {
  it('hydrates breadcrumbs required models (vendor and catalogue) and catalogueItem for view', async function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    const itemAlbumStub: AlbumsResponse = [...albumsResponseStub(), 99, 11, 77];
    const catalogueItem = mapItemResponseToCatalogueItem(
      itemResponseStub(),
      itemAlbumStub
    );
    const catalogue = mapCatalogueDetailsResponseToCatalogueDetails(
      catalogueDetailsResponseStub()
    );
    const vendorOnlineProfile = mapVendorProfileToOnlineProfile(
      consumerVendorProfileResponseStub(),
      cataloguesListResponseStub(),
      albumsResponseStub()
    );

    $sb.stub(window, 'fetch').resolves({ ok: true } as Response);

    // item stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/items/:itemId',
        params: { itemId: 111 },
      })
      .response({ status: 200, body: itemResponseStub() });
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 111,
          referenceType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE.valueOf(),
        },
      })
      .response({ status: 200, body: itemAlbumStub });

    // vendor stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 333,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 333,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
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
            value: 333,
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

    // catalogue stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 222 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await pm.init();

    assert.isUndefined(
      notificationService.notification,
      'empty notification means no failure occured during init'
    );
    assert.deepEqual(pm.item, catalogueItem);
    assert.deepEqual(pm.catalogue, catalogue);
    assert.deepEqual(pm.vendorProfile, vendorOnlineProfile);
  });
  it('notifies on hydration failure', async function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(CatalogueItemsRepoImpl.prototype, 'getItem').rejects(error);
    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(error);
    $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('deletes an item successfully', async function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    const itemAlbumStub: AlbumsResponse = [...albumsResponseStub(), 99, 11, 77];
    const catalogueItemStub = itemResponseStub();

    $sb.stub(window, 'fetch').resolves({ ok: true } as Response);

    // item stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/items/:itemId',
        params: { itemId: 111 },
      })
      .response({ status: 200, body: itemResponseStub() });
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 111,
          referenceType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE.valueOf(),
        },
      })
      .response({ status: 200, body: itemAlbumStub });

    // vendor stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 333,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 333,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
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
            value: 333,
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

    // catalogue stubs
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 222 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    // delete option stub
    await wiremock
      .stub()
      .request({
        requestLine:
          'delete /consumer/api/v1/catalogues/:catalogueId/items/:itemId/options/:optionId',
        params: {
          catalogueId: 222,
          itemId: 111,
          optionId: catalogueItemStub.options[0].optionId,
        },
      })
      .response({ status: 200 });

    await pm.init();
    await pm.deleteOption(catalogueItemStub.options[0].optionId);

    assert.isUndefined(
      notificationService.notification,
      'empty notification means no failure occurred during init'
    );
  });
  it('notifies on option deletion failure', async function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    const itemAlbumStub: AlbumsResponse = [...albumsResponseStub(), 99, 11, 77];
    const catalogueItem = mapItemResponseToCatalogueItem(
      itemResponseStub(),
      itemAlbumStub
    );

    $sb
      .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
      .resolves(catalogueItem);
    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();
    $sb.stub(CatalogueItemsRepoImpl.prototype, 'deleteOption').rejects(error);

    await pm.init();
    await pm.deleteOption(catalogueItem.options[0].id);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('enables options update and disables item details when switching to options update', function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    pm.switchToOptionsUpdateMode();

    assert.isTrue(pm.shouldShowOptionsUpdate);
    assert.isTrue(pm.shouldDisableItemDetails);
    assert.isFalse(pm.shouldShowOptionsView);
  });
  it('does not disable item details and enables options view by default', function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    assert.isFalse(pm.shouldShowOptionsUpdate);
    assert.isFalse(pm.shouldDisableItemDetails);
    assert.isTrue(pm.shouldShowOptionsView);
  });
  it('does not disable item details and enables options view when switching to options view', function () {
    const pm = new CatalogueItemPM({
      itemId: 111,
      catalogueId: 222,
      vendorId: 333,
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });

    pm.switchToOptionsViewMode();

    assert.isFalse(pm.shouldShowOptionsUpdate);
    assert.isFalse(pm.shouldDisableItemDetails);
    assert.isTrue(pm.shouldShowOptionsView);
  });
});
