<template>
  <vg-panel
    :title="$t('ORDER_CARD_TITLE', { orderId: customerOrderId })"
    dark
    collapsible
  >
    <vg-grid gap-size="small">
      <vg-pair
        :label="$t('ORDER_CARD_ITEMS_COUNT')"
        :value="itemsCount"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        :label="$t('ORDER_CARD_TOTAL_VALUE')"
        :value="`${totalValue} ${$t(totalValue.currency)}`"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        :label="$t('ORDER_CARD_REQUESTED_DATE')"
        :value="requestDate.humanizeElapsedTimeWithoutSuffix()"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        v-if="scheduled"
        :label="$t('ORDER_CARD_SCHEDULED_TO')"
        :value="$t(scheduledTo)"
        :background-color="'#F8F1BB'"
        :font-color="'#FA9510'"
        :border-color="'#F6BF73'"
        max-width="100%"
        dense
      ></vg-pair>
    </vg-grid>
    <div class="vg-margin-block-start--mid">
      <vg-button v-if="to" expand :to="to">
        {{ $t('ORDER_CARD_VIEW_DETAILS') }}
      </vg-button>
      <vg-button v-else expand @click="viewDetails">
        {{ $t('ORDER_CARD_VIEW_DETAILS') }}
      </vg-button>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { Money } from '@survv/commons/core/models/money';
import { OrderStatus } from '../../../../core/models/Order';
import { VgButton } from '@survv/commons/components/VgButton/index';
import { VgGrid } from '@survv/commons/components/VgGrid/index';
import { VgPair } from '@survv/commons/components/VgPair/index';
import { VgPanel } from '@survv/commons/components/VgPanel/index';

const events = {
  viewDetails: 'view:details',
};

export default Vue.extend({
  name: 'OrderCard',
  components: {
    VgGrid,
    VgPair,
    VgPanel,
    VgButton,
  },
  props: {
    customerOrderId: {
      type: CustomerOrderId,
      required: true,
    },
    itemsCount: {
      type: Number,
      required: true,
    },
    requestDate: {
      type: Datetime,
      required: true,
    },
    totalValue: {
      type: Money,
      required: true,
    },
    to: {
      type: Object,
      default: undefined,
    },
    status: {
      type: OrderStatus,
      default: undefined,
    },
    scheduled: {
      type: Boolean,
      default: false,
    },
    scheduledTo: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      OrderStatus,
    };
  },
  methods: {
    viewDetails(): void {
      this.$emit(events.viewDetails);
    },
  },
});
</script>

<style scoped></style>
