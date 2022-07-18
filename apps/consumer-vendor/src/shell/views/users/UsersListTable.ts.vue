<template>
  <div>
    <vg-data-table
      :columns="columns"
      :items="items"
      :total-items-count="totalItemsCount"
      must-sort
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.email }}
          </td>
          <td>
            {{ item.mobileNo }}
          </td>
          <td>
            {{ $t(item.role) }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td>
            {{ item.creationDate }}
          </td>
          <td class="vg-text-align--end" @click.stop>
            <vg-action-menu :actions="generateActionMenuActions(item)" />
          </td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'UsersListTable',
  components: { VgDataTable, VgActionMenu },
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
          text: this.$t('USERS_LIST_NAME'),
          value: 'name',
        },
        {
          text: this.$t('USERS_LIST_EMAIL'),
          value: 'email',
        },
        {
          text: this.$t('USERS_LIST_MOBILE_NUMBER'),
          value: 'mobileNo',
        },
        {
          text: this.$t('USERS_LIST_ROLE'),
          value: 'role',
        },
        {
          text: this.$t('USERS_LIST_STATUS'),
          value: 'status',
        },
        {
          text: this.$t('USERS_LIST_CREATION_DATE'),
          value: 'creationDate',
        },
        {
          value: 'actions',
          text: '',
          sortable: false,
          align: 'reverse',
        },
      ],
      ROUTE_NAMES,
    };
  },
  methods: {
    generateActionMenuActions(user: unknown) {
      const actions = [];

      if (user.active) {
        actions.push({
          name: this.$t('USERS_LIST_ACTIONS_UPDATE'),
          onClick: (): void => {
            this.$emit('update-user', user);
          },
        });
      }

      if (user.active && !UserRole.CALL_CENTER_SUPER_ADMIN.equals(user.role)) {
        actions.push({
          name: this.$t('USERS_LIST_ACTIONS_DEACTIVATE'),
          onClick: (): void => {
            this.$emit('deactivate-user', user);
          },
        });
      } else if (!user.active) {
        actions.push({
          name: this.$t('USERS_LIST_ACTIONS_ACTIVATE'),
          onClick: (): void => {
            this.$emit('activate-user', user);
          },
        });
      }

      return actions;
    },
  },
});
</script>

<style lang="scss" scoped></style>
