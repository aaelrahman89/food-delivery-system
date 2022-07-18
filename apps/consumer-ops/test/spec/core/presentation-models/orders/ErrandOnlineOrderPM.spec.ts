import { $sb } from '@survv/commons/test/utils/sandbox';
import { CancelErrandOrderPM } from '../../../../../src/core/presentation-models/orders/CancelErrandOrderPM';
import { CancelErrandOrderRepoImpl } from '../../../../../src/shell/repositories/orders/CancelErrandOrderRepoImpl';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { ErrandCategoriesRepoImpl } from '../../../../../src/shell/repositories/orders/ErrandCategoriesRepoImpl';
import {
  ErrandItemForm,
  ErrandStructureForm,
} from '../../../../../src/core/models/ErrandOrderForms';
import { ErrandOnlineOrderPM } from '../../../../../src/core/presentation-models/orders/ErrandOnlineOrderPM';
import {
  ErrandOrder,
  ErrandOrderPickupItem,
} from '../../../../../src/core/models/ErrandOrder';
import { ErrandOrdersRepoImpl } from '../../../../../src/shell/repositories/orders/ErrandOrdersRepoImpl';
import {
  ErrandsOrderJourney,
  ErrandsOrderJourneyStepStatus,
} from '../../../../../src/core/models/ErrandsOrderJourney';
import { ErrandsOrderJourneyRepoImpl } from '../../../../../src/shell/repositories/orders/ErrandsOrderJourneyRepoImpl';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { Money } from '@survv/commons/core/models/money';
import { OrderStatus } from '../../../../../src/core/models/Order';
import { RejectionReasonOrderType } from '../../../../../src/core/models/RejectionReason';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import {
  detectZoneResponseStub,
  errandCategoriesListResponseStub,
  errandOrderCalculationResponseStub,
  errandOrderCoveredZonesResponseStub,
  errandOrderDetailsResponseStub,
  errandOrderJourneyResponseStub,
} from '@survv/api/stubs/errands';
import { errandsOrderRejectionReasonsResponseStub } from '@survv/api/stubs/orders';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import {
  mapCoveredZonesResponseToGeojsonCoordinatesArrays,
  mapDetectedZoneResponseToDetectedZone,
  mapErrandCategoriesListResponseToErrandCategories,
  mapErrandOrderResponseToErrandOrder,
  mapErrandsOrderJourneyResponseToErrandsOrderJourney,
  mapOrderRejectionReasonsResponseToRejectionReasons,
} from '../../../../../src/shell/repositories/orders/mappers/responses';
import {
  mapErrandOrderStructureFormToErrandOrderCalculateRequest,
  mapErrandOrderStructureFormToErrandOrderStructureRequest,
} from '../../../../../src/shell/repositories/orders/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('ErrandOnlineOrderPM', function () {
  describe('structure form operations', async function () {
    it('should handle structure form submitting successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
        .resolves(
          mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );

      const body = mapErrandOrderStructureFormToErrandOrderStructureRequest(
        ErrandStructureForm.from(
          mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub()),
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub()).name
            .en
        )
      );
      await wiremock
        .stub()
        .request({
          requestLine: 'patch /api/v1/orders/errands/:orderId/structure',
          params: { orderId },
          body,
        })
        .response({ status: 200 });

      await pm.init();

      assert.isTrue(pm.errandOrderForm.isValid());
      await pm.errandOrderForm.submit();
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('should handle structure form submitting failure successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
        .resolves(
          mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );

      const error = new LocalError({
        message: 'error',
        code: '404',
      });
      $sb.stub(ErrandOrdersRepoImpl.prototype, 'structureOrder').rejects(error);

      await pm.init();

      assert.isTrue(pm.errandOrderForm.isValid());
      await pm.errandOrderForm.submit();
      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });
  describe('edit form operations', async function () {
    it('should handle edit form submitting successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      const orderStub = errandOrderDetailsResponseStub();
      orderStub.status = 'PILOT_ASSIGNED';

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
        .resolves(mapErrandOrderResponseToErrandOrder(orderStub));
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );

      const body = mapErrandOrderStructureFormToErrandOrderStructureRequest(
        ErrandStructureForm.from(
          mapErrandOrderResponseToErrandOrder(orderStub),
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub()).name
            .en
        )
      );
      await wiremock
        .stub()
        .request({
          requestLine: 'patch /api/v1/orders/errands/:orderId',
          params: { orderId },
          body,
        })
        .response({ status: 200 });

      await pm.init();

      assert.isTrue(pm.errandOrderForm.isValid());
      await pm.errandOrderForm.submit();
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('should handle edit form submitting failure successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      const orderStub = errandOrderDetailsResponseStub();
      orderStub.status = 'PILOT_ASSIGNED';

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
        .resolves(mapErrandOrderResponseToErrandOrder(orderStub));
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );

      const error = new LocalError({
        message: 'error',
        code: '404',
      });
      $sb.stub(ErrandOrdersRepoImpl.prototype, 'editOrder').rejects(error);

      await pm.init();

      assert.isTrue(pm.errandOrderForm.isValid());
      await pm.errandOrderForm.submit();
      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });
  it('should hydrate the order', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/errands/:orderId',
        params: { orderId },
      })
      .response({ status: 200, body: errandOrderDetailsResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
      .response({
        status: 200,
        body: errandOrderJourneyResponseStub(),
      });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.order, order);
  });
  it('should hydrate errand categories selections', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const categoriesListSelection =
      mapErrandCategoriesListResponseToErrandCategories(
        errandCategoriesListResponseStub()
      ).items.map((item) => new FormSelectionOption(item.id, item.displayName));

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/errands/categories',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'archived',
                  operator: 'eq',
                  value: false,
                },
              ],
            },
          },
        },
      })
      .response({ status: 200, body: errandCategoriesListResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
      .response({
        status: 200,
        body: errandOrderJourneyResponseStub(),
      });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.errandCategoriesSelection, categoriesListSelection);
  });
  it("should detect user's zone", async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const detectedZone = mapDetectedZoneResponseToDetectedZone(
      detectZoneResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/zones/detect-zone',
        query: {
          geoPoint: {
            type: 'Point',
            coordinates: [31.457211524248123, 30.00518028593313],
          },
        },
      })
      .response({ status: 200, body: detectZoneResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
      .response({
        status: 200,
        body: errandOrderJourneyResponseStub(),
      });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.userZone, detectedZone);
  });
  it('should hydrate supported zones', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const zoneName = 'Main Menu';

    const supportedZones = mapCoveredZonesResponseToGeojsonCoordinatesArrays(
      errandOrderCoveredZonesResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/errands/covered-zones',
        query: { zoneName },
      })
      .response({ status: 200, body: errandOrderCoveredZonesResponseStub() });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
      .response({
        status: 200,
        body: errandOrderJourneyResponseStub(),
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.mapConfig.supportedZones, supportedZones);
  });
  it('should handle hydration failure successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const error = errorModel({
      code: 'any code',
      message: 'any message',
      args: {
        any: 'args',
      },
    });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .withArgs(orderId)
      .rejects(error);
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'detectZone').resolves();
    $sb.stub(ErrandCategoriesRepoImpl.prototype, 'listCategories').resolves();
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones').resolves();
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should create structure form successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );
    const zoneData = mapDetectedZoneResponseToDetectedZone(
      detectZoneResponseStub()
    );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    await pm.init();

    assert.equal(pm.errandOrderForm.zoneName, zoneData.name.en);
    assert.equal(
      pm.errandOrderForm.pickups[0].categoryId,
      order.orderPickups[0].categoryId
    );
    assert.deepEqual(
      pm.errandOrderForm.pickups[0].coordinates,
      order.orderPickups[0].location.pickupLocation.features[0].geometry
        .coordinates
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].locationName,
      order.orderPickups[0].location.locationDescription
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].includePictures,
      order.orderPickups[0].includePictures
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].includeVoiceNote,
      order.orderPickups[0].includeVoiceNote
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].pickupId,
      order.orderPickups[0].pickupId
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].items[0].name,
      order.orderPickups[0].items[0].name
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].items[0].notes,
      order.orderPickups[0].items[0].notes
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].items[0].brand,
      order.orderPickups[0].items[0].brand
    );
    assert.equal(
      pm.errandOrderForm.pickups[0].items[0].quantity,
      order.orderPickups[0].items[0].quantity
    );
    assert.isTrue(pm.errandOrderForm.isValid());
  });
  it('should handle structure form validation failure successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const order = mapErrandOrderResponseToErrandOrder({
      ...errandOrderDetailsResponseStub(),
      orderPickups: [],
    });
    const zoneData = mapDetectedZoneResponseToDetectedZone(
      detectZoneResponseStub()
    );
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    await pm.init();

    assert.equal(pm.errandOrderForm.zoneName, zoneData.name.en);
    assert.isEmpty(pm.errandOrderForm.pickups);
    assert.isFalse(pm.errandOrderForm.isValid());
  });
  it('should create a variable with non-deleted pickup points only', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    await pm.init();

    assert.deepEqual(
      pm.order.orderPickups.length,
      mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
        .orderPickups.length
    );
    assert.deepEqual(
      pm.nonDeletedPickupPoints.length,
      mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
        .orderPickups.length - 1
    );
  });
  it('should handle structure form calculations successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getOrder')
      .resolves(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    const body = mapErrandOrderStructureFormToErrandOrderCalculateRequest(
      ErrandStructureForm.from(
        mapErrandOrderResponseToErrandOrder(errandOrderDetailsResponseStub()),
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub()).name.en
      )
    );
    await wiremock
      .stub()
      .request({
        requestLine:
          'post /api/v1/orders/errands/:orderId/estimated-delivery-fee',
        params: { orderId },
        body,
      })
      .response({ status: 200, body: errandOrderCalculationResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId },
      })
      .response({
        status: 200,
        body: errandOrderJourneyResponseStub(),
      });

    await pm.init();

    await pm.calculateCharging();
    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.order.tax,
      new Money({
        amount: 300,
        currency: 'EGP',
      })
    );
    assert.deepEqual(
      pm.order.estimatedDeliveryFees,
      new Money({
        amount: 300,
        currency: 'EGP',
      })
    );
  });
  it('should handle structure form calculations failure successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    const error = errorModel({
      code: 'any code',
      message: 'any message',
      args: {
        any: 'args',
      },
    });

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves();
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'detectZone').resolves();
    $sb.stub(ErrandCategoriesRepoImpl.prototype, 'listCategories').resolves();
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones').resolves();
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'calculateCharging')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should hydrate rejection reasons successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );

    const beQuery = queryMapper({
      filter: { orderTypes: [RejectionReasonOrderType.ERRANDS.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.rejectionReasons,
      mapOrderRejectionReasonsResponseToRejectionReasons(
        errandsOrderRejectionReasonsResponseStub()
      )
    );
  });
  it('should search rejection reasons successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      filter: { orderTypes: [RejectionReasonOrderType.ERRANDS.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.searchRejectReasons('closed');
    assert.deepEqual(pm.clonedRejectionReasons, [
      {
        id: 2165529378315486700,
        label: 'Vendor closed',
      },
    ]);

    pm.searchRejectReasons('down');
    assert.deepEqual(pm.clonedRejectionReasons, [
      {
        id: 2165529378315486702,
        label: 'Service is down',
      },
    ]);

    pm.searchRejectReasons('');
    assert.deepEqual(pm.clonedRejectionReasons, [
      {
        id: 2165529378315486700,
        label: 'Vendor closed',
      },
      {
        id: 2165529378315486702,
        label: 'Service is down',
      },
    ]);
  });
  it('should notify failure when rejection reasons hydration fails', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );
    const error = new LocalError({
      code: 'any',
      message: 'any',
    });

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should reject the order successfully', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/errands/:orderId/reject',
        params: { orderId },
        body: {
          rejectionReasonId: 2165529378315486700,
        },
      })
      .response({ status: 200 });

    await pm.init();

    pm.rejectionForm.reasonId = 2165529378315486700;

    assert.isTrue(pm.rejectionForm.submittable);

    await pm.rejectionForm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies failure if no rejection reason is provided', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await pm.init();

    pm.rejectionForm.reasonId = 0;

    assert.isFalse(pm.rejectionForm.submittable);

    await pm.rejectionForm.submit();

    assert.deepEqual(notificationService.notification, badOperation());
  });
  it('notifies failure if rejection action fails', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );
    const error = new LocalError({
      code: 'any',
      message: 'any',
    });

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'rejectOrder').rejects(error);

    await pm.init();

    pm.rejectionForm.reasonId = 123;

    assert.isTrue(pm.rejectionForm.submittable);

    await pm.rejectionForm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it("should set the default coordinates with the client's and check if checkboxes are hidden on newly created pickup orders", async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await pm.init();
    pm.addPickupPoint();
    assert.isFalse(
      pm.shouldShowPickupFormPicturesCheckbox(
        pm.errandOrderForm.pickups[pm.errandOrderForm.pickups.length - 1]
      )
    );
    assert.isFalse(
      pm.shouldShowPickupFormVoiceNoteCheckbox(
        pm.errandOrderForm.pickups[pm.errandOrderForm.pickups.length - 1]
      )
    );

    pm.showMapModal(
      pm.errandOrderForm.pickups[pm.errandOrderForm.pickups.length - 1]
        .coordinates,
      pm.errandOrderForm.pickups.length - 1
    );
    assert.deepEqual(
      pm.mapConfig.point,
      pm.order.customerLocationFeature.geometry
        .coordinates as GeojsonCoordinates
    );
    pm.showMapModal(pm.errandOrderForm.pickups[0].coordinates, 0);
    assert.deepEqual(
      pm.mapConfig.point,
      pm.errandOrderForm.pickups[0].coordinates as GeojsonCoordinates
    );
  });
  it('should change selected pickup point and location name successfully on location edit', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'calculateCharging').resolves();

    await pm.init();
    assert.isFalse(pm.shouldShowMapModal);
    pm.showMapModal(
      [31.457211524248123, 30.00518028593313] as GeojsonCoordinates,
      0
    );
    assert.isTrue(pm.shouldShowMapModal);
    await pm.submitMapModal([1, 1] as GeojsonCoordinates, 'test');
    assert.deepEqual(pm.errandOrderForm.pickups[0].coordinates, [1, 1]);
    assert.deepEqual(pm.errandOrderForm.pickups[0].locationName, 'test');
    assert.isFalse(pm.shouldShowMapModal);
  });
  it('should handle remove pickup points dialog', async function () {
    const orderId = 2165529378315486700;
    const pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });
    const order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );

    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
      .resolves(
        mapErrandsOrderJourneyResponseToErrandsOrderJourney(
          errandOrderJourneyResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'calculateCharging').resolves();

    await pm.init();
    assert.isFalse(pm.shouldShowRemovePickupDialog);
    pm.addPickupPoint();
    const pickupsLengthAfterAdding = pm.errandOrderForm.pickups.length;

    pm.openRemovePickupDialog(pickupsLengthAfterAdding - 1, 'test');
    assert.equal(pm.pickupIndexToRemove, pickupsLengthAfterAdding - 1);
    assert.equal(pm.pickupTitleToRemove, 'test');
    assert.isTrue(pm.shouldShowRemovePickupDialog);

    await pm.removePickupPoint();
    assert.isFalse(pm.shouldShowRemovePickupDialog);
    assert.equal(
      pm.errandOrderForm.pickups.length,
      pickupsLengthAfterAdding - 1
    );
  });
  describe('ErrandsOrderJourney', async function () {
    it('should hydrate errands journey successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/errands/:orderId',
          params: { orderId },
        })
        .response({ status: 200, body: errandOrderDetailsResponseStub() });

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1.1/orders/:orderId/timeline',
          params: { orderId },
        })
        .response({
          status: 200,
          body: {
            orderId: 1234567894125456,
            timelineJourney: [
              {
                journeyStopStatus: 'REQUESTED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {
                  entityId: 2165529378315480,
                  entityName: 'ORDER',
                },
                data: {
                  platform: 'IOS',
                },
              },
              {
                journeyStopStatus: 'CONFIRMED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {
                  id: 2165529378315480,
                  email: 'example@example.com',
                },
                linkedEntity: {},
                data: {},
              },
              {
                journeyStopStatus: 'REJECTED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {
                  id: 2165529378315480,
                  email: 'example@example.com',
                },
                linkedEntity: {},
                data: {},
              },
              {
                journeyStopStatus: 'CANCELLED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {
                  id: 2165529378315480,
                  email: 'example@example.com',
                },
                linkedEntity: {},
                data: {
                  cancellationReason: 'Sample Reason',
                  cancellationReasonCategory: 'Sample Reason Category',
                  refunded: 'true',
                },
              },
              {
                journeyStopStatus: 'PILOT_REQUESTED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {
                  entityId: 2165529378315480,
                  entityName: 'TRIP',
                },
                data: {},
              },
              {
                journeyStopStatus: 'PILOT_ASSIGNED',
                durationInSeconds: 600,
                actionBy: {},
                stopDateTime: '2018-09-05T19:04:53.178Z',
                linkedEntity: {
                  entityId: 2165529378315480,
                  entityName: 'PILOT',
                },
                data: {},
              },
              {
                journeyStopStatus: 'PICKUP',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {
                  entityId: 2165529378315480,
                  entityName: 'PICKUP',
                },
                data: {
                  COLLECTING: '2018-09-05T19:04:53.178Z',
                  COLLECTED: '2018-09-05T19:04:53.178Z',
                  status: 'REQUESTED',
                  name: 'PICKUP1',
                },
              },
              {
                journeyStopStatus: 'PICKUP',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {
                  entityId: 2165529378315481,
                  entityName: 'PICKUP',
                },
                data: {
                  COLLECTING: '2018-09-05T19:04:53.178Z',
                  COLLECTED: '2018-09-05T19:04:53.178Z',
                  status: 'REQUESTED',
                  name: 'PICKUP2',
                },
              },
              {
                journeyStopStatus: 'PICKUP',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {
                  entityId: 2165529378315482,
                  entityName: 'PICKUP',
                },
                data: {
                  COLLECTING: '2018-09-05T19:04:53.178Z',
                  COLLECTED: '2018-09-05T19:04:53.178Z',
                  status: 'REQUESTED',
                  name: 'PICKUP3',
                },
              },
              {
                journeyStopStatus: 'COLLECTED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {},
                data: {},
              },
              {
                journeyStopStatus: 'DELIVERED',
                durationInSeconds: 600,
                stopDateTime: '2018-09-05T19:04:53.178Z',
                actionBy: {},
                linkedEntity: {},
                data: {},
              },
            ],
          },
        });

      await pm.init();
      assert.isUndefined(notificationService.notification);
      assert.deepEqual(
        pm.orderJourney,
        new ErrandsOrderJourney({
          orderId: 1234567894125456,
          orderJourney: [
            {
              stepStatus: ErrandsOrderJourneyStepStatus.REQUESTED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {
                entityId: 2165529378315480,
                entityName: 'ORDER',
              },
              data: { platform: 'IOS' },
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.CONFIRMED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {
                id: 2165529378315480,
                email: 'example@example.com',
              },
              linkedEntity: {},
              data: {},
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.REJECTED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {
                id: 2165529378315480,
                email: 'example@example.com',
              },
              linkedEntity: {},
              data: {},
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.CANCELLED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {
                id: 2165529378315480,
                email: 'example@example.com',
              },
              linkedEntity: {},
              data: {
                cancellationReason: 'Sample Reason',
                cancellationReasonCategory: 'Sample Reason Category',
                refunded: 'true',
              },
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.PILOT_REQUESTED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {
                entityId: 2165529378315480,
                entityName: 'TRIP',
              },
              data: {},
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.PILOT_ASSIGNED,
              actionBy: {},
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              linkedEntity: {
                entityId: 2165529378315480,
                entityName: 'PILOT',
              },
              data: {},
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.PICKUP,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {
                entityId: 2165529378315480,
                entityName: 'PICKUP',
              },
              data: {
                COLLECTING: '2018-09-05T19:04:53.178Z',
                COLLECTED: '2018-09-05T19:04:53.178Z',
                status: 'REQUESTED',
                name: 'PICKUP1',
              },
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.PICKUP,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {
                entityId: 2165529378315481,
                entityName: 'PICKUP',
              },
              data: {
                COLLECTING: '2018-09-05T19:04:53.178Z',
                COLLECTED: '2018-09-05T19:04:53.178Z',
                status: 'REQUESTED',
                name: 'PICKUP2',
              },
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.PICKUP,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {
                entityId: 2165529378315482,
                entityName: 'PICKUP',
              },
              data: {
                COLLECTING: '2018-09-05T19:04:53.178Z',
                COLLECTED: '2018-09-05T19:04:53.178Z',
                status: 'REQUESTED',
                name: 'PICKUP3',
              },
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.COLLECTED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {},
              data: {},
            },
            {
              stepStatus: ErrandsOrderJourneyStepStatus.DELIVERED,
              stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
              actionBy: {},
              linkedEntity: {},
              data: {},
            },
          ],
        })
      );
    });
    it('should notify error on journey hydration failure', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      const error = new LocalError({
        code: 'ERR_TECHNICAL_ERROR',
        message: 'Error',
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/errands/:orderId',
          params: { orderId },
        })
        .response({ status: 200, body: errandOrderDetailsResponseStub() });

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );
      $sb
        .stub(ErrandsOrderJourneyRepoImpl.prototype, 'getErrandsOrderJourney')
        .rejects(error);

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
    it('should structure errand order journey correctly', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/errands/:orderId',
          params: { orderId },
        })
        .response({ status: 200, body: errandOrderDetailsResponseStub() });

      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
        .resolves(
          mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
        );
      $sb
        .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
        .resolves(
          mapErrandCategoriesListResponseToErrandCategories(
            errandCategoriesListResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
        .resolves(
          mapCoveredZonesResponseToGeojsonCoordinatesArrays(
            errandOrderCoveredZonesResponseStub()
          )
        );
      $sb
        .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(
          mapOrderRejectionReasonsResponseToRejectionReasons(
            errandsOrderRejectionReasonsResponseStub()
          )
        );

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1.1/orders/:orderId/timeline',
          params: { orderId },
        })
        .response({
          status: 200,
          body: errandOrderJourneyResponseStub(),
        });

      await pm.init();
      assert.isUndefined(notificationService.notification);
      assert.deepEqual(pm.structuredOrderJourney, [
        {
          stepTitle: 'REQUESTED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [{ name: 'PLATFORM', value: 'IOS' }],
        },
        {
          stepTitle: 'CONFIRMED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [{ name: 'ACCEPTED_BY', value: 'example@example.com' }],
        },
        {
          stepTitle: 'REJECTED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [
            { name: 'REJECTED_BY', value: 'example@example.com' },
            { name: 'REJECTION_REASON', value: 'Illegal Items' },
          ],
        },
        {
          stepTitle: 'CANCELLED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [
            { name: 'CANCELLED_BY', value: 'example@example.com' },
            { name: 'CANCELLATION_REASON', value: 'Sample Reason' },
            {
              name: 'CANCELLATION_REASON_CATEGORY',
              value: 'Sample Reason Category',
            },
            { name: 'REFUNDED', value: 'true' },
          ],
        },
        {
          stepTitle: 'PILOT_REQUESTED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [
            {
              name: 'TRIP_ID',
              value: '2165529378315480',
            },
          ],
        },
        {
          stepTitle: 'PILOT_ASSIGNED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: true,
          extraData: [],
        },
        {
          stepTitle: 'PICKUP',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          pointLabel: 'PICKUP1',
          pickupsCount: 3,
          pickupIndex: 1,
          extraData: [
            {
              name: 'COLLECTING',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
            {
              name: 'COLLECTED',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
          ],
        },
        {
          stepTitle: 'PICKUP',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          pointLabel: 'PICKUP2',
          pickupsCount: 3,
          pickupIndex: 2,
          extraData: [
            {
              name: 'COLLECTING',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
            {
              name: 'COLLECTED',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
          ],
        },
        {
          stepTitle: 'PICKUP',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          pointLabel: 'PICKUP3',
          pickupsCount: 3,
          pickupIndex: 3,
          extraData: [
            {
              name: 'COLLECTING',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
            {
              name: 'COLLECTED',
              value: new Datetime(
                '2018-09-05T19:04:53.178Z'
              ).toDatetimeString(),
            },
          ],
        },
        {
          stepTitle: 'COLLECTED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [],
        },
        {
          stepTitle: 'DELIVERED',
          stepTimeStamp: new Datetime(
            '2018-09-05T19:04:53.178Z'
          ).toDatetimeString(),
          clickable: false,
          extraData: [],
        },
      ]);
    });
  });
  describe('OrderCancellation', async function () {
    it('should not show cancellation action if order status is [REQUESTED,REJECTED,DELIVERED,CANCELLED] ', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/errands/:orderId',
          params: { orderId },
        })
        .response({ status: 200, body: errandOrderDetailsResponseStub() });

      await pm.init();

      pm.order.status = new OrderStatus('REQUESTED');
      assert.equal(pm.shouldShowCancelAction, false);

      pm.order.status = new OrderStatus('REJECTED');
      assert.equal(pm.shouldShowCancelAction, false);

      pm.order.status = new OrderStatus('DELIVERED');
      assert.equal(pm.shouldShowCancelAction, false);

      pm.order.status = new OrderStatus('CANCELLED');
      assert.equal(pm.shouldShowCancelAction, false);

      pm.order.status = new OrderStatus('CONFIRMED');
      assert.equal(pm.shouldShowCancelAction, true);
    });

    it('should submit cancellation form successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });

      $sb.stub(pm, 'refresh').resolves();
      $sb
        .stub(pm.children.cancelErrandOrderPM.cancellationForm, 'submit')
        .resolves();
      $sb.stub(pm.children.cancelErrandOrderPM, 'closeCancelForm').resolves();
      await pm.submitCancellationForm();
      assert.isUndefined(notificationService.notification);
    });

    it('should handle cancellation form submittion error successfully', async function () {
      const orderId = 2165529378315486700;
      const pm = new ErrandOnlineOrderPM({
        orderId,
        notificationService,
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: 2165529378315486700,
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      });
      const error = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });

      $sb.stub(pm, 'refresh').resolves();
      $sb
        .stub(pm.children.cancelErrandOrderPM.cancellationForm, 'submit')
        .rejects(error);
      $sb
        .stub(pm.children.cancelErrandOrderPM, 'closeCancelForm')
        .rejects(error);
      await pm.submitCancellationForm();
      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });
});

