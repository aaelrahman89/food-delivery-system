<template>
  <vg-data-table :columns="columns" v-bind="$attrs" v-on="$listeners">
    <template #item="items">
      <tr>
        <td>
          {{ items.item.fullName }}
        </td>
        <td>
          {{ items.item.mobileNo }}
        </td>
        <td>
          {{ items.item.email }}
        </td>
        <td>
          {{ items.item.title }}
        </td>
        <td v-if="!hideActions" @click.stop>
          <vg-action-menu
            :actions="generateActions(items.index)"
          ></vg-action-menu>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script>
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

const events = {
  remove: 'remove',
};
export default {
  name: 'ContactPersonSimpleTable',
  components: { VgDataTable, VgActionMenu },
  props: {
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        {
          value: 'fullName',
          text: this.$t('ONLINE_ORDERING_BRANCHES_CONTACTS_TABLE_NAME'),
          sortable: false,
        },
        {
          value: 'mobileNo',
          text: this.$t('ONLINE_ORDERING_BRANCHES_CONTACTS_TABLE_PHONE'),
          sortable: false,
        },
        {
          value: 'email',
          text: this.$t('ONLINE_ORDERING_BRANCHES_CONTACTS_TABLE_EMAIL'),
          sortable: false,
        },
        {
          value: 'title',
          text: this.$t('ONLINE_ORDERING_BRANCHES_CONTACTS_TABLE_TITLE'),
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
    generateActions(index) {
      return this.hideActions
        ? []
        : [
            {
              name: this.$t('ONLINE_ORDERING_BRANCHES_CONTACTS_TABLE_REMOVE'),
              onClick: () => {
                this.$emit(events.remove, index);
              },
            },
          ];
    },
  },
};
</script>

<style scoped lang="scss"></style>
