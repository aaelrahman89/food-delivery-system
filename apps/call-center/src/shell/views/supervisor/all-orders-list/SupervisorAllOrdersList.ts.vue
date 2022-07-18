<template>
  <vg-content :title="$t('SUPERVISOR_ALL_ORDERS_LIST')">
    <div class="order-listing">
      <div class="order-listing__row">
        <supervisor-all-orders-list-filter
          :collapsible="true"
          :collapsed="false"
          :branches="message.state.filtersData.branches"
          :filter="message.state.filters"
          :status-list="message.state.filtersData.statusList"
          :loading="filterLoading"
          @update:filter="filtersUpdated"
        ></supervisor-all-orders-list-filter>
      </div>
      <div class="order-listing__count">
        {{
          $t('SUPERVISOR_TOTAL_ORDERS', {
            count: message.state.tableData.totalItemsCount,
          })
        }}
      </div>
      <div class="order-listing__row">
        <supervisor-all-orders-list-table
          :items="message.state.tableData.list"
          :total-items-count="message.state.tableData.totalItemsCount"
          :skip="message.state.tableData.skip"
          :limit="message.state.tableData.limit"
          :sort="message.state.sort"
          :loading="tableLoading"
          @update:pagination="paginationUpdated"
          @update:sort="sortUpdated"
          @show-order-details="showOrderDetails"
        >
        </supervisor-all-orders-list-table>
      </div>
    </div>
  </vg-content>
</template>

<script lang="ts">
import SupervisorAllOrdersListFilter from './SupervisorAllOrdersListFilter.ts.vue';
import SupervisorAllOrdersListTable from './SupervisorAllOrdersListTable.ts.vue';
import Vue from 'vue';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import {
  SupervisorAllOrdersListAction,
  SupervisorAllOrdersListMessage,
} from '../../../../core/blocs/supervisor/all-orders/SupervisorAllOrdersListMessage';
import { SupervisorAllOrdersListBloc } from '../../../../core/blocs/supervisor/all-orders/SupervisorAllOrdersListBloc';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'OrdersListContainer',
  components: {
    SupervisorAllOrdersListFilter,
    SupervisorAllOrdersListTable,
    VgContent,
  },
  data() {
    return {
      bloc: new SupervisorAllOrdersListBloc({
        notificationService,
        ordersRepo: new OrdersRepoImpl(),
        branchesRepo: new BranchesRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        localizationService: LocalizationServiceImpl.getInstance(),
      }),
      message: new SupervisorAllOrdersListMessage(),
    };
  },
  computed: {
    pageLoading(): boolean {
      return this.message.status === 'LOADING';
    },
    tableLoading(): boolean {
      return this.message.tableStatus === 'LOADING';
    },
    filterLoading(): boolean {
      return this.message.filtersStatus === 'LOADING';
    },
  },
  created() {
    this.bloc.outbox().subscribe({
      next: (message: SupervisorAllOrdersListMessage) => {
        this.message = message;
      },
    });
    this.bloc.inbox().next(
      new SupervisorAllOrdersListAction({
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
        new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            skip,
            limit,
          },
        })
      );
    },
    sortUpdated(sort: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            sort,
          },
        })
      );
    },
    filtersUpdated(filters: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new SupervisorAllOrdersListAction({
          type: 'LOAD_ORDERS',
          payload: {
            filters,
          },
        })
      );
    },
    showOrderDetails(order: { type: string; id: number }): void {
      this.bloc.inbox().next(
        new SupervisorAllOrdersListAction({
          type: 'NAVIGATE_TO_ORDER_DETAILS',
          payload: { order },
        })
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.order-listing {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: var(--inset-mid);

  &__count {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
