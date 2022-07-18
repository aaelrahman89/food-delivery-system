<template>
  <vg-content :title="$t('PUSH_NOTIFICATIONS')">
    <div class="create-notification-button">
      <vg-button outlined @click="navigateToPushNotificationCreation()">{{
        $t('CREATE_NOTIFICATION_BUTTON')
      }}</vg-button>
    </div>
    <push-notifications-list-table
      :items="message.state.tableData.list"
      :total-items-count="message.state.tableData.totalItemsCount"
      :skip="message.state.tableData.skip"
      :limit="message.state.tableData.limit"
      :sort="message.state.sort"
      :loading="tableLoading"
      @update:pagination="paginationUpdated"
      @update:sort="sortUpdated"
    ></push-notifications-list-table>
  </vg-content>
</template>

<script lang="ts">
import PushNotificationsListTable from './PushNotificationsListTable.ts.vue';
import Vue from 'vue';
import {
  PushNotificationsListAction,
  PushNotificationsListMessage,
} from '../../../../core/blocs/push-notifications/PushNotificationsListMessage';
import { PushNotificationsListBloc } from '../../../../core/blocs/push-notifications/PushNotificationsListBloc';
import { PushNotificationsRepoImpl } from '../../../repositories/push-notifications/PushNotificationsRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'PushNotificationsListView',
  components: { PushNotificationsListTable, VgContent, VgButton },
  data() {
    return {
      bloc: new PushNotificationsListBloc({
        pushNotificationsRepo: new PushNotificationsRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        notificationService,
      }),
      message: new PushNotificationsListMessage(),
    };
  },
  computed: {
    tableLoading(): boolean {
      return this.message.tableStatus === 'LOADING';
    },
  },
  created() {
    this.bloc.outbox().subscribe({
      next: (message: PushNotificationsListMessage) => {
        this.message = message;
      },
    });
    this.bloc.inbox().next(
      new PushNotificationsListAction({
        type: 'INITIALIZE',
        payload: {
          ...this.$parseJSONQuery(this.$route.query.q),
        },
      })
    );
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    paginationUpdated({ skip, limit }: { skip: number; limit: number }): void {
      this.bloc.inbox().next(
        new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {
            skip,
            limit,
          },
        })
      );
    },
    sortUpdated(sort: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new PushNotificationsListAction({
          type: 'LOAD_PUSH_NOTIFICATIONS',
          payload: {
            sort,
          },
        })
      );
    },
    navigateToPushNotificationCreation(): void {
      this.bloc.inbox().next(
        new PushNotificationsListAction({
          type: 'NAVIGATE_TO_PUSH_NOTIFICATION_CREATION',
        })
      );
    },
  },
});
</script>

<style scoped lang="scss">
.create-notification-button {
  margin-bottom: var(--inset-large);
}
</style>
