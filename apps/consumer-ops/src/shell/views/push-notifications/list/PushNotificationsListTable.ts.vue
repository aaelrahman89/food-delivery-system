<template>
  <div>
    <vg-data-table
      must-sort
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td class="table-notification__header">
            {{ item.header }}
          </td>
          <td class="table-notification__message">
            {{ item.message }}
          </td>
          <td>
            {{ item.createdBy }}
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

import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'PushNotificationsListTable',
  components: { VgDataTable },
  data() {
    return {
      columns: [
        {
          text: this.$t('PUSH_NOTIFICATIONS_HEADER'),
          value: 'header',
          sortable: true,
        },
        {
          text: this.$t('PUSH_NOTIFICATIONS_MESSAGE'),
          value: 'message',
          sortable: true,
        },
        {
          text: this.$t('PUSH_NOTIFICATIONS_CREATED_BY'),
          value: 'createdBy',
          sortable: true,
        },
        {
          text: this.$t('PUSH_NOTIFICATIONS_CREATION_DATE'),
          value: 'creationDate',
          sortable: true,
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.table-notification {
  &__header,
  &__message {
    max-width: 400px;
    word-wrap: break-word;
  }
}
</style>
