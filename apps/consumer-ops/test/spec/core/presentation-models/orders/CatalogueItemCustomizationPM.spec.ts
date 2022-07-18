import { $sb } from '@survv/commons/test/utils/sandbox';
import { AlbumsResponse } from '@survv/api/definitions/albums';
import { CatalogueItemCustomizationPM } from '../../../../../src/core/presentation-models/orders/CatalogueItemCustomizationPM';
import { CatalogueItemsRepoImpl } from '../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { ImageRefType } from '@survv/commons/core/models/Images';
import {
  ItemOption,
  ItemRequest,
  ItemResponse,
} from '@survv/api/definitions/items';
import {
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
} from '../../../../../src/core/models/Order';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import {
  branchItemResponseStub,
  itemDetailsResponseStub,
} from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { itemResponseStub } from '@survv/api/stubs/items';
import {
  mapBranchItemResponseToCatalogueItem,
  mapItemResponseToCatalogueItem,
} from '../../../../../src/shell/repositories/catalogues/mappers/responses';
import { mapOrderResponseToOrder } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { orderDetailsResponseStub } from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueItemCustomizationPM', function () {
  describe('initialization', function () {
    it('should hydrate the catalogue item', async function () {
      const randomItemId = 12344;
      const catalogueItem = mapItemResponseToCatalogueItem(
        itemDetailsResponseStub(),
        albumsResponseStub()
      );
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      assert.deepEqual(pm.catalogueItem, catalogueItem);
    });
    it('should have zero quantity if no order item is provided for modification', async function () {
      const randomItemId = 12344;
      const catalogueItem = mapBranchItemResponseToCatalogueItem(
        branchItemResponseStub()
      );
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      assert.equal(pm.quantity, 0);
    });
    it('should not have any active item customization when no order item is given', async function () {
      const randomItemId = 12344;
      const catalogueItem = mapBranchItemResponseToCatalogueItem(
        branchItemResponseStub()
      );
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();
      const noActiveCustomizations = pm.catalogueItem.options.every((option) =>
        option.selections.every(
          (selection) =>
            !pm.isActiveCustomization({
              selectionId: selection.id,
              optionId: option.id,
              relatedOptions: [],
            })
        )
      );

      assert.isTrue(noActiveCustomizations);
    });
    it('should copy the order quantity when given an order item', async function () {
      const randomItemId = 12344;
      const orderItemQuantity = 8;
      const catalogueItem = mapBranchItemResponseToCatalogueItem(
        branchItemResponseStub()
      );
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: randomItemId,
            quantity: orderItemQuantity,
          },
        ],
      });
      const [orderItem] = order.items;
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
        orderItem,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      assert.equal(pm.quantity, orderItemQuantity);
    });
    it('should set any order item customization as an active customization', async function () {
      const randomItemId = 12344;
      const orderItemQuantity = 8;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const [orderDetailsItemOptionStub] = orderDetailsItemStub.options;
      const [orderDetailsItemOptionSelectionStub] =
        orderDetailsItemOptionStub.selections;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: randomItemId,
            quantity: orderItemQuantity,
            options: [
              {
                ...orderDetailsItemOptionStub,
                optionId: firstCustomization.optionId,
                selections: [
                  {
                    ...orderDetailsItemOptionSelectionStub,
                    selectionId: firstCustomization.selectionId,
                  },
                ],
              },
              {
                ...orderDetailsItemOptionStub,
                optionId: thirdCustomization.optionId,
                selections: [
                  {
                    ...orderDetailsItemOptionSelectionStub,
                    selectionId: thirdCustomization.selectionId,
                  },
                ],
              },
            ],
          },
        ],
      });
      const [orderItem] = order.items;
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
        orderItem,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();
      const allOrderItemCustomizationsAreActive = orderItem.options.every(
        (option) =>
          option.selections.every((selection) =>
            pm.isActiveCustomization({
              selectionId: selection.selectionId,
              optionId: option.optionId,
              relatedOptions: [],
            })
          )
      );

      assert.isTrue(allOrderItemCustomizationsAreActive);
    });
    it('should notify on catalogue item hydration failure', async function () {
      const randomItemId = 12344;
      const anErrorModel = errorModel({
        code: 'any code',
        message: 'any message',
        args: {
          any: 'args',
        },
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .rejects(anErrorModel);

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(anErrorModel)
      );
    });
  });

  describe('changing a multi-selection option', function () {
    it('should activate the customization if it was checked', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });

      assert.isTrue(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(secondCustomization));
    });
    it('should de-activate the customization of it is unchecked', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        ...firstCustomization,
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        ...secondCustomization,
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        ...thirdCustomization,
        checked: true,
      });

      await pm.onOptionMultiSelectionChange({
        ...secondCustomization,
        checked: false,
      });

      assert.isTrue(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(thirdCustomization));
      assert.isFalse(pm.isActiveCustomization(secondCustomization));
    });
  });

  describe('changing a multi-selection related option', function () {
    it('should activate the related option customization if it was checked', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: true,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: true,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 112,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      await pm.onRelatedOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 112,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: true,
      });

      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 222,
        })
      );
      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 112,
          relatedOptionSelectionId: 223,
        })
      );
    });
    it('should de-activate the related option customization if it was unchecked', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: true,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: true,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 112,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      await pm.onRelatedOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 112,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: true,
      });

      await pm.onRelatedOptionMultiSelectionChange({
        optionId: 1111,
        selectionId: 112,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: false,
      });

      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 222,
        })
      );
      assert.isFalse(
        pm.isActiveRelatedOptionSelection({
          selectionId: 112,
          relatedOptionSelectionId: 223,
        })
      );
    });
  });

  describe('changing a single-selection option', function () {
    it('should add new given customization', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
        relatedOptions: [],
        checked: true,
      });

      assert.isTrue(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(thirdCustomization));
    });
    it('should remove the previous customization when given a new selection under the same option', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });

      assert.isFalse(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(secondCustomization));
    });
    it('should allow unchecking the same selection under the same option if the option is not mandatory', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: false,
      });

      assert.isFalse(pm.isActiveCustomization(firstCustomization));
      assert.isFalse(pm.isActiveCustomization(secondCustomization));
    });
    it('should not allow unchecking the same selection under the same option if the option is mandatory', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: false,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: false,
      });

      assert.isFalse(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(secondCustomization));
    });
  });

  describe('changing a single-selection related option', function () {
    it('should add new given customization', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: true,
      });

      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 223,
        })
      );
    });
    it('should remove the previous customization when given a new selection under the same related option', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: true,
      });

      assert.isFalse(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 222,
        })
      );
      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 223,
        })
      );
    });
    it('should allow unchecking the same selection under the same related option if the option is not mandatory', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: false,
      });

      assert.isFalse(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 222,
        })
      );
    });
    it('should not allow unchecking the same selection under the same related option if the option is mandatory', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      await pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [],
        checked: true,
      });

      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      await pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: false,
      });

      assert.isTrue(
        pm.isActiveRelatedOptionSelection({
          selectionId: 111,
          relatedOptionSelectionId: 222,
        })
      );
    });
  });

  describe('changing the collapsed option', function () {
    it('should collapse the previous option and view the given option index', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      pm.onOptionCollapseChange(1);

      assert.isTrue(pm.isCollapsedOption(0));
      assert.isFalse(pm.isCollapsedOption(1));
    });
    it('should collapse the current visible option given the same index', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      pm.onOptionCollapseChange(1);
      pm.onOptionCollapseChange(1);

      assert.isTrue(pm.isCollapsedOption(0));
      assert.isTrue(pm.isCollapsedOption(1));
    });
    it('should not mark the option as completed if it does not have valid customizations', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      pm.onOptionCollapseChange(1);

      assert.isFalse(pm.isCompletedOption(0));
    });
    it('should mark the option as completed it has valid customizations', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      pm.onOptionCollapseChange(1);

      assert.isTrue(pm.isCompletedOption(0));
    });
    it('should mark the option as incomplete if it does not have valid customizations after it was was completed before', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 2,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      // close
      pm.onOptionCollapseChange(0);
      // open
      pm.onOptionCollapseChange(0);
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: false,
      });
      // open another option
      pm.onOptionCollapseChange(1);

      assert.isFalse(pm.isCompletedOption(0));
    });
  });

  describe('changing the collapsed related option', function () {
    it('should collapse the previous related option and view the given related option index', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222, 3333],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222, 3333],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption1: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption2: ItemOption = {
        optionId: 3333,
        selections: [
          {
            id: 333,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 334,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption1, relatedOption2],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });

      assert.isTrue(
        pm.isCollapsedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 1,
        })
      );
      assert.isFalse(
        pm.isCollapsedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 0,
        })
      );
    });
    it('should collapse the current visible related option given the same index', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222, 3333],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222, 3333],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption1: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption2: ItemOption = {
        optionId: 3333,
        selections: [
          {
            id: 333,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 334,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption1, relatedOption2],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });

      assert.isTrue(
        pm.isCollapsedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 0,
        })
      );
      assert.isTrue(
        pm.isCollapsedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 1,
        })
      );
    });
    it('should not mark the related option as completed if it does not have valid customizations', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      // Related Option is mandatory
      const relatedOption1: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption1],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });

      assert.isFalse(
        pm.isCompletedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 0,
        })
      );
    });
    it('should mark the related option as completed it has valid customizations', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      // Related Option is mandatory
      const relatedOption1: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption1],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [{ selectionId: 222, optionId: 2222 }],
        checked: true,
      });
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });
      pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });

      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });

      assert.isTrue(
        pm.isCompletedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 0,
        })
      );
    });
    it('should mark the related option as incomplete if it does not have valid customizations after it was  completed before', async function () {
      const randomItemId = 12344;
      const mainOption: ItemOption = {
        optionId: 1111,
        selections: [
          {
            id: 111,
            title: { en: 'Small', ar: 'صغير' },
            calories: 50,
            price: {
              amount: 31.01,
              currency: 'EGP',
            },
            relatedOptions: [2222, 3333],
          },
          {
            id: 112,
            title: { en: 'Small', ar: 'صغير' },
            calories: 100,
            price: { amount: 50, currency: 'EGP' },
            relatedOptions: [2222, 3333],
          },
        ],
        related: false,
        title: { en: 'Combo', ar: 'كومبو' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: false,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      // Related Option is mandatory
      const relatedOption1: ItemOption = {
        optionId: 2222,
        selections: [
          {
            id: 222,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 223,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: true,
        minAllowed: 2,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };
      const relatedOption2: ItemOption = {
        optionId: 3333,
        selections: [
          {
            id: 555,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
          {
            id: 666,
            title: { en: 'Small', ar: 'صغير' },
            price: { amount: 50, currency: 'EGP' },
            calories: 50,
            relatedOptions: [],
          },
        ],
        related: true,
        title: { en: 'Fries', ar: 'بطاطس' },
        multiSelection: false,
        minAllowed: 1,
        maxAllowed: 10,
        mandatory: true,
        creationDate: '2018-09-05T19:04:53.178Z',
        template: false,
        description: { en: 'Combo', ar: 'كومبو' },
      };

      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [mainOption, relatedOption1, relatedOption2],
      });

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);

      await pm.init();

      pm.onOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptions: [{ selectionId: 222, optionId: 2222 }],
        checked: true,
      });
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });
      // select first option
      pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: true,
      });
      // select second option
      pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 223,
        checked: true,
      });
      // close - related item is now complete
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });
      // open
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 0,
      });
      // check false on the first selection
      pm.onRelatedOptionSingleSelectionChange({
        optionId: 1111,
        selectionId: 111,
        relatedOptionId: 2222,
        relatedOptionSelectionId: 222,
        checked: false,
      });

      // open another related option
      pm.onRelatedOptionCollapseChange({
        optionIndex: 0,
        selectionIndex: 0,
        relatedOptionIndex: 1,
      });

      assert.isFalse(
        pm.isCompletedRelatedOption({
          optionIndex: 0,
          selectionIndex: 0,
          relatedOptionIndex: 0,
        })
      );
    });
  });

  describe('ability to save the changes', function () {
    it('should be disabled when any option fails the selections validity conditions', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      assert.isFalse(pm.canSaveChanges());
    });
    it('should be disabled when the quantity is zero', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
        relatedOptions: [],
        checked: true,
      });

      pm.quantity = 0;

      assert.isFalse(pm.canSaveChanges());
    });
    it('should be enabled when all the options pass the selections validity conditions and quantity is not zero', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      pm.quantity = 4;

      assert.isTrue(pm.canSaveChanges());
    });
  });

  describe('customized item', function () {
    it('should have all the customizations', async function () {
      const randomItemId = 12344;
      const firstCustomization = {
        selectionId: 8951,
        optionId: 751,
        relatedOptions: [],
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
        relatedOptions: [],
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
        relatedOptions: [],
      };
      const orderItemQuantity = 4;
      const [catalogueItemOptionStub] = branchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapBranchItemResponseToCatalogueItem({
        ...branchItemResponseStub(),
        options: [
          {
            ...catalogueItemOptionStub,
            optionId: firstCustomization.optionId,
            multiSelection: true,
            mandatory: true,
            minAllowed: 1,
            maxAllowed: 2,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: firstCustomization.selectionId,
              },
              {
                ...catalogueItemOptionSelectionStub,
                id: secondCustomization.selectionId,
              },
            ],
          },
          {
            ...catalogueItemOptionStub,
            optionId: thirdCustomization.optionId,
            multiSelection: false,
            mandatory: true,
            selections: [
              {
                ...catalogueItemOptionSelectionStub,
                id: thirdCustomization.selectionId,
              },
            ],
          },
        ],
      });
      const [orderDetailsItemStub] = orderDetailsResponseStub().items;
      const order = mapOrderResponseToOrder({
        ...orderDetailsResponseStub(),
        items: [
          {
            ...orderDetailsItemStub,
            itemId: randomItemId,
            quantity: orderItemQuantity,
          },
        ],
      });
      const [orderItem] = order.items;

      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
        orderItem,
      });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
        .withArgs(randomItemId)
        .resolves(catalogueItem);
      await pm.init();

      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[0].id,
        relatedOptions: [],
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        relatedOptions: [],
        checked: true,
      });
      pm.quantity = 4;

      assert.deepEqual(
        pm.customizedItem,
        new OrderItem({
          ...orderItem,
          itemId: randomItemId,
          title: orderItem.title,
          notes: orderItem.notes,
          orderItemId: orderItem.orderItemId,
          quantity: orderItemQuantity,
          options: [
            new OrderItemOption({
              optionId: pm.catalogueItem.options[0].id,
              title: pm.catalogueItem.options[0].displayName,
              selections: pm.catalogueItem.options[0].selections.map(
                (selection) =>
                  new OrderItemOptionSelection({
                    price: selection.price,
                    title: selection.displayName,
                    selectionId: selection.id,
                    quantity: orderItemQuantity,
                    relatedOptions: [],
                  })
              ),
            }),
          ],
        })
      );
    });
  });

  describe('integration', function () {
    it('should work', async function () {
      const randomItemId = 12344;
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });

      const itemAlbumStub: AlbumsResponse = [
        ...albumsResponseStub(),
        99,
        11,
        77,
      ];

      await wiremock
        .stub<ItemRequest, ItemResponse>()
        .request({
          requestLine: 'get /consumer/api/v1/items/:itemId',
          params: {
            itemId: randomItemId,
          },
        })
        .response({
          status: 200,
          body: itemResponseStub(),
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/albums',
          query: {
            referenceId: randomItemId,
            referenceType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE.valueOf(),
          },
        })
        .response({ status: 200, body: itemAlbumStub });

      await pm.init();

      assert.isUndefined(notificationService.notification);
    });
  });
});