describe('ErrandOnlineOrderPM - item form operations', async function () {
  let orderId = 0;
  let pm: ErrandOnlineOrderPM;
  let order: ErrandOrder;
  let emptyItemForm: ErrandItemForm;
  let itemFormStub: ErrandItemForm;

  before(async () => {
    orderId = 2165529378315486700;
    pm = new ErrandOnlineOrderPM({
      orderId,
      notificationService,
      errandOrdersRepo: new ErrandOrdersRepoImpl(),
      errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
      errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
      children: {
        cancelErrandOrderPM: new CancelErrandOrderPM({
          orderId: 2165529378315486700,
          notificationService,
          cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
        }),
      },
    });

    order = mapErrandOrderResponseToErrandOrder(
      errandOrderDetailsResponseStub()
    );
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );

    await pm.init();

    emptyItemForm = new ErrandItemForm();
    itemFormStub = ErrandItemForm.from(
      new ErrandOrderPickupItem(order.orderPickups[0].items[0])
    );
  });

  it('has valid default item form state', function () {
    assert.isFalse(pm.shouldShowAddItemsForm);
    assert.equal(pm.itemFormTitle, '');
    assert.equal(pm.itemForm.name, emptyItemForm.name);
    assert.equal(pm.itemForm.quantity, emptyItemForm.quantity);
    assert.equal(pm.itemForm.notes, emptyItemForm.notes);
    assert.equal(pm.itemForm.brand, emptyItemForm.brand);
    assert.equal(1, pm.errandOrderForm.pickups[0].items.length);
  });
  it('should handle open item form successfully', function () {
    pm.openAddItemsForm('test', 0, pm.errandOrderForm.pickups[0].items[0]);

    assert.isTrue(pm.shouldShowAddItemsForm);
    assert.equal(pm.itemFormTitle, 'test');
    assert.equal(pm.itemForm.name, itemFormStub.name);
    assert.equal(pm.itemForm.quantity, itemFormStub.quantity);
    assert.equal(pm.itemForm.notes, itemFormStub.notes);
    assert.equal(pm.itemForm.brand, itemFormStub.brand);
    assert.equal(1, pm.errandOrderForm.pickups[0].items.length);
  });
  it('should handle close item form successfully', function () {
    pm.closeItemForm();

    assert.isFalse(pm.shouldShowAddItemsForm);
    assert.equal(pm.itemFormTitle, '');
    assert.equal(pm.itemForm.name, emptyItemForm.name);
    assert.equal(pm.itemForm.quantity, emptyItemForm.quantity);
    assert.equal(pm.itemForm.notes, emptyItemForm.notes);
    assert.equal(pm.itemForm.brand, emptyItemForm.brand);
    assert.equal(1, pm.errandOrderForm.pickups[0].items.length);
  });
  it('should handle submit item form successfully', function () {
    pm.submitItemForm();

    assert.equal(2, pm.errandOrderForm.pickups[0].items.length);
    assert.isFalse(pm.shouldShowAddItemsForm);
    assert.equal(pm.itemFormTitle, '');
    assert.equal(pm.itemForm.name, emptyItemForm.name);
    assert.equal(pm.itemForm.quantity, emptyItemForm.quantity);
    assert.equal(pm.itemForm.notes, emptyItemForm.notes);
    assert.equal(pm.itemForm.brand, emptyItemForm.brand);
  });
  it('should handle remove item successfully', async function () {
    $sb.stub(ErrandOrdersRepoImpl.prototype, 'getOrder').resolves(order);
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'detectZone')
      .resolves(
        mapDetectedZoneResponseToDetectedZone(detectZoneResponseStub())
      );
    $sb
      .stub(ErrandCategoriesRepoImpl.prototype, 'listCategories')
      .resolves(
        mapErrandCategoriesListResponseToErrandCategories(
          errandCategoriesListResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getRejectionReasons')
      .resolves(
        mapOrderRejectionReasonsResponseToRejectionReasons(
          errandsOrderRejectionReasonsResponseStub()
        )
      );
    $sb
      .stub(ErrandOrdersRepoImpl.prototype, 'getSupportedZones')
      .resolves(
        mapCoveredZonesResponseToGeojsonCoordinatesArrays(
          errandOrderCoveredZonesResponseStub()
        )
      );

    await pm.init();

    assert.equal(1, pm.errandOrderForm.pickups[0].items.length);

    pm.deleteItem(0, 0);

    assert.equal(0, pm.errandOrderForm.pickups[0].items.length);
  });
});
