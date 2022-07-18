import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersRepoImpl } from '../../../shell/repositories/orders/OrdersRepoImpl';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { required } from '@survv/commons/core/validations/form-validators';

export class CancelOrderPM extends BaseListingPM {
  constructor({ orderId, notificationService, ordersRepo }) {
    super({
      hardFilter: { orderTypes: [OrderType.B2C.valueOf()] },
      defaultQuery: {
        skip: 0,
        limit: 200,
      },
    });
    this._ordersRepo = ordersRepo;
    this._orderId = orderId;
    this.form = {
      cancelReasons: [],
      selectedCancelReasonId: undefined,
      requestRefund: false,
    };
    this._notificationService = notificationService;
  }

  async _hydrate() {
    await this._hydrateCancellationReasons();
  }

  async _hydrateCancellationReasons() {
    try {
      this.form.allCancelReasons =
        await this._ordersRepo.listCancellationReasons(this._listingQuery);
      this.form.cancelReasons = { ...this.form.allCancelReasons };
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  searchReasons(searchToken) {
    if (!searchToken) {
      this.form.cancelReasons = { ...this.form.allCancelReasons };
    } else {
      const flatReasons = [].concat(
        ...Object.values(this.form.allCancelReasons)
      );
      const filteredReasons = flatReasons.filter((reason) => {
        return (
          reason.label.toLowerCase().indexOf(searchToken.toLowerCase()) !== -1
        );
      });

      const categorizedReasons = {};
      filteredReasons.forEach((reason) => {
        if (categorizedReasons[reason.type.valueOf()]) {
          categorizedReasons[reason.type.valueOf()].push(reason);
        } else {
          categorizedReasons[reason.type.valueOf()] = [reason];
        }
      });

      this.form.cancelReasons = { ...categorizedReasons };
    }
  }

  validators() {
    return {
      selectedCancelReasonId: () => {
        return required(this.form.selectedCancelReasonId);
      },
    };
  }

  async submit() {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        return this._notificationService.notify(badOperation());
      }

      try {
        await new OrdersRepoImpl().cancelOrder(
          this._orderId,
          this.form.selectedCancelReasonId,
          this.form.requestRefund
        );
        this._notificationService.notify(successfulOperation());
        return true;
      } catch (err) {
        this._notificationService.notify(createNotification(err));
        return false;
      }
    });
  }

  get canSubmit() {
    return this.isValid() && !this.loading && this.isFormUpdated();
  }

  isFormUpdated() {
    return !deepEqual(this.form, {
      selectedCancelReasonId: undefined,
    });
  }

  reset() {
    this.form.selectedCancelReasonId = undefined;
  }
}
