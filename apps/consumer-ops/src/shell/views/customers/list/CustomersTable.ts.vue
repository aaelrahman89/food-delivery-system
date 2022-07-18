<template>
  <vg-data-table
    :items="items"
    :total-items-count="totalItemsCount"
    :columns="columns"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #item="{ item }">
      <router-link
        class="vg-clickable"
        :to="{
          name: ROUTE_NAMES.CUSTOMER_DETAILS,
          params: { customerId: item.id },
        }"
        tag="tr"
      >
        <td>
          {{ item.name }}
        </td>
        <td>
          {{ item.mobileNo }}
        </td>
        <td>
          {{ item.creationDate.toDateString() }}
        </td>
      </router-link>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'CustomersTable',
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
          value: 'name',
          text: this.$t('CUSTOMERS_LIST_TABLE_NAME'),
          sortable: true,
        },
        {
          value: 'mobileNo',
          text: this.$t('CUSTOMERS_LIST_TABLE_MOBILE_NUMBER'),
          sortable: true,
        },
        {
          value: 'creationDate',
          text: this.$t('CUSTOMERS_LIST_TABLE_CREATION_DATE'),
          sortable: true,
        },
      ],
      ROUTE_NAMES,
    };
  },
});
</script>

<style scoped lang="scss"></style>
