<template>
  <vg-data-table
    :items="items"
    :total-items-count="totalItemsCount"
    :skip="skip"
    :limit="limit"
    :sort="sort"
    :loading="loading"
    :columns="columns"
    v-on="$listeners"
  >
    <template #item="{ item }">
      <tr>
        <td>
          {{ item.refereeName }}
        </td>
        <td>
          {{ item.refereeMobileNumber }}
        </td>
        <td>
          <vg-clickable
            :label="`#${item.customerOrderId}`"
            :route="getOrderDetailsRoute(item.orderId)"
          />
        </td>
        <td>
          {{ $t(item.orderStatus) }}
        </td>
        <td>
          {{ `${item.discountPercentage}%` }}
        </td>
        <td>
          {{
            `${item.discountAmount.toString()} ${$t(
              item.discountAmount.currency.toString()
            )}`
          }}
        </td>
        <td>
          {{ item.registrationDate.toDatetimeString() }}
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { EntityId } from '@survv/commons/core/types';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgClickable } from '@survv/commons/components/VgClickable';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'RefereeReportTable',
  components: { VgDataTable, VgClickable },
  props: {
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    skip: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
    sort: {
      type: Object,
      default: undefined,
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
          value: 'refereeName',
          text: this.$t('REFEREE_REPORT_TABLE_NAME'),
          sortable: true,
        },
        {
          value: 'refereeMobileNo',
          text: this.$t('REFEREE_REPORT_TABLE_MOBILE_NUMBER'),
          sortable: true,
        },
        {
          value: 'customerOrderId',
          text: this.$t('REFEREE_REPORT_TABLE_CUSTOMER_ORDER_ID'),
          sortable: true,
        },
        {
          value: 'orderStatus',
          text: this.$t('REFEREE_REPORT_TABLE_ORDER_STATUS'),
          sortable: true,
        },
        {
          value: 'discountPercentage',
          text: this.$t('REFEREE_REPORT_TABLE_DISCOUNT_PERCENTAGE'),
          sortable: true,
        },
        {
          value: 'discountAmount',
          text: this.$t('REFEREE_REPORT_TABLE_DISCOUNT_AMOUNT'),
          sortable: true,
        },
        {
          value: 'registrationDate',
          text: this.$t('REFEREE_REPORT_TABLE_REGISTRATION_DATE'),
          sortable: true,
        },
      ],
    };
  },
  methods: {
    getOrderDetailsRoute(orderId: EntityId): Record<string, unknown> {
      return {
        name: ROUTE_NAMES.ORDER_DETAILS,
        params: { orderId },
      };
    },
  },
});
</script>

<style scoped lang="scss"></style>
