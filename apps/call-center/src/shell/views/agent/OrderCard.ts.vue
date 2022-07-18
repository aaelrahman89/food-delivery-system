<template>
  <vg-panel
    :key="order.customerOrderId"
    class="vg-margin-block-end--mid"
    :class="{ active: active }"
    :title="`${$t('ORDER_CARD_TITLE')}: ${order.customerOrderId}`"
    dark
  >
    <vg-grid gap-size="mid">
      <vg-pair
        :label="$t('ORDER_CARD_REQUESTED_DATE')"
        :value="order.requestedSince"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        :label="$t('ORDER_CARD_BRANCH')"
        :value="order.branch"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        :label="$t('ORDER_CARD_ITEMS_COUNT')"
        :value="order.itemsCount"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        :label="$t('ORDER_CARD_TOTAL')"
        :value="order.total"
        max-width="100%"
        dense
      ></vg-pair>
      <vg-pair
        v-if="order.scheduled"
        :label="$t('ORDER_CARD_SCHEDULED_TO')"
        :value="order.scheduledTo"
        :background-color="'#F8F1BB'"
        :font-color="'#FA9510'"
        :border-color="'#F6BF73'"
        max-width="100%"
        dense
      ></vg-pair>
    </vg-grid>
    <div class="vg-margin-block-start--mid">
      <vg-button
        expand
        large
        :to="{
          name: ROUTE_NAMES.AGENT_ORDER_DETAILS,
          params: { orderId: Number(order.id) },
        }"
      >
        {{ $t('ORDER_CARD_VIEW_DETAILS') }}
      </vg-button>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default Vue.extend({
  name: 'OrderCard',
  components: {
    VgGrid,
    VgPair,
    VgPanel,
    VgButton,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ROUTE_NAMES,
    };
  },
});
</script>

<style scoped lang="scss">
.active {
  border: 3px solid var(--color-primary);
}
</style>
