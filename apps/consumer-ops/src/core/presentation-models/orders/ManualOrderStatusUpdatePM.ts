import { ActionAuthToken } from '@survv/commons/core/models/ActionAuthToken';
import { ActionAuthTokenRepo } from '@survv/commons/core/repositories/ActionAuthTokenRepo';
import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { OrderStatus } from '../../models/Order';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { RejectionReason } from '../../models/RejectionReason';
import { RejectionReasonForm } from '../../models/RejectionReasonForm';
import { UsersRepo } from '../../repositories/UsersRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class ManualOrderStatusUpdatePM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _usersRepo: UsersRepo;
  private readonly _actionAuthTokenRepo: ActionAuthTokenRepo;
  private readonly _orderId: EntityId;
  private readonly _orderStatus: OrderStatus;
  private readonly _canAcceptRejectOrder: boolean;
  private _actionAuthToken: ActionAuthToken | undefined;

  shouldShowOrderStatusManualUpdateDialog: boolean;
  userPassword: string;
  totalPaid: number;
  rejectionForm = new RejectionReasonForm();
  rejectionReasons: RejectionReason[] = [];
  clonedRejectionReasons: RejectionReason[] = [];
  shouldOpenRejectForm = false;
  shouldOpenUnavailableItemsList = false;
  shouldOpenBranchBusyList = false;
  branchStatusList: BranchB2CStatus[];

  private orderStatusesTransitionTable: {
    [index: string]: OrderStatus[];
  } = {
    REQUESTED: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
  };

  constructor({
    notificationService,
    ordersRepo,
    usersRepo,
    actionAuthTokenRepo,
    orderId,
    canAcceptRejectOrder,
    orderStatus,
  }: ManualOrderStatusUpdatePMOptions) {
    super();
    this._notificationService = notificationService;
    this._ordersRepo = ordersRepo;
    this._usersRepo = usersRepo;
    this._actionAuthTokenRepo = actionAuthTokenRepo;
    this._orderId = orderId;
    this._orderStatus = orderStatus;
    this.userPassword = '';
    this.totalPaid = 0;
    this._canAcceptRejectOrder = canAcceptRejectOrder;
    this.shouldShowOrderStatusManualUpdateDialog = false;
    this.branchStatusList = BranchB2CStatus.lookup().filter(
      (status) => !BranchB2CStatus.AVAILABLE.equals(status)
    ) as BranchB2CStatus[];
  }

  private async _hydrateActionAuthToken(): Promise<void> {
    this._actionAuthToken = await this._actionAuthTokenRepo.getParsedToken();
  }

  private async _hydrateRejectionReasons(): Promise<void> {
    this.rejectionReasons = await this._ordersRepo.getRejectionReasons();
    this.clonedRejectionReasons = [...this.rejectionReasons];
  }

  get shouldShowOrderStatusUpdateDialogActivator(): boolean {
    return this._orderStatus.in([OrderStatus.REQUESTED]);
  }

  hideDialog(): void {
    this.totalPaid = 0;
    this.shouldShowOrderStatusManualUpdateDialog = false;
  }

  async openDialog(): Promise<void> {
    await this._hydrateActionAuthToken();
    await this._hydrateRejectionReasons();
    this._assignRejectionReasonsFormHandlers();
    this.shouldShowOrderStatusManualUpdateDialog = true;
  }

  get shouldShowAcceptRejectActions(): boolean {
    return (
      this._orderStatus.equals(OrderStatus.REQUESTED) &&
      this._canAcceptRejectOrder
    );
  }

  get shouldShowConfirmAction(): boolean {
    return this._orderStatus.notEqual(OrderStatus.REQUESTED);
  }

  async acceptOrder(): Promise<boolean> {
    return this.updateOrderStatus(OrderStatus.CONFIRMED);
  }

  async rejectOrder(): Promise<boolean> {
    return this.updateOrderStatus(OrderStatus.REJECTED);
  }

  async confirmUpdate(): Promise<boolean> {
    return this.updateOrderStatus(this.transitionableStatuses[0]);
  }

  validators(): Validators {
    return {
      password: (): FormValidationResult => {
        if (this.needPasswordConfirmation) {
          return required(this.userPassword);
        }
        return true;
      },
    };
  }

  get needPasswordConfirmation(): boolean {
    return !this._actionAuthToken || this._actionAuthToken.isExpired();
  }

  private async updateOrderStatus(status: OrderStatus): Promise<boolean> {
    return this._longProcess(async () => {
      try {
        if (!this.isValid()) {
          return false;
        }

        if (this.needPasswordConfirmation) {
          const confirmed = await this._confirmPassword();
          if (!confirmed) {
            return false;
          }
        }

        await this._ordersRepo.updateOrderStatus({
          orderId: this._orderId,
          status,
          totalPaid: this.totalPaid,
          rejectionForm: this.rejectionForm,
        });

        this._notificationService.notify(successfulOperation());
        return true;
      } catch (err) {
        this._notificationService.notify(createNotification(err));
        return false;
      }
    });
  }

  get transitionableStatuses(): OrderStatus[] {
    return this.orderStatusesTransitionTable[this._orderStatus.valueOf()];
  }

  private async _confirmPassword(): Promise<boolean> {
    try {
      await this._usersRepo.authorizeUpdateOrder(this.userPassword);
      return true;
    } catch (err) {
      this.userPassword = '';
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  private _assignRejectionReasonsFormHandlers(): void {
    this.rejectionForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this.rejectOrder();
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  async submitRejectionReasonsForm(): Promise<boolean> {
    const rejectionReason = this.rejectionReasons.find(
      (reason) => reason.id == this.rejectionForm.reasonId
    );

    if (rejectionReason?.label == 'Unavailable Items') {
      this.shouldOpenRejectForm = false;
      this.openUnavailableItemsList();
      return false;
    }
    if (rejectionReason?.label == 'Busy Branch') {
      this.shouldOpenRejectForm = false;
      this.openBranchBusyList();
      return false;
    }
    await this.submitRejectForm();
    return true;
  }

  async submitRejectForm(): Promise<boolean> {
    await this.rejectionForm.submit();
    this.closeRejectForm();
    this.closeUnavailableItemsList();
    this.closeBranchBusyList();
    return true;
  }

  closeRejectForm(): void {
    this.shouldOpenRejectForm = false;
    this.rejectionForm.reset();
  }

  openRejectForm(): void {
    this.hideDialog();
    this.shouldOpenRejectForm = true;
  }

  searchRejectReasons(searchToken: string): void {
    this.clonedRejectionReasons = this.rejectionReasons.filter((reason) =>
      reason.label.toLowerCase().includes(searchToken.toLowerCase())
    );
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
}

interface ManualOrderStatusUpdatePMOptions {
  notificationService: NotificationService;
  ordersRepo: OrdersRepo;
  usersRepo: UsersRepo;
  actionAuthTokenRepo: ActionAuthTokenRepo;
  orderId: EntityId;
  orderStatus: OrderStatus;
  canAcceptRejectOrder: boolean;
}
