import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus } from '../../models/Order';
import { OrderJourney, StructuredOrderStep } from '../../models/OrderJourney';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { RejectionReason } from '../../models/RejectionReason';
import { RejectionReasonForm } from '../../models/RejectionReasonForm';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class OrderDetailsPM extends BasePM {
  private readonly _orderId: EntityId;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _notificationService: NotificationService;
  orderJourney = new OrderJourney();
  order = new Order();
  rejectionForm = new RejectionReasonForm();
  rejectionReasons: RejectionReason[] = [];
  clonedRejectionReasons: RejectionReason[] = [];
  shouldOpenRejectForm = false;
  shouldOpenUnavailableItemsList = false;
  shouldOpenBranchBusyList = false;
  branchStatusList: BranchB2CStatus[];
  constructor(options: OrderDetailsPMOptions) {
    super();
    const { orderId, ordersRepo, notificationService } = options;
    this._orderId = orderId;
    this._ordersRepo = ordersRepo;
    this._notificationService = notificationService;
    this.branchStatusList = BranchB2CStatus.lookup().filter(
      (status) => !BranchB2CStatus.AVAILABLE.equals(status)
    ) as BranchB2CStatus[];
  }

  async _hydrate(): Promise<void> {
    await this._hydrateOrder();
    await this._hydrateOrderJourney();
    await this._hydrateRejectionReasons();
    this._assignRejectionReasonsFormHandlers();
  }

  async refresh(): Promise<void> {
    await this._hydrateOrder();
    await this._hydrateOrderJourney();
  }

  async _hydrateOrder(): Promise<void> {
    try {
      this.order = await this._ordersRepo.getOrder(this._orderId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateOrderJourney(): Promise<void> {
    try {
      this.orderJourney = await this._ordersRepo.getOrderJourney(this._orderId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get structuredOrderJourney(): StructuredOrderStep[] {
    return this.orderJourney.build();
  }

  private async _hydrateRejectionReasons(): Promise<void> {
    this.rejectionReasons = await this._ordersRepo.getRejectionReasons();
    this.clonedRejectionReasons = [...this.rejectionReasons];
  }

  private _assignRejectionReasonsFormHandlers(): void {
    this.rejectionForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._ordersRepo.rejectOrder(this._orderId, this.rejectionForm);
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  async submitRejectionReasonsForm(): Promise<void> {
    const rejectionReason = this.rejectionReasons.find(
      (reason) => reason.id == this.rejectionForm.reasonId
    );
    if (rejectionReason?.label == 'Unavailable Items') {
      this.shouldOpenRejectForm = false;
      this.openUnavailableItemsList();
    } else if (rejectionReason?.label == 'Busy Branch') {
      this.shouldOpenRejectForm = false;
      this.openBranchBusyList();
    } else {
      await this.submitRejectForm();
    }
  }

  async submitRejectForm(): Promise<void> {
    await this.rejectionForm.submit();
    this.closeRejectForm();
    this.closeUnavailableItemsList();
    this.closeBranchBusyList();
    await this.refresh();
  }

  closeRejectForm(): void {
    this.shouldOpenRejectForm = false;
    this.rejectionForm.reset();
  }

  openRejectForm(): void {
    this.shouldOpenRejectForm = true;
  }

  searchRejectReasons(searchToken: string): void {
    this.clonedRejectionReasons = this.rejectionReasons.filter((reason) =>
      reason.label.toLowerCase().includes(searchToken.toLowerCase())
    );
  }

  async acceptOrder(): Promise<void> {
    try {
      await this._ordersRepo.acceptOrder(this._orderId);
      this._notificationService.notify(successfulOperation());
      await this._hydrate();
    } catch (e) {
      this._notificationService.notify(createNotification(e));
    }
  }

  openUnavailableItemsList(): void {
    this.shouldOpenUnavailableItemsList = true;
  }

  closeUnavailableItemsList(): void {
    this.shouldOpenUnavailableItemsList = false;
    this.rejectionForm.reset();
  }

  openBranchBusyList(): void {
    this.shouldOpenBranchBusyList = true;
  }

  closeBranchBusyList(): void {
    this.shouldOpenBranchBusyList = false;
    this.rejectionForm.reset();
  }

  orderHasUnavailableItemsOrSelections(): boolean {
    return this.order.items.some(
      (item) =>
        !item.isAvailable ||
        item.options.some((option) =>
          option.selections.some((selection) => !selection.isAvailable)
        )
    );
  }

  get shouldShowAcceptRejectActions(): boolean {
    return (
      this.order.status.equals(OrderStatus.REQUESTED) &&
      this.order.actionDisplay
    );
  }
}

interface OrderDetailsPMOptions {
  orderId: EntityId;
  ordersRepo: OrdersRepo;
  notificationService: NotificationService;
}
