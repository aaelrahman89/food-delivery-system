<template>
  <div>
    <vg-data-table
      must-sort
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr class="vg-clickable" @click="$emit('show-order-details', item)">
          <td>
            {{ item.branchLabel }}
          </td>
          <td>
            {{ item.customerOrderId }}
          </td>
          <td>
            {{ item.orderType }}
          </td>
          <td>
            {{ item.pickupCount }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td>
            {{ item.scheduledTo }}
          </td>
          <td>
            {{ item.orderingSystem }}
          </td>
          <td>
            {{ item.lastStatusUpdateDuration }}
          </td>
          <td>
            {{ item.lastStatusUpdateDate }}
          </td>
          <td>
            {{ item.creationDate }}
          </td>
          <td>
            {{ item.customerMobileNo }}
          </td>
          <td>
            {{ item.paymentMethod }}
          </td>
          <td>
            {{ item.change }}
          </td>
          <td>
            {{ item.total }}
          </td>
          <td>
            {{ item.consumedBalance }}
          </td>
          <td @click.stop>
            <vg-action-menu
              :actions="generateActionMenuActions(item)"
            ></vg-action-menu>
          </td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script>
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default {
  name: 'OrdersListTable',
  components: { VgDataTable, VgActionMenu },
  data() {
    return {
      columns: [
        {
          text: this.$t('ORDERS_LIST_BRANCH_LABEL'),
          value: 'branchLabel',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_ORDER_ID'),
          value: 'customerOrderId',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_TYPE'),
          value: 'type',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_PICKUP_COUNT'),
          value: 'pickupCount',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_STATUS'),
          value: 'status',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_SCHEDULED_TO'),
          value: 'scheduledTo',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_ORDERING_SYSTEM'),
          value: 'orderingSystem',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_LAST_STATUS_UPDATE_DURATION'),
          value: 'lastStatusUpdateDuration',
        },
        {
          text: this.$t('ORDERS_LIST_LAST_STATUS_UPDATE_DATE'),
          value: 'lastStatusUpdateDate',
        },
        {
          text: this.$t('ORDERS_LIST_CREATION_DATE'),
          value: 'creationDate',
        },
        {
          text: this.$t('ORDERS_LIST_CUSTOMER_MOBILE_NO'),
          value: 'customerMobileNo',
        },
        {
          text: this.$t('ORDERS_LIST_PAYMENT_METHOD'),
          value: 'paymentMethod',
          sortable: false,
        },
        {
          text: this.$t('ORDERS_LIST_CHANGE'),
          value: 'change',
          align: 'end',
        },
        {
          text: this.$t('ORDERS_LIST_TOTAL'),
          value: 'total',
          align: 'end',
        },
        {
          text: this.$t('ORDERS_LIST_CONSUMED_BALANCE'),
          value: 'consumedBalance',
          align: 'end',
        },
        {
          value: 'actions',
          align: 'reverse',
          text: this.$t('ORDERS_LIST_ACTION_MENU'),
          sortable: false,
        },
      ],
    };
  },
  methods: {
    generateActionMenuActions(order) {
      return [
        {
          name: this.$t('ORDERS_LIST_ACTIONS_VIEW_DETAILS'),
          onClick: () => {
            this.$emit('show-order-details', {
              type: order.type,
              id: order.id,
            });
          },
        },
      ];
    },
  },
};
</script>

<style scoped></style>
