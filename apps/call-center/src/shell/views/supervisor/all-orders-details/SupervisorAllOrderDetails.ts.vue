<template>
  <vg-content :breadcrumbs="breadcrumbs">
    <div class="order-details-container">
      <div class="order-details-container__journey">
        <order-journey :order-journey="message.state.journey"></order-journey>
      </div>
      <div class="order-details-container__details">
        <vg-panel
          class="vg-margin-block-end--mid"
          collapsible
          :title="$t('ONLINE_ORDER_DETAILS_CUSTOMER_DETAILS')"
        >
          <div class="customer-info-container">
            <div class="customer-info-container__name">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_NAME')"
                :value="message.state.order.customerName"
                dense
              ></vg-pair>
            </div>
            <div class="customer-info-container__phone">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER')"
                :value="message.state.order.customerMobileNo"
                dense
              ></vg-pair>
            </div>
            <div class="customer-info-container__address">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_ADDRESS')"
                :value="message.state.order.customerAddress"
                dense
              ></vg-pair>
            </div>
          </div>
        </vg-panel>
        <vg-panel
          class="vg-margin-block-end--mid"
          collapsible
          :title="$t('ONLINE_ORDER_DETAILS_ORDER_BRIEF')"
        >
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_SURVV_ORDER_ID')"
              :value="message.state.order.customerOrderId"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_CREATION_TIME')"
              :value="message.state.order.creationDate"
              dense
            ></vg-pair>
            <vg-pair
              v-if="message.state.order.von !== ''"
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_VON')"
              :value="message.state.order.von"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_PAYMENT_METHOD')"
              :value="message.state.order.paymentMethod"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_NUMBER_OF_ITEMS')"
              :value="message.state.order.items.length"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_STATUS')"
              :value="message.state.order.status"
              dense
            ></vg-pair>
            <vg-pair
              v-if="message.state.order.scheduled"
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_SCHEDULED_TO')"
              :value="message.state.order.scheduledTo"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_DELIVER_BY')"
              :value="message.state.order.deliverBy"
              dense
            ></vg-pair>
          </vg-grid>
        </vg-panel>
        <vg-panel
          class="vg-margin-block-end--mid"
          collapsible
          :title="$t('ONLINE_ORDER_DETAILS_BRANCH_DETAILS')"
        >
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_BRANCH_NAME')"
              :value="message.state.order.branchLabel"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('ONLINE_ORDER_DETAILS_BRANCH_AREA')"
              :value="message.state.order.branchArea"
              dense
            ></vg-pair>
          </vg-grid>
        </vg-panel>
        <vg-panel
          class="vg-margin-block-end--mid"
          collapsible
          :title="$t('ONLINE_ORDER_DETAILS_ORDER_ITEMS')"
        >
          <vg-grid gap-size="mid">
            <vg-flex
              v-if="orderHasUnavailableItemsOrSelections"
              align-items="center"
              class="order-details-container__details__unavailable-items"
            >
              <div>
                <vg-svg
                  :src="SVG_GLOBAL_UNAVAILABLE"
                  fill="var(--color-on-primary)"
                ></vg-svg>
              </div>
              <div
                class="
                  order-details-container__details__unavailable-items__message
                "
              >
                {{ $t('ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION') }}
              </div>
            </vg-flex>
            <order-item-card
              v-for="(item, itemIndex) in message.state.order.items"
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
              :value="message.state.order.subtotal"
              dense
            ></vg-pair>
            <vg-pair
              max-width="50%"
              :label="$t('ONLINE_ORDER_DETAILS_TAX')"
              :value="message.state.order.tax"
              dense
            ></vg-pair>
            <vg-pair
              max-width="50%"
              :label="$t('ONLINE_ORDER_DETAILS_DELIVERY_FEE')"
              :value="message.state.order.deliveryFee"
              dense
            ></vg-pair>
            <vg-pair
              max-width="50%"
              :label="$t('ONLINE_ORDER_DETAILS_TOTAL')"
              :value="message.state.order.total"
              dense
            ></vg-pair>
          </vg-flex>
        </vg-panel>
      </div>
    </div>
  </vg-content>
</template>

<script lang="ts">
import OrderItemCard from '../common/OrderItemCard.ts.vue';
import OrderJourney from '../common/OrderJourney.ts.vue';
import Vue from 'vue';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { SVG_GLOBAL_UNAVAILABLE } from '@survv/assets';
import {
  SupervisorOrderDetailsAction,
  SupervisorOrderDetailsMessage,
} from '../../../../core/blocs/supervisor/order-details/SupervisorOrderDetailsMessage';
import { SupervisorOrderDetailsBloc } from '../../../../core/blocs/supervisor/order-details/SupervisorOrderDetailsBloc';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'SupervisorAllOrderDetails',
  components: {
    OrderJourney,
    OrderItemCard,
    VgContent,
    VgPanel,
    VgFlex,
    VgPair,
    VgGrid,
    VgSvg,
  },
  data() {
    return {
      SVG_GLOBAL_UNAVAILABLE,
      bloc: new SupervisorOrderDetailsBloc({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      }),
      message: new SupervisorOrderDetailsMessage(),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
          text: 'SUPERVISOR_ALL_ORDERS_LIST',
        },
        {
          routeName: this.$route.name as string,
          text: this.message.state.order.customerOrderId,
        },
      ];
    },
    orderHasUnavailableItemsOrSelections(): boolean {
      return this.message.state.order.items.some(
        (item) =>
          !item.isAvailable ||
          item.options.some((option) =>
            option.selections.some((selection) => !selection.isAvailable)
          )
      );
    },
  },
  created() {
    this.bloc.outbox().subscribe((message: SupervisorOrderDetailsMessage) => {
      this.message = message;
    });

    this.bloc.inbox().next(
      new SupervisorOrderDetailsAction({
        type: 'INITIALIZE',
      })
    );
  },
});
</script>

<style scoped lang="scss">
.order-details-container {
  display: flex;
  flex-wrap: wrap;
  padding: var(--inset-mid);

  &__journey {
    flex: 2;
    width: 50%;
    min-width: 370px;
    max-width: 680px;
    margin-inline-end: var(--inset-mid);
  }
  &__details {
    flex: 3;
    display: flex;
    flex-direction: column;

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
}
.customer-info-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  grid-column-gap: var(--inset-small);
  grid-row-gap: var(--inset-small);

  &__name {
    grid-area: 1 / 1 / 2 / 2;
  }
  &__phone {
    grid-area: 1 / 2 / 2 / 3;
  }
  &__address {
    grid-area: 2 / 1 / 3 / 3;
  }
  &__map {
    grid-area: 3 / 1 / 4 / 3;
  }
}
</style>
