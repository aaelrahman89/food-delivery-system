import { BasePM } from '@survv/commons/core/base/BasePM';
import { CatalogueItemsListItem } from '../../models/CatalogueItem';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { EntityId } from '@survv/commons/core/types';
import {
  NotificationService,
  notificationService,
} from '@survv/commons/shell/services/notificationService';
import { Order, OrderItem } from '../../models/Order';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class SurvvShopOrderPM extends BasePM {
  private readonly _orderId: EntityId;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _catalogueItemsRepo: CatalogueItemsRepo;
  private readonly _notificationService: NotificationService;
  private _defaultOrder = new Order();
  private _selectedOrderItemIndex = 0;
  private _catalogueItemsList: CatalogueItemsListItem[] = [];
  private _catalogueItemsSearchString = '';
  isEditMode = false;
  shouldShowExistingItemCustomization = false;
  shouldShowNewItemCustomization = false;
  shouldShowCatalogueItemsList = false;
  selectedOrderItem = new OrderItem();
  selectedCatalogueItem = new CatalogueItemsListItem();
  order = new Order();

  constructor(options: SurvvShopOrderPMOptions) {
    super();
    const { orderId, ordersRepo, catalogueItemsRepo } = options;
    this._orderId = orderId;
    this._ordersRepo = ordersRepo;
    this._notificationService = notificationService;
    this._catalogueItemsRepo = catalogueItemsRepo;
  }

  get catalogueItemsList(): CatalogueItemsListItem[] {
    return this._catalogueItemsList.filter((item) => {
      return (
        item.displayName.en
          .toLowerCase()
          .includes(this._catalogueItemsSearchString) ||
        item.displayName.ar.includes(this._catalogueItemsSearchString)
      );
    });
  }

  get canSaveChanges(): boolean {
    return this.order.items.length > 0;
  }

  onOrderUpdateStart(): void {
    this._copyDefaultOrder();
    this._enableEditMode();
  }

  onOrderUpdateCancellation(): void {
    this._copyDefaultOrder();
    this._disableEditMode();
  }

  onCatalogueItemsSearch(value: string): void {
    this._setCatalogueItemsSearchString(value);
  }

  async onOrderUpdateFinish(): Promise<void> {
    try {
      await this._saveOrderUpdates();
      const refreshPromise = this._hydrateDefaultOrder();
      this._disableEditMode();
      await refreshPromise;
      this._copyDefaultOrder();
      this._notificationService.notify(successfulOperation());
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  onOrderItemUpdateStart(index: number): void {
    this._setSelectedOrderItem(index);
    this._showExistingItemCustomizationBottomSheet();
  }

  onOrderItemUpdateCancellation(): void {
    this._hideExistingItemCustomizationBottomSheet();
  }

  async onOrderItemUpdateFinish(item: OrderItem): Promise<void> {
    try {
      this._updateOrderItem(item);
      await this._recalculateOrder();
      this._hideExistingItemCustomizationBottomSheet();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async onOrderItemAdditionStart(): Promise<void> {
    try {
      const itemsListHydrationPromise = this._hydrateAvailableItemsList();
      this._showCatalogueItemsListBottomSheet();
      await itemsListHydrationPromise;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  onItemSelectionFromCatalogueItemsList(
    catalogueItem: CatalogueItemsListItem
  ): void {
    this._setSelectedCatalogueItem(catalogueItem);
    this._hideCatalogueItemsListBottomSheet();
    this._showNewItemCustomizationBottomSheet();
  }

  onCatalogueItemsListClose(): void {
    this._hideCatalogueItemsListBottomSheet();
  }

  onOrderItemAdditionCancellation(): void {
    this._hideNewItemCustomizationBottomSheet();
    this._showCatalogueItemsListBottomSheet();
  }

  async onOrderItemAdditionFinish(item: OrderItem): Promise<void> {
    try {
      this._addOrderItem(item);
      await this._recalculateOrder();
      this._hideNewItemCustomizationBottomSheet();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async onOrderItemRemoval(index: number): Promise<void> {
    try {
      this._removeOrderItemAt(index);
      await this._recalculateOrder();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateDefaultOrder();
      this._copyDefaultOrder();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateDefaultOrder(): Promise<void> {
    this._defaultOrder = await this._ordersRepo.getOrder(this._orderId);
  }

  private async _hydrateAvailableItemsList(): Promise<void> {
    this._catalogueItemsList = (
      await this._catalogueItemsRepo.listItems(
        queryMapper({
          filter: {
            branchId: [await authTokenRepo.getUserId()],
          },
          filterMap: {
            branchId: {
              fieldName: 'unavailableBranches',
              operator: filterOperators.NOT_IN,
            },
          },
        })
      )
    ).items;
  }

  private _disableEditMode(): void {
    this.isEditMode = false;
  }

  private _enableEditMode(): void {
    this.isEditMode = true;
  }

  private _copyDefaultOrder(): void {
    this.order = Order.copyWith(this._defaultOrder);
  }

  private async _recalculateOrder(): Promise<void> {
    this.order = await this._ordersRepo.calculateOrder(this.order);
  }

  private async _saveOrderUpdates(): Promise<void> {
    return this._ordersRepo.updateOrder(this.order);
  }

  private _updateOrderItem(item: OrderItem): void {
    // An order can have multiple items of the same 'itemId'
    // so, the itemId is not unique enough.
    // Using 'orderItemItem' also does not work as the user
    // can add new items with 'orderItemId = 0' and the removal will fail.
    // So, using the index is imperative
    const index = this._selectedOrderItemIndex;
    const currentItems = this.order.items;
    this._updateOrderItemsList([
      ...currentItems.slice(0, index),
      item,
      ...currentItems.slice(index + 1, currentItems.length),
    ]);
  }

  private _removeOrderItemAt(removalIndex: number): void {
    // An order can have multiple items of the same 'itemId'
    // so, the itemId is not unique enough.
    // Using 'orderItemItem' also does not work as the user
    // can add new items with 'orderItemId = 0' and the removal will fail.
    // So, using the index is imperative
    this._updateOrderItemsList(
      this.order.items.filter((_, index) => removalIndex != index)
    );
  }

  private _addOrderItem(item: OrderItem): void {
    this._updateOrderItemsList([...this.order.items, item]);
  }

  private _updateOrderItemsList(items: OrderItem[]): void {
    this.order = Order.copyWith(this.order, {
      items,
    });
  }

  private _setSelectedOrderItem(index: number): void {
    this._selectedOrderItemIndex = index;
    this.selectedOrderItem = this.order.items[index];
  }

  private _showExistingItemCustomizationBottomSheet(): void {
    this.shouldShowExistingItemCustomization = true;
  }

  private _hideExistingItemCustomizationBottomSheet(): void {
    this.shouldShowExistingItemCustomization = false;
  }

  private _showCatalogueItemsListBottomSheet(): void {
    this.shouldShowCatalogueItemsList = true;
  }

  private _hideCatalogueItemsListBottomSheet(): void {
    this.shouldShowCatalogueItemsList = false;
  }

  private _setSelectedCatalogueItem(
    catalogueItem: CatalogueItemsListItem
  ): void {
    this.selectedCatalogueItem = catalogueItem;
  }

  private _showNewItemCustomizationBottomSheet(): void {
    this.shouldShowNewItemCustomization = true;
  }

  private _hideNewItemCustomizationBottomSheet(): void {
    this.shouldShowNewItemCustomization = false;
  }

  private _setCatalogueItemsSearchString(value: string): void {
    this._catalogueItemsSearchString = value.toLowerCase().trim();
  }
}

interface SurvvShopOrderPMOptions {
  orderId: EntityId;
  ordersRepo: OrdersRepo;
  catalogueItemsRepo: CatalogueItemsRepo;
  notificationService: NotificationService;
}
