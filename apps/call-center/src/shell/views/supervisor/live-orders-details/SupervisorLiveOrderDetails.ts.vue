<template>
  <div class="order-details-container">
    <div class="order-details-container__header">
      <div class="panel-title">
        {{
          $t('SUPERVISOR_LIVE_ORDER_DETAILS', {
            orderId: message.state.order.customerOrderId,
          })
        }}
      </div>
    </div>
    <div
      class="order-details-container__body"
      :class="{ padded: shouldShowActions }"
    >
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
    <div v-if="shouldShowActions" class="order-details-container__floating">
      <vg-flex
        class="order-details-action-buttons-container"
        gap-size="x-large"
        justify-content="center"
      >
        <div class="order-details-action-buttons-container__button">
          <vg-button expand outlined @click="openRejectOrderForm">
            {{ $t('REJECT_ORDER') }}
          </vg-button>
        </div>
        <div class="order-details-action-buttons-container__button">
          <vg-button expand dark @click="openAcceptOrderForm">
            {{ $t('ACCEPT_ORDER') }}
          </vg-button>
        </div>
      </vg-flex>
      <div
        v-if="shouldShowAssignedAgent"
        class="order-details-container__assigned-agent"
      >
        {{
          $t('SUPERVISOR_LIVE_ORDER_DETAILS_ASSIGNED_AGENT_MESSAGE', {
            email: message.state.order.assignedAgent.email,
          })
        }}
      </div>
    </div>

    <accept-order-bottom-sheet
      :open="message.acceptFormStatus === 'OPENED'"
      :submittable="message.acceptButtonStatus === 'ENABLED'"
      :form="message.state.acceptOrderForm"
      :validators="message.acceptOrderFormValidators()"
      @submitted="acceptOrder"
      @discard="closeAcceptOrderForm"
      @backdrop="closeAcceptOrderForm"
      @input="validateAcceptForm"
    />
    <rejection-reasons-form
      :open="message.rejectFormStatus === 'OPENED'"
      :form="message.state.rejectOrderForm"
      :rejection-reasons="message.state.clonedRejectionReasons"
      :submittable="message.rejectButtonStatus === 'ENABLED'"
      :reason-label.sync="currentReasonLabel"
      max-width="600px"
      @input="validateRejectForm"
      @submitted="submitRejectForm()"
      @discard="closeRejectOrderForm()"
      @backdrop="closeRejectOrderForm()"
      @search="searchRejectionReasons($event)"
    />
    <branch-busy-bottom-sheet
      :open="message.branchBusyFormStatus === 'OPENED'"
      :title="$t('BRANCH_BUSY_LIST_HEADER')"
      :b2c-branch-status.sync="message.state.rejectOrderForm.b2cBranchStatus"
      :branch-status-list="message.state.b2cBranchStatusList"
      @submit:form="submitRejectForm()"
      @backdrop="closeBranchBusyForm()"
    />
    <unavailable-items-bottom-sheet
      :open="message.unavailableItemsFormStatus === 'OPENED'"
      :title="$t('ITEMS_UNAVAILABLE_LIST_HEADER')"
      :items="message.state.order.items"
      :selected-items="message.state.rejectOrderForm.unavailableItems"
      :selected-selections="message.state.rejectOrderForm.unavailableSelections"
      :notes="message.state.rejectOrderForm.notes"
      @submit:form="submitRejectForm()"
      @update:selected-items="updateUnavailableItems($event)"
      @update:selected-selections="updateUnavailableSelections($event)"
      @update:notes="updateNotes($event)"
      @backdrop="closeUnavailableItemsForm()"
    />
  </div>
</template>

