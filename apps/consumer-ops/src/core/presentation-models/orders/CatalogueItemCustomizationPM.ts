import ObjectUtils from '../../etc/ObjectUtils';
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
import {
  hasValidCustomizations,
  isValidRelatedOptionCustomizations,
} from './validators/OrderItemCustomizationsValidators';

export class CatalogueItemCustomizationPM extends BasePM {
  private readonly _catalogueItemsRepo: CatalogueItemsRepo;
  private readonly _notificationService: NotificationService;
  private readonly _itemId: EntityId = 0;
  private _orderItem = new OrderItem();
  private _orderItemCustomizations: OrderItemCustomization[] = [];
  private _visibleItemOptionIndex = 0;
  private _visibleRelatedItemOptionIndex: RelatedOptionIndex = {
    optionIndex: -1,
    selectionIndex: -1,
    relatedOptionIndex: -1,
  };

  private _completedOptionsIndices: Array<number> = [];
  private _completedRelatedOptionsIndices: RelatedOptionIndex[] = [];

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

  isCompletedRelatedOption(index: RelatedOptionIndex): boolean {
    const result = this._completedRelatedOptionsIndices.find(
      (completedOption) => ObjectUtils.deepEqual(completedOption, index)
    );
    if (result) return true;
    return false;
  }

  isCollapsedOption(index: number): boolean {
    return this._visibleItemOptionIndex != index;
  }

