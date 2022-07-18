import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { CancelErrandOrderRepo } from '../../repositories/CancelErrandOrderRepo';
import {
  CancellationReason,
  CancellationReasonsOrderType,
} from '../../models/OrderCancellationReasons';
import { CancellationReasonsForm } from '../../models/ErrandOrderForms';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class CancelErrandOrderPM extends BaseListingPM {
  private readonly _orderId: EntityId;
  private readonly _cancelErrandOrderRepo: CancelErrandOrderRepo;
  private readonly _notificationService: NotificationService;
  cancellationReasons: CancellationReason[] = [];
  cancellationForm = new CancellationReasonsForm();
  clonedCancellationReasons: CancellationReason[] = [];
  shouldOpenCancelForm = false;
  constructor(options: CancelErrandOrderPMOptions) {
    super({
      hardFilter: {
        orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()],
      },
      defaultQuery: { skip: 0, limit: 200 },
    });
    const { orderId, cancelErrandOrderRepo, notificationService } = options;
    this._cancelErrandOrderRepo = cancelErrandOrderRepo;
    this._orderId = orderId;
    this._notificationService = notificationService;
    this._assignCancellationReasonsFormHandlers();
  }

  async _hydrate(): Promise<void> {
    await this._hydrateCancellationReasons();
  }

  async _hydrateCancellationReasons(): Promise<void> {
    try {
      this.cancellationReasons =
        await this._cancelErrandOrderRepo.listCancellationReasons(
          this._listingQuery
        );
      this.clonedCancellationReasons = [...this.cancellationReasons];
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  searchReasons(searchToken: string): void {
    this.clonedCancellationReasons = this.cancellationReasons.filter((reason) =>
      reason.label.toLowerCase().includes(searchToken.toLowerCase())
    );
  }

  private _assignCancellationReasonsFormHandlers(): void {
    this.cancellationForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._cancelErrandOrderRepo.cancelOrder(
            this._orderId,
            this.cancellationForm.cancellationReasonId,
            this.cancellationForm.requestRefund
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  closeCancelForm(): void {
    this.shouldOpenCancelForm = false;
    this.cancellationForm.reset();
  }

  openCancelForm(): void {
    this.shouldOpenCancelForm = true;
  }

  get submittable(): boolean {
    return this.cancellationForm.submittable;
  }

  get categorizedReasonsList(): Record<string, CancellationReason[]> {
    const categorizedReasons: Record<string, CancellationReason[]> = {};

    this.clonedCancellationReasons.forEach((reason) => {
      if (categorizedReasons[reason.type.toString()]) {
        categorizedReasons[reason.type.toString()].push(reason);
      } else {
        categorizedReasons[reason.type.toString()] = [reason];
      }
    });
    return categorizedReasons;
  }
}

interface CancelErrandOrderPMOptions {
  orderId: EntityId;
  notificationService: NotificationService;
  cancelErrandOrderRepo: CancelErrandOrderRepo;
}
