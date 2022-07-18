<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-flex no-wrap gap-size="mid"
      ><vg-flex gap-size="mid">
        <vg-panel :title="$t('C2C_ORDER_DETAILS_CUSTOMER_DETAILS')">
          <vg-flex gap-size="small">
            <vg-pair
              max-width="calc(50% - var(--inset-small))"
              :label="$t('C2C_ORDER_DETAILS_CUSTOMER_NAME')"
              :value="pm.c2cOrder.customerName"
              dense
            ></vg-pair>
            <vg-pair
              max-width="calc(50% - var(--inset-small))"
              :label="$t('C2C_ORDER_DETAILS_CUSTOMER_PHONE')"
              :value="pm.c2cOrder.customerPhoneNumber"
              dense
            ></vg-pair
          ></vg-flex>
        </vg-panel>
        <vg-panel :title="$t('C2C_ORDER_DETAILS_ORDER_BRIEF')">
          <vg-flex gap-size="small">
            <vg-pair
              max-width="calc(50% - var(--inset-small))"
              :label="$t('C2C_ORDER_DETAILS_ORDER_ID')"
              :value="pm.c2cOrder.customerOrderId"
              dense
            ></vg-pair>
            <vg-pair
              max-width="calc(50% - var(--inset-small))"
              :label="$t('C2C_ORDER_DETAILS_CREATION_TIME')"
              :value="pm.c2cOrder.creationTime.toDatetimeString()"
              dense
            ></vg-pair>
            <vg-pair
              max-width="calc(50% - var(--inset-small))"
              :label="$t('C2C_ORDER_DETAILS_PAYMENT_METHOD')"
              :value="pm.c2cOrder.paymentMethod"
              dense
            ></vg-pair></vg-flex
        ></vg-panel>
        <vg-panel :title="$t('C2C_ORDER_DETAILS_ORDER_DETAILS')">
          <vg-flex gap-size="mid"
            ><vg-panel
              v-for="item in pm.c2cOrder.items"
              :key="item.id"
              :title="$t(item.title)"
              title-bold
              collapsible
              :icon="item.icon"
            >
              <vg-flex gap-size="large" flex-direction="column">
                <div
                  class="
                    vg-text-pre
                    vg-text-emphasis--low
                    vg-margin-block-start--small
                  "
                >
                  {{ item.notes }}
                </div>
                <div>
                  <vg-gallery
                    :gallery="item.gallery"
                    image-size="60"
                  ></vg-gallery>
                </div>
                <div v-if="item.voiceNoteUrl">
                  <audio controls>
                    <source :src="item.voiceNoteUrl" type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                </div></vg-flex
              >
            </vg-panel></vg-flex
          >
        </vg-panel>
      </vg-flex>
      <vg-flex class="c2c-order-details__pilot-order-container" gap-size="mid"
        ><vg-panel
          :title="$t('C2C_ORDER_DETAILS_PILOT_ORDER')"
          dark
          collapsible
        >
          <vg-flex gap-size="mid"
            ><vg-panel
              v-for="(item, index) in pm.c2cStructuredOrder.items"
              :key="item.id"
              :title="$t(item.title)"
              title-bold
              collapsible
              :collapsed="index > 0"
              :icon="item.icon"
            >
              <vg-flex flex-direction="column" gap-size="mid"
                ><template
                  v-for="(selection, selectionIndex) in item.selections"
                >
                  <c2c-order-details-card
                    :key="selectionIndex"
                    :selection="selection"
                    :selection-index="selectionIndex"
                    @remove:selection="pm.removeSelection($event, item.itemId)"
                /></template>
                <div class="add-button">
                  <vg-button
                    outlined
                    expand
                    @click="pm.openForm(item.itemId)"
                    >{{ $t('C2C_ORDER_DETAILS_ADD_ITEM') }}</vg-button
                  >
                </div></vg-flex
              ></vg-panel
            >
          </vg-flex>
        </vg-panel></vg-flex
      >
    </vg-flex>
    <vg-flex></vg-flex>
    <c2c-order-item-form
      :form="pm.c2cStructuredOrderItemForm"
      :open="pm.isC2CStructuredOrderItemFormOpened"
      @backdrop="pm.discardC2CStructuredOrderItemForm()"
      @discard="pm.discardC2CStructuredOrderItemForm()"
      @submit="pm.updateOrder()"
    ></c2c-order-item-form
    ><c2c-order-form
      :form="pm.c2cStructuredOrderForm"
      @reject="onRejectOrder()"
      @submit="onAcceptOrder()"
    ></c2c-order-form>
  </vg-content>
</template>

<script lang="ts">
import C2COrderDetailsCard from './C2COrderDetailsCard.ts.vue';
import C2COrderForm from './C2COrderForm.ts.vue';
import C2COrderItemForm from './C2COrderItemForm.ts.vue';
import Vue from 'vue';
import { C2COrderDetailsPM } from '../../../../core/presentation-models/orders/C2COrderDetailsPM';
import { C2COrdersRepoImpl } from '../../../repositories/orders/C2COrdersRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGallery } from '@survv/commons/components/VgGallery';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { routeNames } from '../../../../core/routes/routeNames';

export default Vue.extend({
  name: 'C2COrderDetails',
  components: {
    VgContent,
    VgPanel,
    VgPair,
    VgFlex,
    VgGallery,
    VgButton,
    C2cOrderDetailsCard: C2COrderDetailsCard,
    C2cOrderForm: C2COrderForm,
    C2cOrderItemForm: C2COrderItemForm,
  },
  data() {
    return {
      pm: new C2COrderDetailsPM({
        orderId: Number(this.$route.params.orderId),
        c2cOrdersRepo: new C2COrdersRepoImpl(),
        notificationService,
      }),
      products: [
        {
          id: 0,
          name: 'Skimmed Milk 1 Litre',
          brand: 'Al Marai',
          quantity: 2,
        },
        {
          id: 1,
          name: 'Hot Sauce',
          brand: 'Heinz',
          quantity: 3,
        },
      ],
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
          routeName: 'routes.home.pending_orders',
          text: 'routes.home.pending_orders',
        },
        {
          routeName: 'routes.c2c-orders.details',
          text: this.pm.c2cOrder.customerOrderId,
        },
      ];
    },
  },
  created(): Promise<void> {
    return this.pm.init();
  },
  methods: {
    async onAcceptOrder(): Promise<void> {
      if (await this.pm.acceptOrder()) {
        await this.$root.pm.hydratePendingOrders();
        await this.$root.pm.hydrateWorkingOrders();
        await this.$router.push({
          name: routeNames.HOME,
        });
      }
    },
    async onRejectOrder(): Promise<void> {
      if (await this.pm.rejectOrder()) {
        await this.$root.pm.hydratePendingOrders();
        await this.$router.push({
          name: routeNames.HOME,
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.c2c-order-details {
  &__pilot-order-container {
    min-width: 400px;
    max-width: 400px;
  }
}
.add-button {
  margin-block-start: var(--inset-mid);
}
</style>
