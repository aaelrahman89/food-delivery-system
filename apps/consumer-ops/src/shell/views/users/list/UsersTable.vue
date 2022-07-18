<template>
  <vg-data-table :columns="columns" v-bind="$attrs" v-on="$listeners">
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
          <ul class="user-roles-list">
            <li v-for="userRole in item.userRoles" :key="userRole.valueOf()">
              {{ $t(userRole) }}
            </li>
          </ul>
        </td>
        <td>
          {{ item.lastUpdateDate.toDatetimeString() }}
        </td>
        <td>
          <vg-action-menu :actions="tableItemActions(item.id)"></vg-action-menu>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script>
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

const events = {
  deactivateUser: 'deactivate:user',
};

export default {
  name: 'UsersTable',
  components: { VgDataTable, VgActionMenu },
  data() {
    return {
      columns: [
        {
          value: 'name',
          text: this.$t('USER_NAME'),
        },
        {
          value: 'email',
          text: this.$t('USER_EMAIL'),
        },
        {
          value: 'mobileNo',
          text: this.$t('USER_MOBILE_NO'),
        },
        {
          value: 'userRoles',
          text: this.$t('USER_USER_ROLES'),
        },
        {
          value: 'lastUpdateDate',
          text: this.$t('USER_LAST_UPDATE_DATE'),
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
    tableItemActions(userId) {
      return [
        {
          name: this.$t('USERS_UPDATE_USER'),
          route: {
            name: ROUTE_NAMES.USERS_PROFILE_UPDATE,
            params: { userId },
          },
        },
        {
          name: this.$t('USERS_DEACTIVATE_USER'),
          onClick: () => {
            this.$emit(events.deactivateUser, userId);
          },
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.user-roles-list {
  list-style: none;
  padding-left: 0;
}
</style>
