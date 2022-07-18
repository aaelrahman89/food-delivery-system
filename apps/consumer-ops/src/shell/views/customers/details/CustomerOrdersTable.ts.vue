<template>
  <div>
    <vg-data-table
      :items="items"
      :total-items-count="totalItemsCount"
      :columns="columns"
      must-sort
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.customerOrderId }}</td>
          <td>{{ generateBranchLabel(item) }}</td>
          <td>{{ $t(item.type) }}</td>
          <td>{{ item.pickupCount }}</td>
          <td>{{ $t(item.status) }}</td>
          <td>{{ generateScheduledTo(item) }}</td>
          <td>{{ $t(item.orderingSystem) }}</td>
          <td>{{ $t(item.paymentMethod) }}</td>
          <td>{{ item.total.toString() }}</td>
          <td>{{ item.change.toString() }}</td>
          <td>{{ item.consumedBalance.toString() }}</td>
          <td>{{ generateLastStatusUpdateDuration(item) }}</td>
          <td>{{ item.lastStatusUpdateDate.toDatetimeString() }}</td>
          <td>{{ item.creationDate.toDatetimeString() }}</td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Order } from '../../../../core/models/Order';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'CustomerOrdersTable',
  components: { VgDataTable },
  props: {
    items: {
      type: Array,
      required: true,
    },
    totalItemsCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: [
        {
          value: 'customerOrderId',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_CUSTOMER_ORDER_ID'),
        },
        {
          value: 'branchLabel',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_VENDOR_BRANCH_LABEL'),
        },
        {
          value: 'type',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_TYPE'),
        },
        {
          value: 'pickupCount',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_PICKUP_COUNT'),
        },
        {
          value: 'status',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_STATUS'),
        },
        {
          value: 'scheduledTo',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_SCHEDULED_TO'),
        },
        {
          value: 'orderingSystem',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_ORDERING_SYSTEM'),
        },
        {
          value: 'paymentMethod',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_PAYMENT_METHOD'),
        },
        {
          value: 'total',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_TOTAL'),
        },
        {
          value: 'change',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_CHANGE'),
        },
        {
          value: 'consumedBalance',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_CONSUMED_BALANCE'),
        },
        {
          value: 'lastStatusUpdateDuration',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_LAST_UPDATE_DURATION'),
        },
        {
          value: 'lastStatusUpdateDate',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_LAST_UPDATE_DATE'),
        },
        {
          value: 'creationDate',
          text: this.$t('CUSTOMER_DETAILS_ORDERS_TABLE_CREATION_DATE'),
        },
      ],
    };
  },
  methods: {
    generateLastStatusUpdateDuration(order: Order) {
      if (
        ['REJECTED', 'CANCELLED', 'DELIVERED'].includes(order.status.valueOf())
      )
        return this.$t('TERMINATED');
      return order.lastStatusUpdateDuration.humanize();
    },
    generateBranchLabel(order: Order) {
      if (order.branchLabel === '') return 'N/A';
      return order.branchLabel;
    },
    generateScheduledTo(order: Order) {
      if (order.scheduled) return order.scheduledTo;
      return '-';
    },
  },
});
</script>

<style scoped lang="scss"></style>
