import { $sb } from '@survv/commons/test/utils/sandbox';
import { CatalogueItemsRepoImpl } from '../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import {
  ConsumerOrderRequest,
  ConsumerOrderResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderItem as OrderItemDefinition,
  OrderUpdateRequest,
  OrderUpdateResponse,
} from '@survv/api/definitions/orders';
import { EditOnlineOrderPM } from '../../../../../src/core/presentation-models/orders/EditOnlineOrderPM';
import {
  ItemOptionSelection,
  ItemsListRequest,
  ItemsListResponse,
  ItemsListResponseItem,
} from '@survv/api/definitions/items';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
  OrderStatus,
} from '../../../../../src/core/models/Order';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { ReferralDiscountType } from '../../../../../src/core/models/Referral';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { itemsListResponseStub } from '@survv/api/stubs/items';
import { mapItemsListResponseToCatalogueItemsList } from '../../../../../src/shell/repositories/catalogues/mappers/responses';
import {
  mapOrderResponseToOrder,
  mapOrderToOrderCalculationRequest,
  mapOrderToOrderUpdateRequest,
} from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { orderDetailsResponseStub } from '@survv/api/stubs/orders';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('EditOnlineOrderPM', function () {
  describe('initialization', function () {
    it('should hydrate the order', async function () {
      const randomOrderId = 89742;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder(orderDetailsResponseStub());

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);

      await pm.init();

      assert.isUndefined(notificationService.notification);
      assert.deepEqual(pm.order, order);
    });
    it('should notify the failure if hydrating the order failed', async function () {
      const randomOrderId = 89742;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .rejects(anErrorModel);

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
  });

  describe('starting an order update', function () {
    it('should enable the edit mode on order update start', async function () {
      const randomOrderId = 89742;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsResponseStub()));
      await pm.init();

      pm.onOrderUpdateStart();

      assert.isTrue(pm.isEditMode);
    });
  });

  describe('selecting an order item index for update', function () {
    it('should set the selected order item and provide it for existing item customization bottom sheet', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      pm.onOrderItemUpdateStart(1);

      assert.equal(pm.selectedOrderItem.itemId, secondOrderItemId);
      assert.deepEqual(pm.selectedOrderItem, order.items[1]);
    });
    it('should show the bottom sheet for existing item customization', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      pm.onOrderItemUpdateStart(1);

      assert.isTrue(pm.shouldShowExistingItemCustomization);
    });
  });

  describe('cancelling the update of a selected order item', function () {
    it('should hide the bottom sheet for existing item customization', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      pm.onOrderItemUpdateCancellation();

      assert.isFalse(pm.shouldShowExistingItemCustomization);
    });
  });

  describe('finishing the update of a selected order item', function () {
    it('should update the order item', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8001, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      const updateFinishPromise = pm.onOrderItemUpdateFinish(customizedItem);

      assert.deepEqual(pm.order, updatedOrder);
      await updateFinishPromise;
    });
    it('should recalculate the order', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8001, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
        tax: new Money({ amount: 8001, currency: 'EGP' }),
        deliveryTax: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemUpdateFinish(customizedItem);

      assert.deepEqual(pm.order, calculatedOrder);
    });
    it('should hide the bottom sheet for existing item customization', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8001, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemUpdateFinish(customizedItem);

      assert.isFalse(pm.shouldShowExistingItemCustomization);
    });
    it('should notify the failure if recalculating the order failed', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .rejects(anErrorModel);

      await pm.onOrderItemUpdateFinish(customizedItem);

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
    it('should not hide the bottom sheet for existing item customization on recalculation failure ', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .rejects(anErrorModel);

      await pm.onOrderItemUpdateFinish(customizedItem);

      assert.isTrue(pm.shouldShowExistingItemCustomization);
    });
  });

  describe('starting new order item addition', function () {
    it('should hydrate the catalogue items list with the available items', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
              archived: false,
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
              archived: {
                fieldName: 'archived',
                operator: filterOperators.EQUAL,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      assert.deepEqual(pm.catalogueItemsList, branchItemsList.items);
    });
    it('should show the bottom sheet for catalogue items list', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      assert.isTrue(pm.shouldShowCatalogueItemsList);
    });
    it('should notify the failure when hydrating the catalogue items list fail', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .rejects(anErrorModel);
      await pm.onOrderItemAdditionStart();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
    it('should show the bottom sheet for catalogue items list when its hydration fails ', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .rejects(anErrorModel);
      await pm.onOrderItemAdditionStart();

      assert.isTrue(pm.shouldShowCatalogueItemsList);
    });
  });

  describe('closing the catalogue items list bottom sheet', function () {
    it('should hide the bottom sheet for catalogue items list', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .rejects(anErrorModel);
      await pm.onOrderItemAdditionStart();

      await pm.onCatalogueItemsListClose();

      assert.isFalse(pm.shouldShowCatalogueItemsList);
    });
  });

  describe('selecting a catalogue item to be added to the order', function () {
    it('should set the selected catalogue item and provide it for the new item customization bottom sheet ', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      assert.deepEqual(pm.selectedCatalogueItem, selectedCatalogueItem);
    });
    it('should hide the bottom sheet for catalogue items list', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      assert.isFalse(pm.shouldShowCatalogueItemsList);
    });
    it('should show the bottom sheet for new item customization', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      assert.isTrue(pm.shouldShowNewItemCustomization);
    });
  });

  describe('searching catalogue items list event handler', function () {
    it('should search the english item name in a trimmed, case-insensitive manner', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
            displayName: {
              en: 'First Item',
              ar: 'العنصر الأول',
            },
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
            displayName: {
              en: 'Second Item',
              ar: 'العنصر الثاني',
            },
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
              archived: false,
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
              archived: {
                fieldName: 'archived',
                operator: filterOperators.EQUAL,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      // spaces are intentional
      const searchString = '  second ITEM    ';
      await pm.onCatalogueItemsSearch(searchString);

      assert.lengthOf(pm.catalogueItemsList, 1);
      assert.deepEqual(pm.catalogueItemsList[0].id, secondBranchItemId);
    });
    it('should search arabic item name in a trimmed manner', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
            displayName: {
              en: 'First Item',
              ar: 'العنصر الأول',
            },
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
            displayName: {
              en: 'Second Item',
              ar: 'العنصر الثاني',
            },
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
              archived: false,
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
              archived: {
                fieldName: 'archived',
                operator: filterOperators.EQUAL,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();

      // spaces are intentional
      const searchString = '  العنصر الأول    ';
      await pm.onCatalogueItemsSearch(searchString);

      assert.lengthOf(pm.catalogueItemsList, 1);
      assert.deepEqual(pm.catalogueItemsList[0].id, firstBranchItemId);
    });
    it('should return all the items list if the search string was an empty string after trimming', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
            displayName: {
              en: 'First Item',
              ar: 'العنصر الأول',
            },
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
            displayName: {
              en: 'Second Item',
              ar: 'العنصر الثاني',
            },
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
              archived: false,
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
              archived: {
                fieldName: 'archived',
                operator: filterOperators.EQUAL,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      await pm.onCatalogueItemsSearch('  العنصر الأول    ');

      await pm.onCatalogueItemsSearch('   ');

      assert.deepEqual(pm.catalogueItemsList, branchItemsList.items);
    });
  });

  describe('cancelling the addition of a new order item', function () {
    it('should hide the bottom sheet for new item customization', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
            displayName: {
              en: 'First Item',
              ar: 'العنصر الأول',
            },
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
            displayName: {
              en: 'Second Item',
              ar: 'العنصر الثاني',
            },
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      await pm.onOrderItemAdditionCancellation();

      assert.isFalse(pm.shouldShowNewItemCustomization);
    });
    it('should show the bottom sheet for catalogue items list', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsStub));
      await pm.init();
      pm.onOrderUpdateStart();
      const firstBranchItemId = 1234;
      const secondBranchItemId = 5678;
      const [branchItemsListItem] = itemsListResponseStub().items;
      const branchItemsList = mapItemsListResponseToCatalogueItemsList({
        ...itemsListResponseStub(),
        items: [
          {
            ...branchItemsListItem,
            itemId: firstBranchItemId,
            displayName: {
              en: 'First Item',
              ar: 'العنصر الأول',
            },
          },
          {
            ...branchItemsListItem,
            itemId: secondBranchItemId,
            displayName: {
              en: 'Second Item',
              ar: 'العنصر الثاني',
            },
          },
        ],
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      await pm.onOrderItemAdditionCancellation();

      assert.isTrue(pm.shouldShowCatalogueItemsList);
    });
  });

  describe('finishing the addition of a new order item', function () {
    it('should add the new item', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      const addedItemId = 12975566335;
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemId,
        quantity: 3,
        options: [
          OrderItemOption.copyWith(new OrderItemOption(), {
            optionId: 6515,
            selections: [
              OrderItemOptionSelection.copyWith(
                new OrderItemOptionSelection(),
                {
                  quantity: 3,
                  selectionId: 4498156,
                }
              ),
            ],
          }),
        ],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [...order.items, addedItem],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      const itemAdditionPromise = pm.onOrderItemAdditionFinish(addedItem);
      assert.deepEqual(pm.order, updatedOrder);

      await itemAdditionPromise;
    });
    it('should recalculate the order', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      const addedItemId = 12975566335;
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemId,
        quantity: 3,
        options: [
          OrderItemOption.copyWith(new OrderItemOption(), {
            optionId: 6515,
            selections: [
              OrderItemOptionSelection.copyWith(
                new OrderItemOptionSelection(),
                {
                  quantity: 3,
                  selectionId: 4498156,
                }
              ),
            ],
          }),
        ],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [...order.items, addedItem],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemAdditionFinish(addedItem);

      assert.deepEqual(pm.order, calculatedOrder);
    });
    it('should hide the bottom sheet for new item customization', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      const addedItemId = 12975566335;
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemId,
        quantity: 3,
        options: [
          OrderItemOption.copyWith(new OrderItemOption(), {
            optionId: 6515,
            selections: [
              OrderItemOptionSelection.copyWith(
                new OrderItemOptionSelection(),
                {
                  quantity: 3,
                  selectionId: 4498156,
                }
              ),
            ],
          }),
        ],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [...order.items, addedItem],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemAdditionFinish(addedItem);

      assert.isFalse(pm.shouldShowExistingItemCustomization);
    });
    it('notify the failure if recalculating the order failed', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      const addedItemId = 12975566335;
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemId,
        quantity: 3,
        options: [
          OrderItemOption.copyWith(new OrderItemOption(), {
            optionId: 6515,
            selections: [
              OrderItemOptionSelection.copyWith(
                new OrderItemOptionSelection(),
                {
                  quantity: 3,
                  selectionId: 4498156,
                }
              ),
            ],
          }),
        ],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [...order.items, addedItem],
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .rejects(anErrorModel);

      await pm.onOrderItemAdditionFinish(addedItem);

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
    it('should show the bottom sheet for new item customization when the order recalculation fails', async function () {
      const randomOrderId = 12318759;
      const randomBranchId = 879060;
      const randomVendorId = 279932;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
      });
      const orderDetailsStub = orderDetailsResponseStub();
      orderDetailsStub.branchId = randomBranchId;
      orderDetailsStub.vendorId = randomVendorId;
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();
      const branchItemsList = mapItemsListResponseToCatalogueItemsList(
        itemsListResponseStub()
      );
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'listItems')
        .withArgs(
          queryMapper({
            filter: {
              vendorId: randomVendorId,
              branchId: [randomBranchId],
            },
            filterMap: {
              vendorId: {
                fieldName: 'vendorId',
                operator: filterOperators.EQUAL,
              },
              branchId: {
                fieldName: 'unavailableBranches',
                operator: filterOperators.NOT_IN,
              },
            },
          })
        )
        .resolves(branchItemsList);
      await pm.onOrderItemAdditionStart();
      const [, selectedCatalogueItem] = pm.catalogueItemsList;
      await pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);

      const addedItemId = 12975566335;
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemId,
        quantity: 3,
        options: [
          OrderItemOption.copyWith(new OrderItemOption(), {
            optionId: 6515,
            selections: [
              OrderItemOptionSelection.copyWith(
                new OrderItemOptionSelection(),
                {
                  quantity: 3,
                  selectionId: 4498156,
                }
              ),
            ],
          }),
        ],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [...order.items, addedItem],
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .rejects(anErrorModel);

      await pm.onOrderItemAdditionFinish(addedItem);

      assert.isTrue(pm.shouldShowNewItemCustomization);
    });
  });

  describe('removing an order item at a given index', function () {
    it('should remove the item at a given index', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 1;
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      const removalPromise = pm.onOrderItemRemoval(removalIndex);

      assert.deepEqual(pm.order, updatedOrder);

      await removalPromise;
    });
    it('should recalculate the order', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 1;
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemRemoval(removalIndex);

      assert.deepEqual(pm.order, calculatedOrder);
    });
    it('notify the failure if recalculating the order failed', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 1;
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], order.items[2]],
      });

      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .rejects(anErrorModel);

      await pm.onOrderItemRemoval(removalIndex);

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
  });

  describe('cancelling an order update', function () {
    it('should disable the edit mode on order update cancellation', async function () {
      const randomeOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomeOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomeOrderId)
        .resolves(mapOrderResponseToOrder(orderDetailsResponseStub()));
      await pm.init();
      pm.onOrderUpdateStart();

      pm.onOrderUpdateCancellation();

      assert.isFalse(pm.isEditMode);
    });
    it('should reset the order to default order', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(defaultOrder);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 1;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[0], defaultOrder.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8715, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      await pm.onOrderItemRemoval(removalIndex);

      pm.onOrderUpdateCancellation();

      assert.deepEqual(pm.order, defaultOrder);
    });
  });

  describe('ability to save the changes', function () {
    it('should be disabled the the order has not items', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(defaultOrder);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 0, currency: 'EGP' }),
        total: new Money({ amount: 0, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemRemoval(removalIndex);

      assert.isEmpty(pm.order.items);
      assert.isFalse(pm.canSaveChanges);
    });
    it('should be enabled of the order has at least one item', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(defaultOrder);
      await pm.init();
      pm.onOrderUpdateStart();

      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemRemoval(removalIndex);

      assert.isNotEmpty(pm.order.items);
      assert.isTrue(pm.canSaveChanges);
    });
  });

  describe('finishing an order update', function () {
    it('should save the order updates', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      const stubForUpdateOrderRepoMethod = $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      $sb.assert.calledOnceWithExactly(
        stubForUpdateOrderRepoMethod,
        calculatedOrder
      );
    });
    it('should disable the edit mode', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.isFalse(pm.isEditMode);
    });
    it('should re-hydrate the viewed order', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.deepEqual(pm.order, systemUpdatedOrder);
    });
    it('should notify the success of the operation', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('should notify the failure if saving the updates failed', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .rejects(anErrorModel);

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
    it('should not disable the edit mode of saving the updates failed', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const systemUpdatedOrder = Order.copyWith(calculatedOrder, {
        status: OrderStatus.CONFIRMED,
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .resolves(systemUpdatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .rejects(anErrorModel);

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.isTrue(pm.isEditMode);
    });
    it('should notify the failure if saving the updates failed', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .rejects(anErrorModel);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
    it('should disable the edit mode when re-hydrating the viewed order fails', async function () {
      const randomOrderId = 12318759;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrder = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
      });
      const removalIndex = 0;
      const updatedOrder = Order.copyWith(defaultOrder, {
        items: [defaultOrder.items[1]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 555, currency: 'EGP' }),
        total: new Money({ amount: 666, currency: 'EGP' }),
      });
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .onFirstCall()
        .resolves(defaultOrder)
        .onSecondCall()
        .rejects(anErrorModel);
      $sb
        .stub(OrdersRepoImpl.prototype, 'updateOrder')
        .withArgs(calculatedOrder)
        .resolves();

      await pm.init();
      pm.onOrderUpdateStart();
      await pm.onOrderItemRemoval(removalIndex);
      await pm.onOrderUpdateFinish();

      assert.isFalse(pm.isEditMode);
    });
  });

  describe('onOrderStatusUpdated', function () {
    it('should re-hydrate the viewed order', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(123)
        .resolves(mapOrderResponseToOrder(orderDetailsResponseStub()));

      await pm.onOrderStatusUpdated();

      assert.deepEqual(
        pm.order,
        mapOrderResponseToOrder(orderDetailsResponseStub())
      );
    });

    it('notifies error if failed', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });

      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(123)
        .rejects(anErrorModel);

      await pm.onOrderStatusUpdated();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
  });

  describe('integration', function () {
    it('should work', async function () {
      const randomOrderId = 12318759;
      const randomVendorId = 279932;
      const branchId = 75511;
      const firstOrderItemId = 1234;
      const secondOrderItemId = 89751;
      const addedItemId = 12975566335;
      const addedItemOptionId = 18927;
      const addedItemOptionSelectionId = 871;
      const itemsListStub = itemsListResponseStub();
      const selectedCatalogueItemStub: ItemsListResponseItem = {
        ...itemsListStub.items[0],
        itemId: addedItemId,
      };
      const selectedItemOptionStub = {
        ...selectedCatalogueItemStub.options[0],
        optionId: addedItemOptionId,
      };
      const selectedOptionSelectionStub: ItemOptionSelection = {
        ...selectedItemOptionStub.selections[0],
        id: addedItemOptionSelectionId,
      };
      const addedItemStub: OrderItemDefinition = {
        totalPrice: selectedCatalogueItemStub.price,
        quantity: 4,
        available: false,
        options: [
          {
            optionId: selectedItemOptionStub.optionId,
            title: selectedItemOptionStub.title,
            selections: [
              {
                selectionId: selectedOptionSelectionStub.id,
                title: selectedOptionSelectionStub.title,
                quantity: 4,
                available: false,
                price: selectedOptionSelectionStub.price,
              },
            ],
          },
        ],
        itemId: selectedCatalogueItemStub.itemId,
        notes: '',
        audioId: 0,
        orderItemId: 0,
        orderItemPhotoIds: [],
        price: selectedCatalogueItemStub.price,
        title: selectedCatalogueItemStub.displayName,
      };
      const addedItem = OrderItem.copyWith(new OrderItem(), {
        itemId: addedItemStub.itemId,
        quantity: addedItemStub.quantity,
        options: addedItemStub.options.map((option) => ({
          title: new MultilingualString(option.title),
          optionId: option.optionId,
          selections: option.selections.map(
            (selection) =>
              new OrderItemOptionSelection({
                price: new Money(selection.price),
                quantity: selection.quantity,
                title: new MultilingualString(selection.title),
                selectionId: selection.selectionId,
                relatedOptions: [],
                isAvailable: selection.available,
              })
          ),
        })),
      });
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const defaultOrderStub: ConsumerOrderResponse = {
        ...orderDetailsResponseStub(),
        orderId: randomOrderId,
        vendorId: randomVendorId,
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
        ],
        branchId,
      };
      const updatedOrderStub: ConsumerOrderResponse = {
        ...defaultOrderStub,
        items: [...defaultOrderStub.items, addedItemStub],
      };
      const calculatedOrderStub: ConsumerOrderResponse = {
        ...updatedOrderStub,
        subTotal: { amount: 255, currency: 'EGP' },
        total: { amount: 366, currency: 'EGP' },
      };

      const updatedOrder = mapOrderResponseToOrder(updatedOrderStub);
      const calculatedOrder = mapOrderResponseToOrder(calculatedOrderStub);
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      await wiremock
        .stub<ConsumerOrderRequest, ConsumerOrderResponse>()
        .request({
          requestLine: 'get /consumer/api/v1/orders/:orderId',
          params: { orderId: randomOrderId },
        })
        .response({
          status: 200,
          body: defaultOrderStub,
        });
      await wiremock
        .stub<ItemsListRequest, ItemsListResponse>()
        .request({
          requestLine: 'get /consumer/api/v1/items',
          query: {
            query: queryMapper({
              filter: {
                vendorId: randomVendorId,
                branchId: [branchId],
                archived: false,
              },
              filterMap: {
                vendorId: {
                  fieldName: 'vendorId',
                  operator: filterOperators.EQUAL,
                },
                branchId: {
                  fieldName: 'unavailableBranches',
                  operator: filterOperators.NOT_IN,
                },
                archived: {
                  fieldName: 'archived',
                  operator: filterOperators.EQUAL,
                },
              },
            }),
          },
        })
        .response({
          status: 200,
          body: itemsListStub,
        });
      await wiremock
        .stub<OrderCalculationRequest, OrderCalculationResponse>()
        .request({
          requestLine: 'post /api/v1/orders/:orderId/b2c-order-prices',
          params: { orderId: randomOrderId },
          body: mapOrderToOrderCalculationRequest(updatedOrder),
        })
        .response({
          status: 200,
          body: {
            // we don't need the items, it could be empty
            items: [],
            deliveryFees: calculatedOrderStub.deliveryFees,
            orderId: calculatedOrderStub.orderId,
            subTotal: calculatedOrderStub.subTotal,
            tax: calculatedOrderStub.tax,
            deliveryFeesTax: calculatedOrderStub.deliveryFeesTax,
            subTotalTax: calculatedOrderStub.subTotalTax,
            vendorTaxStatus: calculatedOrderStub.vendorTaxStatus,
            total: calculatedOrderStub.total,
            totalDueAmount: calculatedOrderStub.totalDueAmount,
            refereeImpact: { amount: 31.01, currency: 'EGP' },
            serviceFeeWithTax: { amount: 31.01, currency: 'EGP' },
            promoCodeImpact: defaultOrderStub.promoCode.definition.value,
            promoCodeMinSpendingShortage: {
              amount: 0,
              currency: 'EGP',
            },
            promoCodeStillValid: true,
            referralCodeMinSpendingShortage: {
              amount: 0,
              currency: 'EGP',
            },
            referralCodeStillValid: true,
          },
        });
      await wiremock
        .stub<OrderUpdateRequest, OrderUpdateResponse>()
        .request({
          requestLine: 'put /api/v1/orders/:orderId/b2c-order',
          params: { orderId: randomOrderId },
          body: mapOrderToOrderUpdateRequest(calculatedOrder),
        })
        .response({
          status: 200,
        });

      await pm.init();
      assert.isUndefined(notificationService.notification);

      pm.onOrderUpdateStart();
      await pm.onOrderItemAdditionStart();
      assert.isUndefined(notificationService.notification);

      const [selectedCatalogueItem] = pm.catalogueItemsList;
      pm.onItemSelectionFromCatalogueItemsList(selectedCatalogueItem);
      await pm.onOrderItemAdditionFinish(addedItem);
      assert.isUndefined(notificationService.notification);

      await pm.onOrderUpdateFinish();
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
  });

  context('showing/hiding promo code details', function () {
    it('shows promo code percentage if promo code type was percentage', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'FIXED_VALUE';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodePercentage);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'PERCENTAGE';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodePercentage);
    });
    it('shows promo code cap if promo code type was percentage', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'FIXED_VALUE';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeCap);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'PERCENTAGE';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeCap);
    });
    it('shows promo code value if promo code type was fixed value', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'PERCENTAGE';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeValue);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'FIXED_VALUE';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeValue);
    });
    it('shows promo code calculation type if order type was not NONE', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'PERCENTAGE';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeCalculationType);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'FIXED_VALUE';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeCalculationType);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.type = 'NONE';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeCalculationType);
    });
    it('shows promo code details if order had promo code', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.id = 0;

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeDetails);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.id = 1234;

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeDetails);
    });
    it('shows promo code discount if order had discount promo code', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.usage = 'CASH_BACK';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeDiscountAmount);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.usage = 'DISCOUNT';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeDiscountAmount);
    });
    it('shows promo code cashback if order had cashback promo code', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.usage = 'DISCOUNT';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowPromoCodeCashbackAmount);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.promoCode.definition.usage = 'CASH_BACK';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowPromoCodeCashbackAmount);
    });
  });

  it('shows delivery vat only if it was not zero', async function () {
    const pm = new EditOnlineOrderPM({
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      orderId: 123,
    });
    let orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.deliveryFeesTax = { amount: 0, currency: 'EGP' };

    const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isFalse(pm.shouldShowDeliveryTax);

    orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.deliveryFeesTax = { amount: 30, currency: 'EGP' };

    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isTrue(pm.shouldShowDeliveryTax);
  });

  it('shows service fee with tax only if it was not zero', async function () {
    const pm = new EditOnlineOrderPM({
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      orderId: 123,
    });
    let orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.serviceFeeWithTax = { amount: 0, currency: 'EGP' };

    const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isFalse(pm.shouldShowServiceFeeWithTax);

    orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.serviceFeeWithTax = { amount: 50, currency: 'EGP' };

    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isTrue(pm.shouldShowServiceFeeWithTax);
  });

  it('shows order tax only if vendor tax was not not-applicable', async function () {
    const pm = new EditOnlineOrderPM({
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      orderId: 123,
    });
    let orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.vendorTaxStatus = 'NONE';

    const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isFalse(pm.shouldShowOrderTax);

    orderResponseStub = orderDetailsResponseStub();
    orderResponseStub.vendorTaxStatus = 'INCLUDED';

    orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

    await pm.init();

    assert.isTrue(pm.shouldShowOrderTax);
  });

  context('showing/hiding referral code details', async function () {
    it('shows referral code details if there is a referral code on the order', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });

      const orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.referralCode = {
        definition: {
          id: 12345,
          name: 'TEST50X',
          refereePercentage: 25,
          refereeCap: { amount: 50, currency: 'EGP' },
          referrerAmount: { amount: 500, currency: 'EGP' },
          refereeMinSpending: { amount: 500, currency: 'EGP' },
          refereeFixedValue: { amount: 50, currency: 'EGP' },
          refereeDiscountType: 'FIXED_VALUE',
        },
        impact: {
          refereeImpact: { amount: 50, currency: 'EGP' },
          referrerImpact: { amount: 50, currency: 'EGP' },
          referralUsageId: 12345,
          referrerId: 12345,
        },
        valid: true,
      };

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));
      await pm.init();
      assert.isTrue(pm.shouldShowReferralCodeDetails);
    });
    it('hides referral code details if there is no referral code on the order', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });

      const orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.referralCode = {
        definition: {
          id: 0,
          name: '',
          refereePercentage: 0,
          refereeCap: { amount: 0, currency: 'EGP' },
          referrerAmount: { amount: 0, currency: 'EGP' },
          refereeMinSpending: { amount: 500, currency: 'EGP' },
          refereeFixedValue: { amount: 50, currency: 'EGP' },
          refereeDiscountType: 'FIXED_VALUE',
        },
        impact: {
          refereeImpact: { amount: 0, currency: 'EGP' },
          referrerImpact: { amount: 0, currency: 'EGP' },
          referralUsageId: 0,
          referrerId: 0,
        },
        valid: false,
      };

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));
      await pm.init();
      assert.isFalse(pm.shouldShowReferralCodeDetails);
    });
    it('re-calculates referee discount amount if there is a change in the order', async function () {
      const randomOrderId = 12318759;
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: randomOrderId,
      });
      const firstOrderItemId = 1234;
      const secondOrderItemId = 5678;
      const thirdOrderItemId = 8941;
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: firstOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: secondOrderItemId,
          },
          {
            ...orderDetailsItemStub,
            itemId: thirdOrderItemId,
          },
        ],
        referralCode: {
          definition: {
            id: 12345,
            name: 'TEST50X',
            refereePercentage: 25,
            refereeCap: { amount: 50, currency: 'EGP' },
            referrerAmount: { amount: 500, currency: 'EGP' },
            refereeMinSpending: { amount: 500, currency: 'EGP' },
            refereeFixedValue: { amount: 50, currency: 'EGP' },
            refereeDiscountType: 'FIXED_VALUE',
          },
          impact: {
            refereeImpact: { amount: 50, currency: 'EGP' },
            referrerImpact: { amount: 50, currency: 'EGP' },
            referralUsageId: 12345,
            referrerId: 12345,
          },
          valid: true,
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .withArgs(randomOrderId)
        .resolves(order);

      await pm.init();
      pm.onOrderUpdateStart();
      pm.onOrderItemUpdateStart(1);

      const customizedOption = OrderItemOption.copyWith(
        pm.selectedOrderItem.options[0],
        {
          selections: [
            OrderItemOptionSelection.copyWith(new OrderItemOptionSelection(), {
              selectionId: 888,
              quantity: 1,
            }),
          ],
        }
      );
      const customizedItem = OrderItem.copyWith(pm.selectedOrderItem, {
        options: [customizedOption],
      });
      const updatedOrder = Order.copyWith(order, {
        items: [order.items[0], customizedItem, order.items[2]],
      });
      const calculatedOrder = Order.copyWith(updatedOrder, {
        subTotal: new Money({ amount: 8001, currency: 'EGP' }),
        total: new Money({ amount: 8001, currency: 'EGP' }),
        referralCode: {
          id: 12345,
          name: 'TEST50X',
          refereePercentage: 25,
          refereeCap: new Money({ amount: 50, currency: 'EGP' }),
          refereeDiscountAmount: new Money({ amount: 30, currency: 'EGP' }),
          minSpendingShortage: new Money({ amount: 500, currency: 'EGP' }),
          fixedDiscountAmount: new Money({ amount: 500, currency: 'EGP' }),
          discountType: new ReferralDiscountType('FIXED_VALUE'),
          minimumOrderAmount: new Money({ amount: 50, currency: 'EGP' }),
          valid: true,
        },
      });
      $sb
        .stub(OrdersRepoImpl.prototype, 'calculateOrder')
        .withArgs(updatedOrder)
        .resolves(calculatedOrder);

      await pm.onOrderItemUpdateFinish(customizedItem);

      assert.deepEqual(pm.order, calculatedOrder);
    });
    it('should show referral code fixed discount value if discount type is FIXED_VALUE', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });

      const orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.referralCode = {
        definition: {
          id: 12345,
          name: 'TEST50X',
          refereePercentage: 25,
          refereeCap: { amount: 50, currency: 'EGP' },
          referrerAmount: { amount: 500, currency: 'EGP' },
          refereeMinSpending: { amount: 500, currency: 'EGP' },
          refereeFixedValue: { amount: 50, currency: 'EGP' },
          refereeDiscountType: 'FIXED_VALUE',
        },
        impact: {
          refereeImpact: { amount: 50, currency: 'EGP' },
          referrerImpact: { amount: 50, currency: 'EGP' },
          referralUsageId: 12345,
          referrerId: 12345,
        },
        valid: true,
      };

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));
      await pm.init();
      assert.isTrue(pm.shouldShowRefereeFixedDiscount);
    });
    it('should show referee percentage if discount type is PERCENTAGE', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });

      const orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.referralCode = {
        definition: {
          id: 12345,
          name: 'TEST50X',
          refereePercentage: 25,
          refereeCap: { amount: 50, currency: 'EGP' },
          referrerAmount: { amount: 500, currency: 'EGP' },
          refereeMinSpending: { amount: 500, currency: 'EGP' },
          refereeFixedValue: { amount: 50, currency: 'EGP' },
          refereeDiscountType: 'PERCENTAGE',
        },
        impact: {
          refereeImpact: { amount: 50, currency: 'EGP' },
          referrerImpact: { amount: 50, currency: 'EGP' },
          referralUsageId: 12345,
          referrerId: 12345,
        },
        valid: true,
      };

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');
      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));
      await pm.init();
      assert.isTrue(pm.shouldShowRefereePercentage);
    });
  });

  context('showing/hiding returned change amount', function () {
    it('shows returned change amount if order status is DELIVERED', async function () {
      const pm = new EditOnlineOrderPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        orderId: 123,
      });
      let orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.status = 'REQUESTED';

      const orderDetailsStub = $sb.stub(OrdersRepoImpl.prototype, 'getOrder');

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isFalse(pm.shouldShowChangeAmount);

      orderResponseStub = orderDetailsResponseStub();
      orderResponseStub.status = 'DELIVERED';

      orderDetailsStub.resolves(mapOrderResponseToOrder(orderResponseStub));

      await pm.init();

      assert.isTrue(pm.shouldShowChangeAmount);
    });
  });
});
