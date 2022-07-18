<template>
  <div>
    <vg-data-table
      v-bind="$attrs"
      :columns="columns"
      must-sort
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.customerOrderId }}</td>
          <td>{{ item.customerMobileNo }}</td>
          <td>{{ item.branchLabel }}</td>
          <td>{{ item.creationDate.toDatetimeString() }}</td>
          <td>{{ $t(item.status) }}</td>
          <td>{{ item.total.toString() }}</td>
          <td>{{ $t(item.paymentMethod) }}</td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'ListingModeTable',
  components: { VgDataTable },
  data() {
    return {
      columns: [
        {
          value: 'customerOrderId',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_CUSTOMER_ORDER_ID'),
        },
        {
          value: 'customerMobileNo',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_CUSTOMER_MOBILE_NUMBER'),
        },
        {
          value: 'branchLabel',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_VENDOR_BRANCH_LABEL'),
        },
        {
          value: 'creationDate',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_CREATION_DATE'),
          sortable: false,
        },
        {
          value: 'status',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_STATUS'),
        },
        {
          value: 'total',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_TOTAL'),
        },
        {
          value: 'paymentMethod',
          text: this.$t('LIVE_OPS_ORDERS_TABLE_PAYMENT_METHOD'),
        },
      ],
    };
  },
});
</script>

<style scoped lang="scss"></style>