<script lang="ts">
import AcceptOrderBottomSheet from '../common/OrderAcceptBottomSheet.ts.vue';
import BranchBusyBottomSheet from '../../agent/BranchBusyBottomSheet.ts.vue';
import OrderItemCard from '../common/OrderItemCard.ts.vue';
import OrderJourney from '../common/OrderJourney.ts.vue';
import RejectionReasonsForm from '../../agent/RejectionReasonsForm.ts.vue';
import UnavailableItemsBottomSheet from '../../agent/UnavailableItemsBottomSheet.ts.vue';
import Vue from 'vue';
import { EntityId } from '@survv/commons/core/types';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { SVG_GLOBAL_UNAVAILABLE } from '@survv/assets';
import {
  SupervisorOrderDetailsAction,
  SupervisorOrderDetailsMessage,
} from '../../../../core/blocs/supervisor/order-details/SupervisorOrderDetailsMessage';
import { SupervisorOrderDetailsBloc } from '../../../../core/blocs/supervisor/order-details/SupervisorOrderDetailsBloc';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'SupervisorLiveOrderDetails',
  components: {
    UnavailableItemsBottomSheet,
    AcceptOrderBottomSheet,
    OrderJourney,
    OrderItemCard,
    VgPanel,
    VgFlex,
    VgPair,
    VgGrid,
    VgSvg,
    VgButton,
    RejectionReasonsForm,
    BranchBusyBottomSheet,
  },
  data() {
    return {
      SVG_GLOBAL_UNAVAILABLE,
      bloc: new SupervisorOrderDetailsBloc({
        orderId: Number(this.$route.params.orderId),
        ordersRepo: new OrdersRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      }),
      message: new SupervisorOrderDetailsMessage(),
      currentReasonLabel: '',
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
    shouldShowActions(): boolean {
      return (
        this.message.state.order.status === 'Requested' &&
        this.message.state.order.actionDisplay
      );
    },
    shouldShowAssignedAgent(): boolean {
      return (
        this.message.state.order.status === 'Requested' &&
        this.message.state.order.assignedAgent.email !== ''
      );
    },
  },
  watch: {
    '$route.params.orderId': async function refreshOrder(value) {
      this.bloc = new SupervisorOrderDetailsBloc({
        orderId: Number(value),
        ordersRepo: new OrdersRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      });

      this.bloc.outbox().subscribe((message: SupervisorOrderDetailsMessage) => {
        this.message = message;
      });

      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'INITIALIZE',
        })
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
  methods: {
    openAcceptOrderForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_ACCEPT_FORM',
        })
      );
    },
    closeAcceptOrderForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_ACCEPT_FORM',
        })
      );
    },
    openRejectOrderForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_REJECT_FORM',
        })
      );
    },
    closeRejectOrderForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_REJECT_FORM',
        })
      );
    },
    closeBranchBusyForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_BRANCH_BUSY_FORM',
        })
      );
    },
    validateAcceptForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_ACCEPT_FORM',
        })
      );
    },
    validateRejectForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_REJECT_FORM',
        })
      );
    },
    acceptOrder(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'ACCEPT_ORDER',
          payload: {
            acceptOrderForm: {
              vendorOrderId: this.message.state.acceptOrderForm.vendorOrderId,
            },
          },
        })
      );
    },
    submitRejectForm(): void {
      if (this.currentReasonLabel == 'Busy Branch') {
        this.currentReasonLabel = '';
        this.bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'CLOSE_REJECT_FORM',
          })
        );
        this.bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'OPEN_BRANCH_BUSY_FORM',
          })
        );
      } else if (this.currentReasonLabel == 'Unavailable Items') {
        this.currentReasonLabel = '';
        this.bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'CLOSE_REJECT_FORM',
          })
        );
        this.bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'OPEN_UNAVAILABLE_ITEMS_FORM',
          })
        );
      } else {
        this.bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'REJECT_ORDER',
            payload: {
              rejectOrderForm: this.message.state.rejectOrderForm,
            },
          })
        );
      }
    },
    assignOrder(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'ASSIGN_ORDER',
        })
      );
    },
    searchRejectionReasons(searchValue: string): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'SEARCH_REJECTION_REASONS',
          payload: { searchToken: searchValue },
        })
      );
    },
    closeUnavailableItemsForm(): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_UNAVAILABLE_ITEMS_FORM',
        })
      );
    },
    updateUnavailableItems(itemsIds: EntityId[]): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_UNAVAILABLE_ITEMS',
          payload: {
            rejectOrderForm: {
              unavailableItems: itemsIds,
            },
          },
        })
      );
    },
    updateUnavailableSelections(selectionsIds: EntityId[]): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_UNAVAILABLE_SELECTIONS',
          payload: {
            rejectOrderForm: {
              unavailableSelections: selectionsIds,
            },
          },
        })
      );
    },
    updateNotes(notes: string): void {
      this.bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_NOTES',
          payload: {
            rejectOrderForm: {
              notes,
            },
          },
        })
      );
    },
  },
});
</script>

<style scoped lang="scss">
.order-details-container {
  flex: 3;
  display: flex;
  position: relative;
  height: 100%;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  &__header {
    min-height: 60px;
    padding: var(--inset-mid);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-surface-dark);
    border-bottom: 1px solid var(--color-border-light);

    .panel-title {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 22px;
      line-height: 24px;
    }
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    padding: var(--inset-mid);
    background-color: var(--color-surface-light);
    overflow: auto;
  }
  &__body.padded {
    padding-bottom: 240px;
  }

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

  &__floating {
    width: 100%;
    position: absolute;
    bottom: 0;
    background: white;
    box-shadow: 0px -5px 5px 0px rgba(50, 50, 50, 0.05);
  }

  &__assigned-agent {
    background: #eed7d7;
    color: #ce1515;
    text-align: center;
    padding: var(--inset-small);
  }
}
.order-details-container.disabled {
  pointer-events: all;
  opacity: 1;
  border: 1px solid rgba(215, 215, 215, 0.3);
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
.order-details-action-buttons-container {
  padding: var(--inset-x-large);

  &__button {
    width: 220px;
  }
}
</style>
