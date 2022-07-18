<template>
  <vg-data-table
    v-bind="$attrs"
    :columns="columns"
    must-sort
    hide-footer
    v-on="$listeners"
  >
    <template #item="{ item, index }">
      <tr>
        <td>{{ item.fullName }}</td>
        <td>{{ item.mobileNo }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.title }}</td>
        <td @click.stop>
          <vg-action-menu
            :actions="generateActions(index)"
            color="primary"
          ></vg-action-menu>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'VendorOnlineProfileFormContactTable',
  components: { VgDataTable, VgActionMenu },

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
        {
          value: '',
          text: '',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    generateActions(contactIndex: number) {
      return [
        {
          name: this.$t('VENDOR_ONLINE_PROFILE_DELETE_CONTACT'),
          onClick: (): void => {
            this.$emit('delete', contactIndex);
          },
        },
      ];
    },
  },
});
</script>

<style scoped lang="scss"></style>
