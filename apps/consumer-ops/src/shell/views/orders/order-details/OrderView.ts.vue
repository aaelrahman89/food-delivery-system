<template>
  <vg-content v-if="orderDetailsPM.order" :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-flex gap-size="large" justify-content="space-between">
      <div class="order-journey-container">
        <order-journey
          v-if="orderDetailsPM.order && orderDetailsPM.orderJourney"
          :order-journey="orderDetailsPM.structuredOrderJourney"
        ></order-journey>
        <div style="display: flex; justify-content: flex-end">
          <order-status-manual-update-dialog
            v-if="pm.order.type.equals(OrderType.B2C) && pm.order.actionDisplay"
            :order="pm.order"
            :order-status="pm.order.status.value"
            style="margin-top: 20px"
            @updated:order-status="updateOrder"
          ></order-status-manual-update-dialog>
        </div>
      </div>
      <div class="order-details-survv-shop-panels-container">
        <vg-grid gap-size="mid">
          <vg-flex
            v-if="!pm.isEditMode"
            class="order-details-survv-shop-buttons-container"
            gap-size="small"
            justify-content="space-between"
          >
            <div class="order-details-survv-shop-buttons-container__button">
              <order-cancel
                v-if="!orderDetailsPM.shouldHideCancelAction"
                :pm="orderDetailsPM"
                @cancelled:order="onOrderCancel()"
              />
            </div>
            <div
              v-if="pm.order.actionDisplay"
              class="order-details-survv-shop-buttons-container__button"
            >
              <vg-button
                v-if="!orderDetailsPM.shouldHideEditAction"
                :disabled="
                  pm.isC2COrder || orderDetailsPM.shouldDisableEditAction
                "
                expand
                outlined
                @click="pm.onOrderUpdateStart()"
                >{{ $t('ONLINE_ORDER_DETAILS_EDIT_ORDER_ITEMS') }}</vg-button
              >
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
                >{{ $t('ONLINE_ORDER_DETAILS_DISCARD') }}</vg-button
              >
            </div>
            <div class="order-details-survv-shop-buttons-container__button">
              <vg-button
                expand
                dark
                :disabled="!pm.canSaveChanges"
                @click="pm.onOrderUpdateFinish()"
                >{{ $t('ONLINE_ORDER_DETAILS_SAVE') }}</vg-button
              >
            </div>
          </vg-flex>
          <vg-panel
            collapsible
            :collapsed="pm.isEditMode"
            :title="$t('ONLINE_ORDER_DETAILS_CUSTOMER_DETAILS')"
          >
            <div class="customer-info-container">
              <div class="customer-info-container__name">
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_NAME')"
                  :value="pm.order.customerName"
                  dense
                ></vg-pair>
              </div>
              <div class="customer-info-container__phone">
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER')"
                  :value="pm.order.customerMobileNo"
                  dense
                ></vg-pair>
              </div>
              <div class="customer-info-container__address">
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CUSTOMER_ADDRESS')"
                  :value="pm.order.customerAddress"
                  dense
                ></vg-pair>
              </div>
              <div class="customer-info-container__map">
                <zones-map
                  :geojson="customerMapGeoJSON"
                  :interactive="false"
                ></zones-map>
              </div>
            </div>
          </vg-panel>
          <vg-panel
            collapsible
            :collapsed="pm.isEditMode"
            :title="$t('ONLINE_ORDER_DETAILS_ORDER_BRIEF')"
          >
            <vg-grid gap-size="small" columns="1fr 1fr">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_ORDER_ID')"
                :value="pm.order.customerOrderId"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_CREATION_TIME')"
                :value="pm.order.creationDate.toDatetimeString()"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_PAYMENT_METHOD')"
                :value="$t(pm.order.paymentMethod)"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_ORDER_STATUS')"
                :value="$t(pm.order.status)"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_ORDER_TYPE')"
                :value="$t(pm.order.type)"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.order.scheduled"
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_ORDER_SCHEDULED_TO')"
                :value="$t(pm.order.scheduledTo)"
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
                :label="$t('ONLINE_ORDER_DETAILS_VENDOR_TASK_ID')"
                :value="$t(pm.order.vendorTaskId)"
                dense
              ></vg-pair>
            </vg-grid>
          </vg-panel>
          <vg-panel
            collapsible
            :collapsed="pm.isEditMode"
            :title="$t('ONLINE_ORDER_DETAILS_VENDOR_DETAILS')"
          >
            <vg-grid gap-size="small" columns="1fr 1fr">
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_VENDOR_NAME')"
                :value="$t(pm.order.vendorDisplayName)"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_VENDOR_ID')"
                :value="pm.order.vendorId"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_BRANCH_LABEL')"
                :value="pm.order.branchLabel"
                dense
              ></vg-pair>
              <vg-pair
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_FAKE_VENDOR_LABEL')"
                :value="pm.order.fakeVendor ? $t('YES') : $t('NO')"
                dense
              ></vg-pair> </vg-grid
          ></vg-panel>
          <vg-panel
            v-if="pm.shouldShowPromoCodeDetails"
            collapsible
            :collapsed="pm.isEditMode"
            :title="$t('ONLINE_ORDER_DETAILS_PROMO_CODE')"
          >
            <vg-grid gap-size="small">
              <vg-grid gap-size="small" columns="1fr 1fr">
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CODE')"
                  :value="$t(pm.order.promoCode.name)"
                  dense
                ></vg-pair>
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_USAGE_TYPE')"
                  :value="$t(pm.order.promoCode.usage)"
                  dense
                ></vg-pair>
                <vg-pair
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_MIN_SPENDING')"
                  :value="pm.order.promoCode.minSpending"
                  dense
                ></vg-pair>
                <vg-pair
                  v-if="pm.shouldShowPromoCodeCalculationType"
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CALCULATION_TYPE')"
                  :value="$t(pm.order.promoCode.type)"
                  dense
                ></vg-pair>
                <vg-pair
                  v-if="pm.shouldShowPromoCodePercentage"
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_PERCENTAGE')"
                  :value="pm.order.promoCode.percentage"
                  dense
                ></vg-pair>
                <vg-pair
                  v-if="pm.shouldShowPromoCodeCap"
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_CAP')"
                  :value="pm.order.promoCode.cap"
                  dense
                ></vg-pair>
                <vg-pair
                  v-if="pm.shouldShowPromoCodeValue"
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_VALUE')"
                  :value="pm.order.promoCode.value"
                  dense
                ></vg-pair>
              </vg-grid>
              <promocode-msg
                v-if="pm.shouldShowPromoCodeCashbackAmount"
                :color="'success'"
                :msg="
                  $t('ONLINE_ORDER_DETAILS_CASHBACK_MSG', {
                    amount: `${pm.order.cashbackAmount.toString()} ${$t(
                      pm.order.cashbackAmount.currency
                    )}`,
                  })
                "
              ></promocode-msg>
              <promocode-msg
                v-if="pm.shouldShowPromoCodeShortage"
                :color="'error'"
                :msg="
                  $t('ONLINE_ORDER_DETAILS_PROMO_CODE_SHORTAGE', {
                    amount: `${pm.order.promoCode.minSpendingShortage.toString()} ${$t(
                      pm.order.promoCode.minSpendingShortage.currency
                    )}`,
                  })
                "
              ></promocode-msg>
            </vg-grid>
          </vg-panel>
          <vg-panel
            v-if="pm.shouldShowReferralCodeDetails"
            collapsible
            :title="$t('ONLINE_ORDER_DETAILS_REFERRAL_CODE')"
            :collapsed="pm.isEditMode"
          >
            <vg-grid gap-size="small" columns="1fr 1fr">
              <vg-pair
                dense
                max-width="100%"
                :label="$t('ONLINE_ORDER_DETAILS_REFERRAL_CODE_NAME')"
                :value="pm.order.referralCode.name"
              ></vg-pair>
              <div v-if="pm.shouldShowRefereePercentage">
                <vg-pair
                  dense
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_REFEREE_PERCENTAGE')"
                  :value="pm.order.referralCode.refereePercentage"
                ></vg-pair>
                <vg-pair
                  dense
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_REFEREE_CAP')"
                  :value="pm.order.referralCode.refereeCap"
                ></vg-pair>
              </div>
              <div v-if="pm.shouldShowRefereeFixedDiscount">
                <vg-pair
                  dense
                  max-width="100%"
                  :label="$t('ONLINE_ORDER_DETAILS_REFERRAL_FIXED_DISCOUNT')"
                  :value="pm.order.referralCode.fixedDiscountAmount"
                ></vg-pair>
              </div>
            </vg-grid>
            <promocode-msg
              v-if="pm.shouldShowReferralMinimumSpendingShortage"
              :color="'error'"
              :msg="
                $t('ONLINE_ORDER_DETAILS_PROMO_CODE_SHORTAGE', {
                  amount: `${pm.order.referralCode.minSpendingShortage.toString()} ${$t(
                    pm.order.referralCode.minSpendingShortage.currency
                  )}`,
                })
              "
            ></promocode-msg>
          </vg-panel>
          <vg-panel collapsible :title="$t('ONLINE_ORDER_DETAILS_ORDER_ITEMS')">
            <vg-grid class="order-details-container" gap-size="mid">
              <vg-flex
                v-if="orderDetailsPM.orderHasUnavailableItemsOrSelections()"
                align-items="center"
                class="order-details-container__unavailable-items"
              >
                <vg-svg
                  :src="SVG_GLOBAL_UNAVAILABLE"
                  fill="var(--color-on-primary)"
                ></vg-svg>
                <div
                  class="order-details-container__unavailable-items__message"
                >
                  {{ $t('ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION') }}
                </div>
              </vg-flex>
              <order-item-card
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
                        {{ $t('ONLINE_ORDER_DETAILS_ADD_ITEM') }}
                      </div>
                    </vg-flex>
                  </vg-button>
                </div></vg-flex
              >
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
                v-if="pm.shouldShowOrderTax"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TAX')"
                :value="`${pm.order.subTotalTax.toString()} ${$t(
                  pm.order.subTotalTax.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.shouldShowPromoCodeDiscountAmount"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_PROMO_DISCOUNT')"
                :value="`${pm.order.discountAmount.toString()} ${$t(
                  pm.order.discountAmount.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.shouldShowReferralCodeDetails"
                :label="$t('ONLINE_ORDER_DETAILS_REFEREE_DISCOUNT')"
                :value="`${pm.order.referralCode.refereeDiscountAmount.toString()} ${$t(
                  pm.order.referralCode.refereeDiscountAmount.currency
                )}`"
                max-width="50%"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_DELIVERY_FEE')"
                dense
              >
                <template #value>
                  {{
                    `${pm.order.deliveryFees.toString()} ${$t(
                      pm.order.deliveryFees.currency
                    )}`
                  }}
                </template>
              </vg-pair>
              <vg-pair
                v-if="pm.shouldShowDeliveryTax"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DELIVERY_VAT')"
                :value="`${pm.order.deliveryTax.toString()} ${$t(
                  pm.order.deliveryTax.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.shouldShowServiceFeeWithTax"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DELIVERY_SERVICE_FEE_WITH_TAX')"
                :value="`${pm.order.serviceFeeWithTax.toString()} ${$t(
                  pm.order.serviceFeeWithTax.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.shouldShowPromoCodeDeliveryFeeDiscountAmount"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_DELIVERY_FEE_DISCOUNT')"
                :value="`${pm.order.deliveryFeesDiscountAmount.toString()} ${$t(
                  pm.order.deliveryFeesDiscountAmount.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                v-if="pm.shouldShowChangeAmount"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_CHANGE_AMOUNT')"
                :value="`${pm.order.returnedChange.toString()} ${$t(
                  pm.order.returnedChange.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TOTAL')"
                :value="`${pm.order.total.toString()} ${$t(
                  pm.order.total.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_CONSUMED_BALANCE')"
                :value="`-${pm.order.consumedBalance.toString()} ${$t(
                  pm.order.consumedBalance.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TOTAL_DUE_AMOUNT')"
                :value="`${pm.order.totalDueAmount.toString()} ${$t(
                  pm.order.totalDueAmount.currency
                )}`"
                dense
              ></vg-pair></vg-flex
          ></vg-panel>
          <vg-panel
            v-if="orderDetailsPM.shouldShowC2COrderSection"
            :title="$t('ONLINE_ORDER_DETAILS_C2C_ORIGINAL_ORDER')"
          >
            <vg-flex gap-size="mid"
              ><vg-panel
                v-for="item in pm.order.items"
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
        </vg-grid>
      </div>
    </vg-flex>
    <order-item-customization-bottom-sheet
      :open="pm.shouldShowExistingItemCustomization"
      :item-id="pm.selectedOrderItem.itemId"
      :order-item="pm.selectedOrderItem"
      :title="$t('ITEM_CUSTOMIZATION_HEADER_EXISTING_ITEM')"
      :save-label="$t('ITEM_CUSTOMIZATION_BUTTON_EXISTING_ITEM')"
      @backdrop="pm.onOrderItemUpdateCancellation()"
      @save:item="pm.onOrderItemUpdateFinish($event)"
    ></order-item-customization-bottom-sheet>
    <order-item-customization-bottom-sheet
      :open="pm.shouldShowNewItemCustomization"
      :item-id="pm.selectedCatalogueItem.id"
      :title="$t('ITEM_CUSTOMIZATION_HEADER_NEW_ITEM')"
      :save-label="$t('ITEM_CUSTOMIZATION_BUTTON_NEW_ITEM')"
      @backdrop="pm.onOrderItemAdditionCancellation()"
      @save:item="pm.onOrderItemAdditionFinish($event)"
    ></order-item-customization-bottom-sheet>
    <order-available-catalogue-items-bottom-sheet
      :open="pm.shouldShowCatalogueItemsList"
      :items="pm.catalogueItemsList"
      @search="pm.onCatalogueItemsSearch($event)"
      @backdrop="pm.onCatalogueItemsListClose()"
      @click:item="pm.onItemSelectionFromCatalogueItemsList($event)"
    >
    </order-available-catalogue-items-bottom-sheet>
  </vg-content>
</template>

<script lang="ts">
import OrderAvailableCatalogueItemsBottomSheet from './OrderAvailableCatalogueItemsBottomSheet.ts.vue';
import OrderCancel from './OrderCancel.vue';
import OrderDetailsPM from '../../../../core/presentation-models/orders/OrderDetailsPM';
import OrderItemCard from './OrderItemCard.ts.vue';
import OrderItemCustomizationBottomSheet from './OrderItemCustomizationBottomSheet.ts.vue';
import OrderJourney from './OrderJourney.ts.vue';
import OrderStatusManualUpdateDialog from './OrderStatusManualUpdateDialog.ts.vue';
import PromocodeMsg from './PromoCodeMsg.ts.vue';
import Vue from 'vue';
import ZonesMap from '../../../components/ZonesMap.vue';
import { CancelOrderPM } from '../../../../core/presentation-models/orders/CancelOrderPM';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { EditOnlineOrderPM } from '../../../../core/presentation-models/orders/EditOnlineOrderPM';
import { GeojsonFeatureCollection } from '@survv/commons/core/models/GeoJSON';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { SVG_GLOBAL_UNAVAILABLE, SVG_ICON_PLUS } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGallery } from '@survv/commons/components/VgGallery';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'OrderView',
  components: {
    OrderStatusManualUpdateDialog,
    ZonesMap,
    VgContent,
    VgButton,
    VgPanel,
    VgFlex,
    VgPair,
    VgSvg,
    VgGrid,
    VgGallery,
    OrderCancel,
    OrderJourney,
    OrderItemCard,
    OrderItemCustomizationBottomSheet,
    OrderAvailableCatalogueItemsBottomSheet,
    PromocodeMsg,
  },
  data() {
    return {
      OrderType,
      pm: new EditOnlineOrderPM({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
      }),
      orderDetailsPM: new OrderDetailsPM({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
        children: {
          cancelOrderPM: new CancelOrderPM({
            orderId: Number(this.$route.params.orderId),
            notificationService,
            ordersRepo: new OrdersRepoImpl(),
          }),
        },
      }),
      SVG_ICON_PLUS,
      SVG_GLOBAL_UNAVAILABLE,
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.ORDERS_LIST,
          text: this.$t('ORDERS_LIST'),
        },
        {
          routeName: this.$route.name as string,
          text: this.pm.order.customerOrderId,
        },
      ];
    },
    customerMapGeoJSON(): GeojsonFeatureCollection {
      return {
        type: 'FeatureCollection',
        features: [this.pm.order.customerLocationFeature],
      };
    },
  },
  async created() {
    await this.pm.init();
    await this.orderDetailsPM.init();
  },
  methods: {
    async updateOrder(): Promise<void> {
      await this.pm.onOrderStatusUpdated();
      await this.orderDetailsPM.onOrderStatusUpdate();
    },
    async onOrderCancel(): Promise<void> {
      await this.pm.onOrderStatusUpdated();
      await this.orderDetailsPM.onCancelFormSubmit();
    },
  },
});
</script>

<style scoped lang="scss">
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
.order-journey-container {
  min-width: 300px;
  width: calc(50% - var(--inset-large));
}
.order-details-survv-shop-panels-container {
  width: calc(50% - var(--inset-large));
}
.order-details-survv-shop-buttons-container {
  &__button {
    width: calc(50% - var(--inset-mid));
  }
}
.items-selection-list .vg-bottom-sheet-list__body__group__item {
  padding: 15px 20px 15px 10px;
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

  @media screen and (max-width: 900px) {
    .order-journey-container {
      width: 100%;
    }
    .order-details-survv-shop-panels-container {
      width: 100%;
    }
  }
}
</style>
