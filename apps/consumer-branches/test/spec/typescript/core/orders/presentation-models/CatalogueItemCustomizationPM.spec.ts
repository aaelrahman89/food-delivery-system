import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  BranchItemRequest,
  ConsumerBranchItemResponse,
} from '@survv/api/definitions/branches';
import { CatalogueItemCustomizationPM } from '../../../../../../src/core/presentation-models/orders/CatalogueItemCustomizationPM';
import { CatalogueItemsRepoImpl } from '../../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { Money } from '@survv/commons/core/models/money';
import {
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
} from '../../../../../../src/core/models/Order';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { consumerBranchItemResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { mapConsumerBranchItemResponseToCatalogueItem } from '../../../../../../src/shell/repositories/catalogues/mappers/responses';
import { mapOrderResponseToOrder } from '../../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { orderDetailsResponseStub } from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueItemCustomizationPM', function () {
  describe('initialization', function () {
    it('should hydrate the catalogue item', async function () {
      const randomItemId = 12344;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem(
        consumerBranchItemResponseStub()
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
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem(
        consumerBranchItemResponseStub()
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
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem(
        consumerBranchItemResponseStub()
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
            })
        )
      );

      assert.isTrue(noActiveCustomizations);
    });
    it('should copy the order quantity when given an order item', async function () {
      const randomItemId = 12344;
      const orderItemQuantity = 8;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem(
        consumerBranchItemResponseStub()
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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

  describe('changing a single-selection option', function () {
    it('should add new given customization', async function () {
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: false,
      });

      assert.isFalse(pm.isActiveCustomization(firstCustomization));
      assert.isTrue(pm.isActiveCustomization(secondCustomization));
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      // close
      pm.onOptionCollapseChange(0);
      // open
      pm.onOptionCollapseChange(0);
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: false,
      });
      // open another option
      pm.onOptionCollapseChange(1);

      assert.isFalse(pm.isCompletedOption(0));
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
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      await pm.onOptionSingleSelectionChange({
        optionId: catalogueItem.options[1].id,
        selectionId: catalogueItem.options[1].selections[0].id,
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
      };
      const secondCustomization = {
        selectionId: 75891,
        optionId: 751,
      };
      const thirdCustomization = {
        selectionId: 87515,
        optionId: 88555,
      };
      const orderItemQuantity = 4;
      const [catalogueItemOptionStub] =
        consumerBranchItemResponseStub().options;
      const [catalogueItemOptionSelectionStub] =
        catalogueItemOptionStub.selections;
      const catalogueItem = mapConsumerBranchItemResponseToCatalogueItem({
        ...consumerBranchItemResponseStub(),
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
        checked: true,
      });
      await pm.onOptionMultiSelectionChange({
        optionId: catalogueItem.options[0].id,
        selectionId: catalogueItem.options[0].selections[1].id,
        checked: true,
      });
      pm.quantity = 4;

      assert.deepEqual(
        pm.customizedItem,
        new OrderItem({
          itemId: randomItemId,
          title: orderItem.title,
          notes: orderItem.notes,
          orderItemId: orderItem.orderItemId,
          quantity: orderItemQuantity,
          price: new Money({ amount: 31.01, currency: 'EGP' }),
          isAvailable: true,
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
      const branchId = 98174;
      const pm = new CatalogueItemCustomizationPM({
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        itemId: randomItemId,
      });
      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(
          new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
        );

      await wiremock
        .stub<BranchItemRequest, ConsumerBranchItemResponse>()
        .request({
          requestLine: 'get /consumer/api/v1/branches/:branchId/items/:itemId',
          params: {
            branchId,
            itemId: randomItemId,
          },
        })
        .response({
          status: 200,
          body: consumerBranchItemResponseStub(),
        });

      await pm.init();

      assert.isUndefined(notificationService.notification);
    });
  });
});