  isCollapsedRelatedOption(index: RelatedOptionIndex): boolean {
    return (
      JSON.stringify(this._visibleRelatedItemOptionIndex) !=
      JSON.stringify(index)
    );
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

  onRelatedOptionCollapseChange(index: RelatedOptionIndex): void {
    this._updateLastRelatedOptionCompleteness();
    const closedCurrentVisibleRelatedOption =
      JSON.stringify(index) ==
      JSON.stringify(this._visibleRelatedItemOptionIndex);

    if (closedCurrentVisibleRelatedOption) {
      this._collapseAllRelatedOptions();
    } else {
      this._viewRelatedOptionAt(index);
    }
  }

  onOptionMultiSelectionChange(value: OptionSelectionChange): void {
    const relatedOptions = value.relatedOptions ? value.relatedOptions : [];
    if (value.checked) {
      this._addCustomization({
        selectionId: value.selectionId,
        optionId: value.optionId,
        relatedOptions,
      });
    } else {
      this._removeCustomization({
        selectionId: value.selectionId,
        optionId: value.optionId,
        relatedOptions,
      });
    }
  }

  onRelatedOptionMultiSelectionChange(
    value: RelatedOptionSelectionChange
  ): void {
    if (value.checked) {
      this._addRelatedOptionCustomization({
        optionId: value.optionId,
        selectionId: value.selectionId,
        relatedOptionId: value.relatedOptionId,
        relatedOptionSelectionId: value.relatedOptionSelectionId,
      });
    } else {
      this._removeRelatedOptionCustomization({
        optionId: value.optionId,
        selectionId: value.selectionId,
        relatedOptionId: value.relatedOptionId,
        relatedOptionSelectionId: value.relatedOptionSelectionId,
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

  onRelatedOptionSingleSelectionChange(
    value: RelatedOptionSelectionChange
  ): void {
    const customizationIndex = this._orderItemCustomizations.findIndex(
      (option) =>
        option.optionId === value.optionId &&
        option.selectionId === value.selectionId
    );

    // check if there is an existing customization
    const existingCustomizationGroup = this._orderItemCustomizations[
      customizationIndex
    ].relatedOptions.find(
      (customization) => customization.optionId === value.relatedOptionId
    );

    // check if the related option selection is mandatory
    const catalogueItemIndex = this.catalogueItem.options.findIndex(
      (option) => option.id === value.optionId
    );
    const selectionIndex = this.catalogueItem.options[
      catalogueItemIndex
    ].selections.findIndex((selection) => selection.id === value.selectionId);
    const isMandatory = this.catalogueItem.options[
      catalogueItemIndex
    ].selections[selectionIndex].relatedOptions.find(
      (option) => option.optionId === value.relatedOptionId
    )?.mandatory;

    const { checked, ...rest } = value;

    if (existingCustomizationGroup) {
      this._removeRelatedOptionCustomization(rest);
    }

    if (existingCustomizationGroup && isMandatory && !checked) {
      this._addRelatedOptionCustomization(rest);
    }

    if (checked) {
      this._addRelatedOptionCustomization(rest);
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

  isActiveRelatedOptionSelection({
    selectionId,
    relatedOptionSelectionId,
  }: {
    selectionId: number;
    relatedOptionSelectionId: number;
  }): boolean {
    const orderCustomizationIndex = this._orderItemCustomizations.findIndex(
      // selectionId is unique enough, no need to check with the optionId
      (customization) => customization.selectionId == selectionId
    );
    if (
      orderCustomizationIndex < 0 ||
      !this._orderItemCustomizations[orderCustomizationIndex].relatedOptions
        ?.length
    ) {
      return false;
    }
    return (
      this._orderItemCustomizations[
        orderCustomizationIndex
      ].relatedOptions.findIndex(
        (related) => related.selectionId === relatedOptionSelectionId
      ) > -1
    );
  }

  canSaveChanges(): boolean {
    const isValidRelatedOptionsCustomizations: boolean =
      this.catalogueItem.options.every((option) => {
        return option.selections
          .filter(
            (selection) =>
              this._orderItemCustomizations.findIndex(
                (customization) => customization.selectionId === selection.id
              ) > -1
          )
          .every((selection) => {
            return selection.relatedOptions.every((relatedOption) => {
              return isValidRelatedOptionCustomizations({
                optionId: option.id,
                selectionId: selection.id,
                customizations: this._orderItemCustomizations,
                relatedOption,
              });
            });
          });
      });
    return (
      this.catalogueItem.options.every((option) =>
        hasValidCustomizations({
          option,
          customizations: this._orderItemCustomizations,
        })
      ) &&
      isValidRelatedOptionsCustomizations &&
      this.quantity > 0
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

    // [{optionId,[selId,SelId]},{},{}]

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
                  relatedOptions: selection.relatedOptions.map((option) => {
                    return {
                      optionId: option.optionId,
                      title: option.displayName,
                      selections: option.selections
                        .filter((catalogueRelatedOptionSelection) => {
                          const mainCustomization =
                            this._orderItemCustomizations.find(
                              (orderCustomization) =>
                                orderCustomization.selectionId === selection.id
                            );

                          if (!mainCustomization) return false;

                          return (
                            mainCustomization.relatedOptions.filter(
                              (relatedOptionCustomization) =>
                                relatedOptionCustomization.selectionId ===
                                catalogueRelatedOptionSelection.id
                            ).length > 0
                          );
                        })
                        .map((relatedOptionSelection) => {
                          return {
                            selectionID: relatedOptionSelection.id,
                            title: relatedOptionSelection.displayName,
                            price: relatedOptionSelection.price,
                          };
                        }),
                    };
                  }),
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

  private _addRelatedOptionCustomization(
    args: RelatedOptionsCustomizationsArgs
  ): void {
    const { optionId, selectionId, relatedOptionId, relatedOptionSelectionId } =
      args;

    const orderItemCustomizationIndex = this._orderItemCustomizations.findIndex(
      (customization) =>
        customization.optionId === optionId &&
        customization.selectionId === selectionId
    );

    this._orderItemCustomizations[
      orderItemCustomizationIndex
    ].relatedOptions.push({
      selectionId: relatedOptionSelectionId,
      optionId: relatedOptionId,
    });
  }

  private _removeCustomization(value: OrderItemCustomization): void {
    this._orderItemCustomizations = this._orderItemCustomizations.filter(
      (customization) => customization.selectionId != value.selectionId
    );
  }

  private _removeRelatedOptionCustomization(
    args: RelatedOptionsCustomizationsArgs
  ): void {
    const { optionId, selectionId, relatedOptionId, relatedOptionSelectionId } =
      args;

    // Find the index of the customization
    const orderCustIdx = this._orderItemCustomizations.findIndex(
      (customization) =>
        customization.optionId === optionId &&
        customization.selectionId === selectionId
    );

    // find the index of the related option in the customization
    const relOptIdx = this._orderItemCustomizations[
      orderCustIdx
    ].relatedOptions.findIndex(
      (relOptionCust) =>
        relOptionCust.optionId === relatedOptionId &&
        relOptionCust.selectionId === relatedOptionSelectionId
    );

    // Remove the relatedOption customization
    this._orderItemCustomizations[orderCustIdx].relatedOptions.splice(
      relOptIdx,
      1
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
          relatedOptions: [],
        });
        selection.relatedOptions.forEach((relatedOption) => {
          relatedOption.selections.forEach((relatedOptionSelection) => {
            this._addRelatedOptionCustomization({
              optionId: option.optionId,
              selectionId: selection.selectionId,
              relatedOptionId: relatedOption.optionId,
              relatedOptionSelectionId: relatedOptionSelection.selectionID,
            });
          });
        });
      });
    });
  }

  private _viewOptionAt(index: number): void {
    this._visibleItemOptionIndex = index;
  }

  private _viewRelatedOptionAt(index: RelatedOptionIndex): void {
    this._visibleRelatedItemOptionIndex = index;
  }

  private _collapseAllOptions(): void {
    this._visibleItemOptionIndex = -1;
  }

  private _collapseAllRelatedOptions(): void {
    this._visibleRelatedItemOptionIndex = {
      optionIndex: -1,
      selectionIndex: -1,
      relatedOptionIndex: -1,
    };
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

  private _updateLastRelatedOptionCompleteness(): void {
    if (this._visibleRelatedItemOptionIndex.optionIndex < 0) {
      return;
    }
    const index = this._visibleRelatedItemOptionIndex;
    const isValidRelatedOption = isValidRelatedOptionCustomizations({
      optionId: this.catalogueItem.options[index.optionIndex].id,
      selectionId:
        this.catalogueItem.options[index.optionIndex].selections[
          this._visibleRelatedItemOptionIndex.selectionIndex
        ].id,
      customizations: this._orderItemCustomizations,
      relatedOption:
        this.catalogueItem.options[index.optionIndex].selections[
          index.selectionIndex
        ].relatedOptions[index.relatedOptionIndex],
    });
    const isCompleteRelatedOption = this.isCompletedRelatedOption(index);

    if (isValidRelatedOption && !isCompleteRelatedOption) {
      this._completedRelatedOptionsIndices = [
        ...this._completedRelatedOptionsIndices,
        index,
      ];
    }

    if (!isValidRelatedOption && isCompleteRelatedOption) {
      this._completedRelatedOptionsIndices =
        this._completedRelatedOptionsIndices.filter(
          (relatedOptionIndex) =>
            JSON.stringify(relatedOptionIndex) != JSON.stringify(index)
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
interface RelatedOptionsCustomizationsArgs {
  optionId: number;
  selectionId: number;
  relatedOptionId: number;
  relatedOptionSelectionId: number;
}

type OptionSelectionChange = OrderItemCustomization & {
  checked: boolean;
};
type RelatedOptionSelectionChange = RelatedOptionsCustomizationsArgs & {
  checked: boolean;
};
export type RelatedOptionIndex = {
  optionIndex: number;
  selectionIndex: number;
  relatedOptionIndex: number;
};
