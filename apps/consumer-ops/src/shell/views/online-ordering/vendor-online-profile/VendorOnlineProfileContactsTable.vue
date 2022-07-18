<template>
  <vg-data-table
    :items="items"
    :total-items-count="totalItemsCount"
    :columns="columns"
    must-sort
    hide-footer
  >
    <template #item="{ item }">
      <tr>
        <td>
          {{ item.fullName }}
        </td>
        <td>
          {{ item.mobileNo }}
        </td>
        <td>
          {{ item.email }}
        </td>
        <td>
          {{ item.title }}
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>
<script>
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default {
  name: 'VendorOnlineProfileContactsTable',
  components: {
    VgDataTable,
  },
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
          value: 'fullName',
          text: this.$t('NAME'),
          sortable: false,
        },
        {
          value: 'mobileNo',
          text: this.$t('MOBILE_NUMBER'),
          sortable: false,
        },
        {
          value: 'email',
          text: this.$t('EMAIL'),
          sortable: false,
        },
        {
          value: 'title',
          text: this.$t('TITLE'),
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style scoped></style>
