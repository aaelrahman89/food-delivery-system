<template>
  <div>
    <vg-data-table
      :items="items"
      :total-items-count="totalItemsCount"
      must-sort
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr class="vg-clickable" @click="$emit('show-order-details', item)">
          <td>
            <vg-clickable
              :label="item.customerOrderId"
              :route="{
                name: ROUTE_NAMES.SUPERVISOR_ALL_ORDER_DETAILS,
                params: { orderId: item.id },
              }"
            />
          </td>
          <td>
            {{ item.branchLabel }}
          </td>
          <td>
            {{ item.vendorOrderId }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td>
            {{ item.numberOfItems }}
          </td>
          <td>
            {{ item.scheduledTo }}
          </td>
          <td>
            {{ item.paymentMethod }}
          </td>
          <td>
            {{ item.assignedAgent }}
          </td>
          <td>
            {{ item.timeToAccept }}
          </td>
          <td>
            {{ item.creationDate }}
          </td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgClickable } from '@survv/commons/components/VgClickable';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'SupervisorAllOrdersListTable',
  components: { VgDataTable, VgClickable },
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
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_SURVV_ORDER_ID'),
          value: 'customerOrderId',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_BRANCH_LABEL'),
          value: 'branchLabel',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_VON'),
          value: 'vendorOrderId',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_STATUS'),
          value: 'status',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_NUMBER_OF_ITEMS'),
          value: 'numberOfItems',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_SCHEDULED_TO'),
          value: 'scheduledTo',
          sortable: false,
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_PAYMENT_METHOD'),
          value: 'paymentMethod',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_AGENT_ASSIGNED'),
          value: 'assignedAgent',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_TIME_TO_ACCEPT'),
          value: 'timeToAccept',
        },
        {
          text: this.$t('SUPERVISOR_ALL_ORDERS_LIST_CREATION_DATE'),
          value: 'creationDate',
        },
      ],
      ROUTE_NAMES,
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep table {
  thead {
    tr {
      th:nth-child(1) {
        position: sticky !important;
        position: -webkit-sticky !important;
        left: 0;
        z-index: 3;
        box-shadow: 2px 0 2px 0 var(--color-border-light);
      }
    }
  }

  tbody {
    tr {
      td:nth-child(1) {
        position: sticky !important;
        position: -webkit-sticky !important;
        left: 0;
        z-index: 2;
        background: var(--color-on-primary);
        border-bottom-color: #b0b0b0 !important;
        box-shadow: 2px 0 2px 0 var(--color-border-light);
      }
    }
  }
}
</style>
