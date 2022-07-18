<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs" :padded="false">
    <div class="vg-padding--large">
      <vg-flex gap-size="mid" no-wrap>
        <div class="order-journey-container">
          <order-journey
            :order-journey="pm.structuredOrderJourney"
          ></order-journey>
        </div>
        <vg-grid class="order-details-container" gap-size="mid">
          <vg-panel collapsible :title="$t('ONLINE_ORDER_DETAILS_ORDER_BRIEF')">
            <vg-grid gap-size="small" columns="1fr 1fr">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_ORDER_ID')"
                :value="pm.order.customerOrderId"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_NUMBER_OF_ITEMS')"
                :value="pm.order.items.length"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_REQUESTED_DATE')"
                :value="$t(pm.order.creationDate.toDatetimeString())"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_LAST_UPDATE_DATE')"
                :value="$t(pm.order.lastUpdateDate.toDatetimeString())"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.order.scheduled"
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_SCHEDULED_TO')"
                :value="pm.order.scheduledTo"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_DELIVER_BY')"
                :value="$t(pm.order.deliverBy.toString())"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.order.vendorTaskId !== ''"
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_VON')"
                :value="pm.order.vendorTaskId"
                dense
              ></vg-pair>
            </vg-grid>
          </vg-panel>
          <vg-panel collapsible :title="$t('ONLINE_ORDER_DETAILS_ORDER_ITEMS')">
            <vg-grid gap-size="mid">
              <vg-flex
                v-if="pm.orderHasUnavailableItemsOrSelections()"
                align-items="center"
                class="order-details-container__unavailable-items"
              >
                <div>
                  <vg-svg
                    :src="SVG_GLOBAL_UNAVAILABLE"
                    fill="var(--color-on-primary)"
                  ></vg-svg>
                </div>
                <div
                  class="order-details-container__unavailable-items__message"
                >
                  {{ $t('ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION') }}
                </div>
              </vg-flex>
              <online-order-item-card
                v-for="(item, itemIndex) in pm.order.items"
                :key="itemIndex"
                :item="item"
              />
            </vg-grid>
          </vg-panel>
          <vg-panel collapsible :title="$t('ONLINE_ORDER_DETAILS_CHARGING')">
            <vg-flex gap-size="small" justify-content="flex-end">
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_SUBTOTAL')"
                :value="`${pm.order.subTotal.toString()} ${$t(
                  pm.order.subTotal.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TAX')"
                :value="`${pm.order.taxWithoutDeliveryFees.toString()} ${$t(
                  pm.order.tax.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TOTAL')"
                :value="`${pm.order.totalWithoutDeliveryFees.toString()} ${$t(
                  pm.order.total.currency
                )}`"
                dense
              ></vg-pair>
            </vg-flex>
          </vg-panel>
        </vg-grid>
      </vg-flex>
    </div>
    <rejection-reasons-form
      :open="pm.shouldOpenRejectForm"
      :form="pm.rejectionForm"
      :rejection-reasons="pm.clonedRejectionReasons"
      max-width="600px"
      @submitted="pm.submitRejectionReasonsForm()"
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
      @submit:form="pm.submitRejectForm()"
      @backdrop="pm.closeBranchBusyList()"
    ></branch-busy-bottom-sheet>
    <unavailable-items-bottom-sheet
      :open="pm.shouldOpenUnavailableItemsList"
      :title="$t('ITEMS_UNAVAILABLE_LIST_HEADER')"
      :items="pm.order.items"
      :selected-items.sync="pm.rejectionForm.unavailableItems"
      :selected-selections.sync="pm.rejectionForm.unavailableSelections"
      :notes.sync="pm.rejectionForm.notes"
      @submit:form="pm.submitRejectForm()"
      @backdrop="pm.closeUnavailableItemsList()"
    ></unavailable-items-bottom-sheet>
    <vg-floating-container v-if="pm.shouldShowAcceptRejectActions">
      <vg-flex
        class="order-details-action-buttons-container"
        gap-size="x-large"
        justify-content="center"
      >
        <div class="order-details-action-buttons-container__button">
          <vg-button expand outlined @click="pm.openRejectForm()">
            {{ $t('ONLINE_ORDER_DETAILS_REJECT') }}
          </vg-button>
        </div>
        <div class="order-details-action-buttons-container__button">
          <vg-button expand dark @click="pm.acceptOrder()">
            {{
              pm.order.scheduled
                ? $t('ONLINE_ORDER_DETAILS_ACCEPT_FOR_LATER')
                : $t('ONLINE_ORDER_DETAILS_ACCEPT')
            }}
          </vg-button>
        </div>
      </vg-flex>
    </vg-floating-container>
  </vg-content>
</template>

<script lang="ts">
import BranchBusyBottomSheet from './BranchBusyBottomSheet.ts.vue';
import OnlineOrderItemCard from './OnlineOrderItemCard.ts.vue';
import OrderJourney from './OrderJourney.ts.vue';
import RejectionReasonsForm from './RejectionReasonsForm.ts.vue';
import UnavailableItemsBottomSheet from './UnavailableItemsBottomSheet.ts.vue';
import Vue from 'vue';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrderDetailsPM } from '../../../../core/presentation-models/orders/OrderDetailsPM';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { SVG_GLOBAL_UNAVAILABLE } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgFloatingContainer } from '@survv/commons/components/VgFloatingContainer';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'OnlineOrderView',
  components: {
    UnavailableItemsBottomSheet,
    OrderJourney,
    OnlineOrderItemCard,
    RejectionReasonsForm,
    VgContent,
    VgPanel,
    VgFlex,
    VgPair,
    VgGrid,
    VgButton,
    VgFloatingContainer,
    VgSvg,
    BranchBusyBottomSheet,
  },
  data() {
    return {
      SVG_GLOBAL_UNAVAILABLE,
      pm: new OrderDetailsPM({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: 'routes.orders.list',
          text: 'routes.orders.list',
        },
        {
          routeName: this.$route.name as string,
          text: this.pm.order.customerOrderId,
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
});
</script>

<style scoped lang="scss">
.order-journey-container {
  min-width: 300px;
  width: 50%;
}
.order-details-container {
  flex-grow: 1;
  &__unavailable-items {
    background-color: var(--color-primary);
    border-radius: 4px;
    padding: var(--inset-small);
    &__message {
      margin-left: var(--inset-small);
      color: var(--color-on-primary);
      font-size: var(--font-size-small);
    }
  }
}
.order-details-action-buttons-container {
  &__button {
    width: 220px;
  }
}
</style>
