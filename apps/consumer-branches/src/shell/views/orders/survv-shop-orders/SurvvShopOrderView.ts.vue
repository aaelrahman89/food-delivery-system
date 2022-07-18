<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-flex gap-size="mid" no-wrap>
      <div class="order-journey-container">
        <order-journey
          :order-journey="orderJourneyPM.orderJourney"
        ></order-journey>
      </div>
      <vg-grid class="order-details-survv-shop-panels-container" gap-size="mid">
        <vg-flex
          v-if="!pm.isEditMode"
          class="order-details-survv-shop-buttons-container"
          gap-size="small"
          justify-content="flex-end"
        >
          <div class="order-details-survv-shop-buttons-container__button">
            <vg-button expand outlined @click="pm.onOrderUpdateStart()">{{
              $t('SURVV_SHOP_ORDER_DETAILS_EDIT_ORDER_ITEMS')
            }}</vg-button>
          </div>
        </vg-flex>
        <vg-flex
          v-if="pm.isEditMode"
          class="order-details-survv-shop-buttons-container"
          gap-size="small"
          justify-content="space-between"
        >
          <div class="order-details-survv-shop-buttons-container__button">
            <vg-button
              expand
              outlined
              @click="pm.onOrderUpdateCancellation()"
              >{{ $t('SURVV_SHOP_ORDER_DETAILS_CANCEL') }}</vg-button
            >
          </div>
          <div class="order-details-survv-shop-buttons-container__button">
            <vg-button
              expand
              dark
              :disabled="!pm.canSaveChanges"
              @click="pm.onOrderUpdateFinish()"
              >{{ $t('SURVV_SHOP_ORDER_DETAILS_SAVE') }}</vg-button
            >
          </div>
        </vg-flex>
        <vg-panel
          collapsible
          :collapsed="pm.isEditMode"
          :title="$t('SURVV_SHOP_ORDER_DETAILS_CUSTOMER_DETAILS')"
        >
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_CUSTOMER_NAME')"
              :value="pm.order.customerName"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER')"
              :value="pm.order.customerMobileNo"
              dense
            ></vg-pair>
          </vg-grid>
        </vg-panel>
        <vg-panel
          collapsible
          :collapsed="pm.isEditMode"
          :title="$t('SURVV_SHOP_ORDER_DETAILS_ORDER_BRIEF')"
        >
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_ORDER_ID')"
              :value="pm.order.customerOrderId"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_CREATION_TIME')"
              :value="pm.order.creationDate.toDatetimeString()"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_PAYMENT_METHOD')"
              :value="$t(pm.order.paymentMethod)"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_ORDER_STATUS')"
              :value="$t(pm.order.status)"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_ORDER_TYPE')"
              :value="$t(pm.order.type)"
              dense
            ></vg-pair> </vg-grid
        ></vg-panel>
        <vg-panel
          collapsible
          :collapsed="pm.isEditMode"
          :title="$t('SURVV_SHOP_ORDER_DETAILS_VENDOR_DETAILS')"
        >
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_VENDOR_NAME')"
              :value="$t(pm.order.vendorDisplayName)"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_VENDOR_ID')"
              :value="pm.order.vendorId"
              dense
            ></vg-pair></vg-grid
        ></vg-panel>
        <vg-panel collapsible :title="$t('SURVV_SHOP_ORDER_DETAILS_CHARGING')">
          <vg-grid gap-size="small" columns="1fr 1fr">
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_SUBTOTAL')"
              :value="`${pm.order.subTotal.toString()} ${$t(
                pm.order.subTotal.currency
              )}`"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_TAX')"
              :value="`${pm.order.tax.toString()} ${$t(pm.order.tax.currency)}`"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_DELIVERY_FEE')"
              :value="`${pm.order.deliveryFees.toString()} ${$t(
                pm.order.deliveryFees.currency
              )}`"
              dense
            ></vg-pair>
            <vg-pair
              max-width="100%"
              :label="$t('SURVV_SHOP_ORDER_DETAILS_TOTAL')"
              :value="`${pm.order.total.toString()} ${$t(
                pm.order.total.currency
              )}`"
              dense
            ></vg-pair></vg-grid
        ></vg-panel>
        <vg-panel
          collapsible
          :title="$t('SURVV_SHOP_ORDER_DETAILS_ORDER_ITEMS')"
        >
          <vg-grid gap-size="mid">
            <survv-shop-order-item-card
              v-for="(item, itemIndex) in pm.order.items"
              :key="itemIndex"
              :item="item"
              :edit-mode="pm.isEditMode"
              @edit:item="pm.onOrderItemUpdateStart(itemIndex)"
              @remove:item="pm.onOrderItemRemoval(itemIndex)"
            />
            <vg-flex justify-content="center" gap-size="small"
              ><div v-if="pm.isEditMode">
                <vg-button
                  outlined
                  large
                  @click="pm.onOrderItemAdditionStart()"
                >
                  <vg-flex
                    align-items="center"
                    justify-content="center"
                    no-wrap
                  >
                    <div>
                      <vg-svg
                        :src="SVG_ICON_PLUS"
                        width="14px"
                        height="14px"
                        fill="var(--color-primary)"
                      ></vg-svg>
                    </div>
                    <div class="vg-padding-inline-start--small">
                      {{ $t('SURVV_SHOP_ORDER_DETAILS_ADD_ITEM') }}
                    </div>
                  </vg-flex>
                </vg-button>
              </div></vg-flex
            >
          </vg-grid>
        </vg-panel>
      </vg-grid>
    </vg-flex>
    <item-customization-bottom-sheet
      :open="pm.shouldShowExistingItemCustomization"
      :item-id="pm.selectedOrderItem.itemId"
      :order-item="pm.selectedOrderItem"
      :title="$t('ITEM_CUSTOMIZATION_HEADER_EXISTING_ITEM')"
      :save-label="$t('ITEM_CUSTOMIZATION_BUTTON_EXISTING_ITEM')"
      @backdrop="pm.onOrderItemUpdateCancellation()"
      @save:item="pm.onOrderItemUpdateFinish($event)"
    ></item-customization-bottom-sheet>
    <item-customization-bottom-sheet
      :open="pm.shouldShowNewItemCustomization"
      :item-id="pm.selectedCatalogueItem.id"
      :title="$t('ITEM_CUSTOMIZATION_HEADER_NEW_ITEM')"
      :save-label="$t('ITEM_CUSTOMIZATION_BUTTON_NEW_ITEM')"
      @backdrop="pm.onOrderItemAdditionCancellation()"
      @save:item="pm.onOrderItemAdditionFinish($event)"
    ></item-customization-bottom-sheet>
    <available-catalogue-items-bottom-sheet
      :open="pm.shouldShowCatalogueItemsList"
      :items="pm.catalogueItemsList"
      @search="pm.onCatalogueItemsSearch($event)"
      @backdrop="pm.onCatalogueItemsListClose()"
      @click:item="pm.onItemSelectionFromCatalogueItemsList($event)"
    >
    </available-catalogue-items-bottom-sheet>
  </vg-content>
</template>

<script lang="ts">
import AvailableCatalogueItemsBottomSheet from './AvailableCatalogueItemsBottomSheet.ts.vue';
import ItemCustomizationBottomSheet from './ItemCustomizationBottomSheet.ts.vue';
import OrderDetailsPM from '../../../../core/deprecated/orders/OrderDetailsPM';
import OrderJourney from '../order-details/OrderJourney.ts.vue';
import SurvvShopOrderItemCard from './SurvvShopOrderItemCard.ts.vue';
import Vue from 'vue';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { SVG_ICON_PLUS } from '@survv/assets';
import { SurvvShopOrderPM } from '../../../../core/presentation-models/orders/SurvvShopOrderPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'SurvvShopOrderView',
  components: {
    VgContent,
    VgButton,
    VgPanel,
    VgFlex,
    VgPair,
    VgSvg,
    VgGrid,
    OrderJourney,
    SurvvShopOrderItemCard,
    ItemCustomizationBottomSheet,
    AvailableCatalogueItemsBottomSheet,
  },
  data() {
    return {
      pm: new SurvvShopOrderPM({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
      }),
      orderJourneyPM: new OrderDetailsPM({
        orderId: Number(this.$route.params.orderId),
      }),
      SVG_ICON_PLUS,
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
    await this.orderJourneyPM.init();
  },
});
</script>

<style scoped lang="scss">
.order-journey-container {
  min-width: 300px;
  width: 30%;
}
.order-details-survv-shop-panels-container {
  flex-grow: 1;
}
.order-details-survv-shop-buttons-container {
  &__button {
    width: calc(50% - var(--inset-mid));
  }
}
.items-selection-list .vg-bottom-sheet-list__body__group__item {
  padding: 15px 20px 15px 10px;
}
</style>
