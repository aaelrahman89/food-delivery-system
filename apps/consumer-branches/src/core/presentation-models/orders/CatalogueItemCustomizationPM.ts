import { BasePM } from '@survv/commons/core/base/BasePM';
import { CatalogueItem } from '../../models/CatalogueItem';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { EntityId } from '@survv/commons/core/types';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import {
  OrderItem,
  OrderItemOption,
  OrderItemOptionSelection,
} from '../../models/Order';
import { OrderItemCustomization } from '../../models/OrderItemCustomizations';
import { createNotification } from '../../notification';
import { hasValidCustomizations } from './validators/OrderItemCustomizationsValidators';

export class CatalogueItemCustomizationPM extends BasePM {
  private readonly _catalogueItemsRepo: CatalogueItemsRepo;
  private readonly _notificationService: NotificationService;
  private readonly _itemId: EntityId = 0;
  private _orderItem = new OrderItem();
  private _orderItemCustomizations: OrderItemCustomization[] = [];
  private _visibleItemOptionIndex = 0;
  private _completedOptionsIndices: Array<number> = [];
  quantity = 0;
  catalogueItem = new CatalogueItem();

  constructor(options: CatalogueItemCustomizationPMOptions) {
    super();
    const { catalogueItemsRepo, itemId, notificationService, orderItem } =
      options;
    this._catalogueItemsRepo = catalogueItemsRepo;
    this._itemId = itemId;
    this._notificationService = notificationService;
    Object.assign(this._orderItem, orderItem);
  }

  isCompletedOption(index: number): boolean {
    return this._completedOptionsIndices.includes(index);
  }

  isCollapsedOption(index: number): boolean {
    return this._visibleItemOptionIndex != index;
  }

  onOptionCollapseChange(index: number): void {
    this._updateLastOptionCompleteness();
    const closedCurrentVisibleOption = index == this._visibleItemOptionIndex;
    if (closedCurrentVisibleOption) {
      this._collapseAllOptions();
    } else {
      this._viewOptionAt(index);
    }
  }

  onOptionMultiSelectionChange(value: OptionSelectionChange): void {
    if (value.checked) {
      this._addCustomization({
        selectionId: value.selectionId,
        optionId: value.optionId,
      });
    } else {
      this._removeCustomization({
        selectionId: value.selectionId,
        optionId: value.optionId,
      });
    }
  }

  onOptionSingleSelectionChange(value: OptionSelectionChange): void {
    const existingCustomizationGroup = this._orderItemCustomizations.find(
      (customization) => value.optionId == customization.optionId
    );
    const isMandatoryOption = this.catalogueItem.options.find(
      (option) => option.id == value.optionId
    )?.mandatory;
    if (existingCustomizationGroup) {
      this._removeCustomization(existingCustomizationGroup);
    }
    if (existingCustomizationGroup && isMandatoryOption && !value.checked) {
      this._addCustomization(value);
    }
    if (value.checked) {
      this._addCustomization(value);
    }
  }

  isActiveCustomization(value: OrderItemCustomization): boolean {
    return (
      this._orderItemCustomizations.findIndex(
        // selectionId is unique enough, no need to check with the optionId
        (customization) => customization.selectionId == value.selectionId
      ) > -1
    );
  }

  canSaveChanges(): boolean {
    return (
      this.catalogueItem.options.every((option) =>
        hasValidCustomizations({
          option,
          customizations: this._orderItemCustomizations,
        })
      ) && this.quantity > 0
    );
  }

  get customizedItem(): OrderItem {
    const customizationGroups = new Map<EntityId, EntityId[]>();
    this._orderItemCustomizations.forEach((customization) => {
      let selectionIds = customizationGroups.get(customization.optionId);
      if (!selectionIds) {
        selectionIds = [customization.selectionId];
      } else {
        selectionIds = [...selectionIds, customization.selectionId];
      }
      customizationGroups.set(customization.optionId, selectionIds);
    });

    const reconstructedOrderItemOptions: OrderItemOption[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [optionId, selectionIds] of customizationGroups) {
      const catalogueItemOption = this.catalogueItem.options.find(
        (option) => option.id == optionId
      );
      if (catalogueItemOption) {
        const catalogueItemOptionSelections =
          catalogueItemOption.selections.filter((selection) =>
            selectionIds.includes(selection.id)
          );
        reconstructedOrderItemOptions.push(
          new OrderItemOption({
            title: catalogueItemOption.displayName,
            optionId: catalogueItemOption.id,
            selections: catalogueItemOptionSelections.map(
              (selection) =>
                new OrderItemOptionSelection({
                  selectionId: selection.id,
                  title: selection.displayName,
                  quantity: this.quantity,
                  price: selection.price,
                })
            ),
          })
        );
      }
    }

    return OrderItem.copyWith(this._orderItem, {
      title: this.catalogueItem.displayName,
      quantity: this.quantity,
      itemId: this._itemId,
      options: reconstructedOrderItemOptions,
    });
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateCatalogueItem();
      this._copyOrderData();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private _addCustomization(value: OrderItemCustomization): void {
    this._orderItemCustomizations = [...this._orderItemCustomizations, value];
  }

  private _removeCustomization(value: OrderItemCustomization): void {
    this._orderItemCustomizations = this._orderItemCustomizations.filter(
      (customization) => customization.selectionId != value.selectionId
    );
  }

  private async _hydrateCatalogueItem(): Promise<void> {
    this.catalogueItem = await this._catalogueItemsRepo.getItem(this._itemId);
  }

  private _copyOrderData(): void {
    this.quantity = this._orderItem.quantity;
    this._orderItem.options.forEach((option) => {
      option.selections.forEach((selection) => {
        this._addCustomization({
          selectionId: selection.selectionId,
          optionId: option.optionId,
        });
      });
    });
  }

  private _viewOptionAt(index: number): void {
    this._visibleItemOptionIndex = index;
  }

  private _collapseAllOptions(): void {
    this._visibleItemOptionIndex = -1;
  }

  private _updateLastOptionCompleteness(): void {
    if (this._visibleItemOptionIndex < 0) {
      return;
    }
    const index = this._visibleItemOptionIndex;
    const isValidOption = hasValidCustomizations({
      option: this.catalogueItem.options[index],
      customizations: this._orderItemCustomizations,
    });
    const isCompletedOption = this.isCompletedOption(index);

    if (isValidOption && !isCompletedOption) {
      this._completedOptionsIndices = [...this._completedOptionsIndices, index];
    }

    if (!isValidOption && isCompletedOption) {
      this._completedOptionsIndices = this._completedOptionsIndices.filter(
        (_, i) => i != index
      );
    }
  }
}

interface CatalogueItemCustomizationPMOptions {
  catalogueItemsRepo: CatalogueItemsRepo;
  notificationService: NotificationService;
  itemId: EntityId;
  orderItem?: OrderItem;
}

type OptionSelectionChange = OrderItemCustomization & {
  checked: boolean;
};
