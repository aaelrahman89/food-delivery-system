<template>
  <vg-content :pm="pm">
    <vg-flex flex-direction="column" gap-size="large">
      <div>
        <vg-button color="primary" outlined>
          <router-link
            class="vg-text-primary"
            :to="{ name: ROUTE_NAMES.USERS_CREATION }"
          >
            {{ $t('CREATE_NEW_USER') }}
          </router-link>
        </vg-button>
      </div>
      <div>
        <users-table
          class="elevation-1"
          :items="pm.list.items"
          :total-items-count="pm.list.totalItemsCount"
          :skip="pm.query.skip"
          :limit="pm.query.limit"
          @update:pagination="pm.onPaginationUpdate($event)"
          @update:sort="pm.onSortUpdate($event)"
          @deactivate:user="pm.deactivateUser($event)"
        >
        </users-table>
      </div>
    </vg-flex>
  </vg-content>
</template>

<script>
import UsersTable from './UsersTable.vue';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { UsersListPM } from '../../../../core/presentation-models/users/UsersListPM';
import { UsersRepoImpl } from '../../../repositories/users/UsersRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'UsersListView',
  components: { VgContent, UsersTable, VgButton, VgFlex },
  data() {
    return {
      ROUTE_NAMES,
      pm: new UsersListPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
      }),
    };
  },
  async created() {
    await this.pm.init();
  },
};
</script>

<style scoped></style>
