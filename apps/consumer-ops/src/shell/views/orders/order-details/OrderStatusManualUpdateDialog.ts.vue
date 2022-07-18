<template>
  <div>
    <vg-button
      v-if="pm.shouldShowOrderStatusUpdateDialogActivator"
      @click="pm.openDialog()"
    >
      {{
        $t('ORDER_STATUS_MANUAL_UPDATE_DIALOG_TITLE', {
          statuses: pm.transitionableStatuses
            .map((status) => $t(status))
            .join('/'),
        })
      }}
    </vg-button>
    <v-dialog
      v-if="pm.shouldShowOrderStatusUpdateDialogActivator"
      :value="pm.shouldShowOrderStatusManualUpdateDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="order-status-manual-update-dialog__header">
          <div class="order-status-manual-update-dialog__header__svg">
            <vg-svg
              :src="SVG_ICON_WARNING"
              fill="#E02020"
              width="50px"
              height="50px"
            ></vg-svg>
          </div>
          <div class="order-status-manual-update-dialog__header__title">
            {{
              $t('ORDER_STATUS_MANUAL_UPDATE_DIALOG_TITLE', {
                statuses: pm.transitionableStatuses
                  .map((status) => $t(status))
                  .join('/'),
              })
            }}
          </div>
        </v-card-title>

        <v-card-text class="order-status-manual-update-dialog__body">
          <div class="order-status-manual-update-dialog__body__msg">
            <span>
              {{ $t('ORDER_STATUS_MANUAL_UPDATE_DIALOG_MSG') }}
            </span>
            <span v-if="pm.needPasswordConfirmation">
              {{
                $t(
                  'ORDER_STATUS_MANUAL_UPDATE_DIALOG_NEED_PASSWORD_CONFIRMATION_MSG'
                )
              }}
            </span>
          </div>
          <div>
            <vg-flex no-wrap gap-size="mid">
              <div v-if="pm.needPasswordConfirmation">
                <vg-text-field
                  v-model.trim="pm.userPassword"
                  type="text"
                  outlined
                  required
                  :label="'ORDER_STATUS_MANUAL_UPDATE_DIALOG_PASSWORD'"
                  hide-details
                  :validator="pm.validators().password"
                  min-width="200px"
                ></vg-text-field>
              </div>
            </vg-flex>
          </div>
        </v-card-text>
        <v-card-actions class="order-status-manual-update-dialog__actions">
          <vg-flex
            gap-size="mid"
            justify-content="flex-end"
            align-items="center"
          >
            <div>
              <vg-button flat @click="pm.hideDialog()">
                {{ $t('CANCEL') }}
              </vg-button>
            </div>
            <div v-if="pm.shouldShowAcceptRejectActions">
              <vg-button :disabled="!pm.isValid()" @click="pm.openRejectForm()">
                {{ $t('REJECT') }}
              </vg-button>
            </div>
            <div v-if="pm.shouldShowAcceptRejectActions">
              <vg-button :disabled="!pm.isValid()" @click="acceptOrder">
                {{ $t('ACCEPT') }}
              </vg-button>
            </div>
            <div v-if="pm.shouldShowConfirmAction">
              <vg-button
                :disabled="!pm.isValid()"
                @click="confirmOrderStatusUpdate"
              >
                {{ $t('CONFIRM') }}
              </vg-button>
            </div>
          </vg-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <rejection-reasons-form
      :open="pm.shouldOpenRejectForm"
      :form="pm.rejectionForm"
      :rejection-reasons="pm.clonedRejectionReasons"
      max-width="600px"
      @submitted="submitRejectionReasonsForm"
      @discard="pm.closeRejectForm()"
      @backdrop="pm.closeRejectForm()"
      @search="pm.searchRejectReasons($event)"
    >
    </rejection-reasons-form>
    <branch-busy-bottom-sheet
      :open="pm.shouldOpenBranchBusyList"
      :title="$t('BRANCH_BUSY_LIST_HEADER')"
      :b2c-branch-status.sync="pm.rejectionForm.b2cBranchStatus"
      :branch-status-list="pm.branchStatusList"
      @submit:form="submitRejectForm"
      @backdrop="pm.closeBranchBusyList()"
    ></branch-busy-bottom-sheet>
    <unavailable-items-bottom-sheet
      :open="pm.shouldOpenUnavailableItemsList"
      :title="$t('ITEMS_UNAVAILABLE_LIST_HEADER')"
      :items="order.items"
      :selected-items.sync="pm.rejectionForm.unavailableItems"
      :selected-selections.sync="pm.rejectionForm.unavailableSelections"
      :notes.sync="pm.rejectionForm.notes"
      @submit:form="submitRejectForm"
      @backdrop="pm.closeUnavailableItemsList()"
    ></unavailable-items-bottom-sheet>
  </div>
