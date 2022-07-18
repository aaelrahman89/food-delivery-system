<template>
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
        <td>{{ item.serialNumber }}</td>
        <td>{{ item.description }}</td>
        <td class="vg-text-align--right">
          {{ item.amount.toString() }} {{ $t(item.amount.currency) }}
        </td>
        <td>{{ $t(item.type) }}</td>
        <td>{{ item.creationDate.toDatetimeString() }}</td>
        <td>{{ item.createdBy.email }}</td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'DebitCreditNotesTable',
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
          value: 'serialNumber',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_SERIAL_NUMBER'),
        },
        {
          value: 'description',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_DESCRIPTION'),
          sortable: false,
        },
        {
          value: 'amount',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_AMOUNT'),
          align: 'end',
          sortable: false,
        },
        {
          value: 'type',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_TYPE'),
          sortable: false,
        },
        {
          value: 'creationDate',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_CREATION_DATE'),
        },
        {
          value: 'createdBy.email',
          text: this.$t('DEBIT_CREDIT_NOTES_TABLE_CREATED_BY'),
          sortable: false,
        },
      ],
    };
  },
});
</script>

<style scoped lang="scss"></style>
