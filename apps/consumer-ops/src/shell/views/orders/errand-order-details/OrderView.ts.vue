<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-flex gap-size="large" justify-content="space-between">
      <div class="order-journey-container">
        <errands-order-journey
          :order-journey="pm.structuredOrderJourney"
        ></errands-order-journey>
      </div>
      <div class="order-details-survv-shop-panels-container">
        <vg-grid gap-size="mid">
          <vg-flex
            class="order-details-survv-shop-buttons-container"
            gap-size="small"
            justify-content="space-between"
          >
            <div class="order-details-survv-shop-buttons-container__button">
              <vg-button
                v-if="pm.shouldShowCancelAction"
                expand
                outlined
                @click="pm.children.cancelErrandOrderPM.openCancelForm()"
                >{{ $t('ONLINE_ORDER_DETAILS_CANCEL') }}</vg-button
              >
            </div>
            <div class="order-details-survv-shop-buttons-container__button">
              <vg-button
                v-if="pm.shouldShowEditButton"
                expand
                dark
                @click="pm.openEditForm()"
                >{{ $t('ONLINE_ORDER_DETAILS_EDIT') }}</vg-button
              >
            </div>
          </vg-flex>
          <vg-panel
            collapsible
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
                  :max-height="'350px'"
                  :interactive="false"
                ></zones-map>
              </div>
            </div>
          </vg-panel>
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
            </vg-grid>
          </vg-panel>
          <vg-panel collapsible :title="$t('ONLINE_ORDER_DETAILS_CHARGING')">
            <vg-flex gap-size="small" justify-content="flex-end">
              <vg-pair
                v-if="!pm.shouldShowStructureForm"
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_CUSTOMERPURCHASES')"
                :value="`${pm.order.subTotal.toString()} ${$t(
                  pm.order.subTotal.currency
                )}`"
                dense
              ></vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_DELIVERY_FEE')"
                dense
              >
                <template #value>
                  <span>
                    {{
                      `${pm.order.deliveryFees.toString()} ${$t(
                        pm.order.deliveryFees.currency
                      )}`
                    }}
                  </span>
                </template>
              </vg-pair>
              <vg-pair
                max-width="50%"
                :label="$t('ONLINE_ORDER_DETAILS_TAX')"
                :value="`${pm.order.tax.toString()} ${$t(
                  pm.order.tax.currency
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
                :value="`${pm.order.consumedBalance.toString()} ${$t(
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
              ></vg-pair>
            </vg-flex>
          </vg-panel>
          <vg-panel
            v-if="!pm.shouldShowStructureForm"
            :title="$t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER')"
            dark
          >
            <vg-flex gap-size="mid">
              <vg-panel
                v-for="(pickUpPoint, index) in pm.nonDeletedPickupPoints"
                :key="`${index}${pickUpPoint.categoryDisplayName}`"
                :title="`${$t(pickUpPoint.categoryDisplayName)} - ${
                  pickUpPoint.location.locationDescription
                }`"
                title-bold
                collapsible
              >
                <vg-flex flex-direction="column" gap-size="mid">
                  <div>
                    <zones-map
                      :geojson="pickUpPoint.location.pickupLocation"
                      :max-height="'350px'"
                      :interactive="false"
                    ></zones-map>
                  </div>
                  <div
                    v-for="(item, itemIndex) in pickUpPoint.items"
                    :key="`${itemIndex}${item.name}`"
                  >
                    <order-item-card :item="item" :edit-mode="false" />
                  </div>
                  <div>
                    <vg-gallery
                      :gallery="pickUpPoint.uploadedImages"
                      image-size="60"
                    ></vg-gallery>
                  </div>
                </vg-flex>
              </vg-panel>
            </vg-flex>
          </vg-panel>
          <vg-panel
            v-if="pm.shouldShowStructureForm"
            :title="$t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER')"
            dark
          >
            <vg-flex gap-size="mid">
              <vg-panel
                v-for="(pickUpPoint, index) in pm.errandOrderForm.pickups"
                :key="`${index}${$t(pickUpPoint.category)}`"
                :title="`${$t(pickUpPoint.category)} - ${
                  pickUpPoint.locationName
                }`"
                title-bold
                collapsible
              >
                <vg-flex flex-direction="column" gap-size="mid">
                  <vg-select
                    :selection.sync="pickUpPoint.categoryId"
                    :options="pm.errandCategoriesSelection"
                    :validator="pickUpPoint.validators['categoryId']"
                    label="ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_CATEGORY"
                    max-width="100%"
                    width="100%"
                    required
                    outlined
                    :disabled="!pickUpPoint.canEdit"
                    @update:selection="onPickupCategoryUpdate(pickUpPoint)"
                  ></vg-select>
                  <vg-text-field
                    v-model.trim="pickUpPoint.locationName"
                    :validator="pickUpPoint.validators['locationName']"
                    type="text"
                    outlined
                    max-width="100%"
                    :disabled="!pickUpPoint.canEdit"
                    :label="`${$t(
                      'ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_LOCATION_NAME'
                    )}*`"
                  ></vg-text-field>
                </vg-flex>
                <vg-flex flex-direction="column" gap-size="mid">
                  <div>
                    <zones-map
                      :geojson="pickupPointMapGeoJSON(pickUpPoint.coordinates)"
                      :max-height="'350px'"
                      :interactive="false"
                    ></zones-map>
                  </div>
                  <div>
                    <vg-button
                      expand
                      large
                      :disabled="!pickUpPoint.canEdit"
                      @click="pm.showMapModal(pickUpPoint.coordinates, index)"
                    >
                      {{
                        $t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_EDIT_LOCATION')
                      }}
                    </vg-button>
                  </div>
                  <div
                    v-for="(item, itemIndex) in pickUpPoint.items"
                    :key="`${itemIndex}${item.name}`"
                  >
                    <order-item-card
                      :item="item"
                      :edit-mode="pickUpPoint.canEdit"
                      @remove:item="pm.deleteItem(index, itemIndex)"
                    />
                  </div>
                  <div class="errand-order-details-checkbox">
                    <vg-checkbox
                      v-show="
                        pm.shouldShowPickupFormPicturesCheckbox(pickUpPoint)
                      "
                      v-model="pickUpPoint.includePictures"
                      :disabled="!pickUpPoint.canEdit"
                      :label="
                        $t(
                          'ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_INCLUDE_PICTURES'
                        )
                      "
                      :hide-details="true"
                    ></vg-checkbox>
                    <vg-checkbox
                      v-show="
                        pm.shouldShowPickupFormVoiceNoteCheckbox(pickUpPoint)
                      "
                      v-model="pickUpPoint.includeVoiceNote"
                      :disabled="!pickUpPoint.canEdit"
                      :label="
                        $t(
                          'ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_INCLUDE_VOICE_NOTE'
                        )
                      "
                      :hide-details="true"
                    ></vg-checkbox>
                  </div>
                  <div>
                    <vg-flex
                      flex-direction="row"
                      justify-content="center"
                      gap-size="mid"
                    >
                      <div class="pickup-point-form-btn">
                        <vg-button
                          :disabled="
                            !pickUpPoint.canEdit ||
                            pm.errandOrderForm.pickups.length === 1
                          "
                          outlined
                          large
                          expand
                          @click="
                            pm.openRemovePickupDialog(
                              index,
                              `${$t(pickUpPoint.category)} - ${
                                pickUpPoint.locationName
                              }`
                            )
                          "
                        >
                          {{ $t('ONLINE_ORDER_DETAILS_REMOVE_POINT') }}
                        </vg-button>
                      </div>
                      <div class="pickup-point-form-btn">
                        <vg-button
                          outlined
                          large
                          expand
                          :disabled="!pickUpPoint.canEdit"
                          @click="
                            pm.openAddItemsForm(
                              `${$t(pickUpPoint.category)} - ${
                                pickUpPoint.locationName
                              }`,
                              index
                            )
                          "
                        >
                          {{ $t('ONLINE_ORDER_DETAILS_ADD_ITEM') }}
                        </vg-button>
                      </div>
                    </vg-flex>
                  </div>
                </vg-flex>
              </vg-panel>
              <div class="errand-order-details-pickup-point">
                <vg-button
                  v-if="pm.shoulShowAddPickupButton"
                  outlined
                  large
                  expand
                  @click="pm.addPickupPoint()"
                >
                  {{ $t('ONLINE_ORDER_DETAILS_ADD_PICKUP_POINT') }}
                </vg-button>
              </div>
            </vg-flex>
          </vg-panel>
          <vg-panel :title="$t('ONLINE_ORDER_DETAILS_C2C_ORIGINAL_ORDER')" dark>
            <vg-flex gap-size="mid">
              <vg-panel
                v-for="(pickUpPoint, index) in pm.order.orderPickups"
                :key="`${index}${pickUpPoint.categoryDisplayName}`"
                :title="`${$t(pickUpPoint.categoryDisplayName)} - ${
                  pickUpPoint.location.locationDescription
                }`"
                title-bold
                collapsible
              >
                <vg-flex flex-direction="column" gap-size="mid">
                  <div>
                    <div v-if="pickUpPoint.deleted" class="errand-message">
                      <div class="errand-message__details">
                        <div class="errand-message__error--text">
                          {{ $t('ONLINE_ORDER_DETAILS_DELETED_PICKUP_POINT') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <zones-map
                      :geojson="pickUpPoint.location.pickupLocation"
                      :max-height="'350px'"
                      :interactive="false"
                    ></zones-map>
                  </div>
                  <div>
                    <div
                      class="
                        vg-text-pre
                        vg-text-emphasis--low
                        vg-margin-block-start--small
                      "
                    >
                      {{ pickUpPoint.description }}
                    </div>
                  </div>
                  <div>
                    <vg-gallery
                      :gallery="pickUpPoint.uploadedImages"
                      image-size="60"
                    ></vg-gallery>
                  </div>
                  <div v-if="pickUpPoint.voiceNote">
                    <audio controls>
                      <source :src="pickUpPoint.voiceNote" type="audio/mpeg" />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </vg-flex>
              </vg-panel>
            </vg-flex>
          </vg-panel>
        </vg-grid>
      </div>
    </vg-flex>
    <add-items-form
      v-if="pm.shouldShowStructureForm"
      :form="pm.itemForm"
      :open="pm.shouldShowAddItemsForm"
      :title="pm.itemFormTitle"
      @submitted="pm.submitItemForm()"
      @discard="pm.closeItemForm()"
      @backdrop="pm.closeItemForm()"
    ></add-items-form>
    <rejection-reasons-form
      :open="pm.shouldOpenRejectForm"
      :form="pm.rejectionForm"
      :rejection-reasons="pm.clonedRejectionReasons"
      max-width="600px"
      @submitted="pm.submitRejectForm()"
      @discard="pm.closeRejectForm()"
      @backdrop="pm.closeRejectForm()"
      @search="pm.searchRejectReasons($event)"
    >
    </rejection-reasons-form>
    <cancellation-reasons-form
      :open="pm.children.cancelErrandOrderPM.shouldOpenCancelForm"
      :form="pm.children.cancelErrandOrderPM.cancellationForm"
      :cancellation-reasons="
        pm.children.cancelErrandOrderPM.categorizedReasonsList
      "
      :pm="pm.children.cancelErrandOrderPM"
      max-width="600px"
      @submitted="pm.submitCancellationForm()"
      @discard="pm.children.cancelErrandOrderPM.closeCancelForm()"
      @backdrop="pm.children.cancelErrandOrderPM.closeCancelForm()"
      @search="pm.children.cancelErrandOrderPM.searchReasons($event)"
    ></cancellation-reasons-form>
    <vg-floating-container
      v-if="pm.shouldShowStructureForm"
      :floater-styles="{ 'z-index': 2 }"
    >
      <div v-if="pm.shouldShowEditForm" class="form-actions-container__flex">
        <div class="form-actions-container__flex__discard">
          <vg-button outlined large width="220px" @click="pm.closeEditForm()">
            {{ $t('ONLINE_ORDER_DETAILS_CANCEL_EDIT_ERRAND') }}
          </vg-button>
        </div>
        <div class="form-actions-container__flex__save">
          <vg-button
            large
            width="220px"
            :disabled="!pm.errandOrderForm.isValid()"
            @click="pm.errandOrderForm.submit()"
          >
            {{ $t('ONLINE_ORDER_DETAILS_SAVE_EDIT_ERRAND') }}
          </vg-button>
        </div>
      </div>

      <div v-if="!pm.shouldShowEditForm" class="form-actions-container__flex">
        <div class="form-actions-container__flex__discard">
          <vg-button outlined large width="220px" @click="pm.openRejectForm()">
            {{ $t('ONLINE_ORDER_DETAILS_REJECT_ERRAND') }}
          </vg-button>
        </div>
        <div class="form-actions-container__flex__save">
          <vg-button
            large
            width="220px"
            :disabled="!pm.errandOrderForm.isValid()"
            @click="pm.errandOrderForm.submit()"
          >
            {{ $t('ONLINE_ORDER_DETAILS_ACCEPT_ERRAND') }}
          </vg-button>
        </div>
      </div>
    </vg-floating-container>
    <search-map-modal
      :starting-point-coordinates="pm.mapConfig.point"
      :supported-zones-coordinates="pm.mapConfig.supportedZones"
      :open="pm.shouldShowMapModal"
      @submitted="
        pm.submitMapModal($event.pickupPointCoordinates, $event.locationName)
      "
      @discard="pm.closeMapModal()"
      @backdrop="pm.closeMapModal()"
    ></search-map-modal>
    <vg-dialog
      :open="pm.shouldShowRemovePickupDialog"
      :loading="pm.loading"
      :persistent="pm.loading"
      confirmation-label="YES"
      @update:open="pm.shouldShowRemovePickupDialog = false"
      @apply="pm.removePickupPoint()"
    >
      <template #title>
        <h2>
          {{ $t('ONLINE_ORDER_DETAILS_REMOVE_PICKUP_POINT_TITLE') }}
        </h2>
      </template>
      {{
        $t('ONLINE_ORDER_DETAILS_REMOVE_PICKUP_POINT_MESSAGE', {
          title: pm.pickupTitleToRemove,
        })
      }}
    </vg-dialog>
  </vg-content>
</template>

<script lang="ts">
import AddItemsForm from './AddItemsForm.ts.vue';
import ErrandsOrderJourney from './ErrandsOrderJourney.ts.vue';
import OrderItemCard from './OrderItemCard.ts.vue';
import RejectionReasonsForm from './RejectionReasonsForm.ts.vue';
import SearchMapModal from './SearchMapModal.vue';
import Vue from 'vue';
import ZonesMap from '../../../components/ZonesMap.vue';
import {
  GeoJSONPoint,
  GeojsonFeatureCollection,
} from '@survv/commons/core/models/GeoJSON';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgFloatingContainer } from '@survv/commons/components/VgFloatingContainer';
import { VgGallery } from '@survv/commons/components/VgGallery';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';

import CancellationReasonsForm from './CancellationReasonsForm.ts.vue';
import VgDialog from '../../../components/VgDialog.vue';
import { CancelErrandOrderPM } from '../../../../core/presentation-models/orders/CancelErrandOrderPM';
import { CancelErrandOrderRepoImpl } from '../../../repositories/orders/CancelErrandOrderRepoImpl';
import { ErrandCategoriesRepoImpl } from '../../../repositories/orders/ErrandCategoriesRepoImpl';
import { ErrandOnlineOrderPM } from '../../../../core/presentation-models/orders/ErrandOnlineOrderPM';
import { ErrandOrdersRepoImpl } from '../../../repositories/orders/ErrandOrdersRepoImpl';
import { ErrandPickupForm } from '../../../../core/models/ErrandOrderForms';
import { ErrandsOrderJourneyRepoImpl } from '../../../repositories/orders/ErrandsOrderJourneyRepoImpl';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';

export default Vue.extend({
  name: 'OrderView',
  components: {
    VgContent,
    VgFlex,
    VgPair,
    VgGrid,
    VgGallery,
    VgDialog,
    VgButton,
    ErrandsOrderJourney,
    SearchMapModal,
    VgTextField,
    VgFloatingContainer,
    VgPanel,
    VgSelect,
    OrderItemCard,
    AddItemsForm,
    RejectionReasonsForm,
    CancellationReasonsForm,
    ZonesMap,
    VgCheckbox,
  },
  data() {
    return {
      OrderType,
      pm: new ErrandOnlineOrderPM({
        orderId: Number(this.$route.params.orderId),
        errandOrdersRepo: new ErrandOrdersRepoImpl(),
        errandCategoriesRepo: new ErrandCategoriesRepoImpl(),
        errandsOrderJourneyRepo: new ErrandsOrderJourneyRepoImpl(),
        notificationService,
        children: {
          cancelErrandOrderPM: new CancelErrandOrderPM({
            orderId: Number(this.$route.params.orderId),
            notificationService,
            cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
          }),
        },
      }),
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
  },
  methods: {
    pickupPointMapGeoJSON(point: GeojsonCoordinates): GeojsonFeatureCollection {
      const coordinates =
        point.length > 0
          ? point
          : (this.pm.order.customerLocationFeature.geometry
              .coordinates as GeojsonCoordinates);

      return {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: new GeoJSONPoint(coordinates),
            properties: {
              dataType: 'CUSTOMER_LOCATION',
            },
          },
        ],
      };
    },
    async onPickupCategoryUpdate(pickUpPoint: ErrandPickupForm): Promise<void> {
      await this.pm.calculateCharging();

      const selectedCategoryLabel = this.pm.errandCategoriesSelection.find(
        (errandCategoriesSelection) => {
          return errandCategoriesSelection.value === pickUpPoint.categoryId;
        }
      )?.label as MultilingualString;

      pickUpPoint.category = new MultilingualString(selectedCategoryLabel);
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
    max-width: 100%;
  }
  &__phone {
    grid-area: 1 / 2 / 2 / 3;
    max-width: 100%;
  }
  &__address {
    grid-area: 3 / 1 / 3 / 3;
    max-width: 100%;
  }
  &__map {
    grid-area: 4 / 1 / 4 / 3;
    max-width: 100%;
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
@media screen and (max-width: 900px) {
  .order-journey-container {
    width: 100%;
  }
  .order-details-survv-shop-panels-container {
    width: 100%;
  }
}
.form-actions-container {
  &__flex {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 var(--inset-large);
    &__save {
      margin-inline-start: var(--inset-mid);
    }
  }
}
.errand-order-details-pickup-point {
  width: 100%;
}
.pickup-point-form-btn {
  flex-grow: 1;
}
.errand-message {
  &__details {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 0 auto;
    flex: 1 0 auto;
    max-width: 100%;
    overflow: hidden;
  }
  &__error--text {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    font-size: 14px;
    min-height: 12px;
    min-width: 1px;
    position: relative;
    color: var(--color-primary) !important;
    caret-color: var(--color-primary) !important;
    line-height: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }
}
</style>

<style lang="scss">
.errand-order-details-checkbox .v-input .v-input__control .v-input__slot {
  justify-content: space-between;
  flex-direction: row-reverse;
}
.errand-order-details-checkbox .v-input .v-input__control {
  flex-grow: 1;
}
</style>