</template>

<script lang="ts">
import BranchBusyBottomSheet from './BranchBusyBottomSheet.ts.vue';
import RejectionReasonsForm from './RejectionReasonsForm.ts.vue';
import UnavailableItemsBottomSheet from './UnavailableItemsBottomSheet.ts.vue';
import Vue from 'vue';
import { ManualOrderStatusUpdatePM } from '../../../../core/presentation-models/orders/ManualOrderStatusUpdatePM';
import { Order, OrderStatus } from '../../../../core/models/Order';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { SVG_ICON_WARNING } from '@survv/assets';
import { UsersRepoImpl } from '../../../repositories/users/UsersRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { actionAuthTokenRepo } from '@survv/commons/shell/repositories/ActionAuthTokenRepoImpl';
import { notificationService } from '@survv/commons/shell/services/notificationService';

const events = {
  orderStatusUpdated: 'updated:order-status',
};

export default Vue.extend({
  name: 'OrderStatusManualUpdateDialog',
  components: {
    VgButton,
    VgFlex,
    VgTextField,
    VgSvg,
    RejectionReasonsForm,
    BranchBusyBottomSheet,
    UnavailableItemsBottomSheet,
  },
  props: {
    order: {
      type: Order,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      SVG_ICON_WARNING,
      pm: new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: this.order.id,
        canAcceptRejectOrder: this.order.actionDisplay,
        orderStatus: new OrderStatus(this.orderStatus),
      }),
    };
  },
  watch: {
    orderStatus(val: string): void {
      this.pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: this.order.id,
        canAcceptRejectOrder: this.order.actionDisplay,
        orderStatus: new OrderStatus(val),
      });
    },
  },
  methods: {
    async submitRejectionReasonsForm(): Promise<void> {
      if (await this.pm.submitRejectionReasonsForm()) {
        this.$emit(events.orderStatusUpdated);
      }
    },
    async submitRejectForm(): Promise<void> {
      if (await this.pm.submitRejectForm()) {
        this.$emit(events.orderStatusUpdated);
      }
    },
    async confirmOrderStatusUpdate(): Promise<void> {
      const confirmed = await this.pm.confirmUpdate();
      if (confirmed) {
        this.pm.hideDialog();
        this.$emit(events.orderStatusUpdated);
      }
    },
    async acceptOrder(): Promise<void> {
      const accepted = await this.pm.acceptOrder();
      if (accepted) {
        this.pm.hideDialog();
        this.$emit(events.orderStatusUpdated);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.order-status-manual-update-dialog {
  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--inset-x-large) var(--inset-x-large) var(--inset-mid)
      var(--inset-x-large);

    &__svg {
      margin-inline-end: var(--inset-x-large);
    }

    &__title {
      font-weight: bold;
      font-size: 20px;
    }
  }

  &__body {
    padding: var(--inset-mid) var(--inset-x-large);
    &__msg {
      margin-bottom: var(--inset-mid);
    }
  }

  &__actions {
    padding: var(--inset-mid) var(--inset-x-large);
  }
}
</style>
