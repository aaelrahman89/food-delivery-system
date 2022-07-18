<template>
  <vg-data-table
    :columns="columns"
    :items="orders"
    :total-items-count="ordersCount"
    :skip="skip"
    :limit="limit"
    :sort="sort"
    :loading="loading"
    class="elevation-1"
    must-sort
    @update:pagination="$emit('update:pagination', $event)"
    @update:sort="$emit('update:sort', $event)"
  >
    <template #item="props">
      <tr class="vg-clickable" @click="showOrderDetails(props.item.orderId)">
        <td>
          {{ props.item.customerOrderId }}
        </td>
        <td>
          {{ props.item.status }}
        </td>
        <td>
          {{ props.item.scheduledTo }}
        </td>
        <td>
          {{ props.item.total }}
        </td>
        <td>
          {{ props.item.creationDate }}
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'OrdersListTable',
  components: { VgDataTable },
  props: {
    orders: {
      type: Array,
      default() {
        return [];
      },
    },
    ordersCount: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    skip: {
      type: Number,
      default: undefined,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    sort: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      columns: [
        {
          text: this.$t('orders.list.order_id'),
          value: 'customerOrderId',
          sortable: false,
        },
        {
          text: this.$t('orders.list.status'),
          value: 'status',
          sortable: false,
        },
        {
          text: this.$t('orders.list.scheduledTo'),
          value: 'scheduledTo',
          sortable: false,
        },
        {
          text: this.$t('orders.list.totalWithoutDeliveryFees'),
          value: 'total',
          sortable: true,
        },
        {
          text: this.$t('orders.list.creation_date'),
          value: 'creationDate',
          sortable: true,
        },
      ],
    };
  },
  methods: {
    showOrderDetails(orderId: number): void {
      this.$emit('click:show-order-details', orderId);
    },
  },
});
</script>

<style scoped></style>
