<template>
  <vg-content :pm="bloc" no-header>
    <vg-flex gap-size="large" flex-direction="column">
      <div>
        <orders-list-filter
          :scheduled-list="message.state.scheduleSlotsList"
          :status-list="message.state.ordersStatusesList"
          :filter="message.state.filter"
          @update:filter="filtersUpdated"
        ></orders-list-filter>
      </div>
      <div>
        <orders-list-table
          :orders="message.state.orders"
          :orders-count="message.state.totalOrdersCount"
          :loading="ordersListTableLoading"
          :skip="message.state.skip"
          :limit="message.state.limit"
          :sort="message.state.sort"
          @update:pagination="paginationUpdated"
          @update:sort="sortUpdated"
          @click:show-order-details="showOrderDetails"
        >
        </orders-list-table>
      </div>
    </vg-flex>
  </vg-content>
</template>

<script lang="ts">
import OrdersListFilter from './OrdersListFilter.ts.vue';
import OrdersListTable from './OrdersListTable.ts.vue';
import Vue from 'vue';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import {
  OrdersListAction,
  OrdersListMessage,
} from '../../../../core/presentation-models/orders/orders-list/OrdersListMessage';
import { OrdersListBloc } from '../../../../core/presentation-models/orders/orders-list/OrdersListBloc';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'OrdersListContainer',
  components: { OrdersListFilter, OrdersListTable, VgContent, VgFlex },
  data() {
    return {
      bloc: new OrdersListBloc({
        ordersRepo: new OrdersRepoImpl(),
        branchesRepo: new BranchesRepoImpl(),
        notificationService,
        localizationService: LocalizationServiceImpl.getInstance(),
        routerService: RouterServiceImpl.getInstance(),
      }),
      message: new OrdersListMessage(),
    };
  },
  computed: {
    pageLoading(): boolean {
      return this.message.status == 'PROCESSING';
    },
    ordersListTableLoading(): boolean {
      return this.message.tableStatus === 'PROCESSING';
    },
  },
  async created(): Promise<void> {
    this.bloc.outbox().subscribe((message: OrdersListMessage) => {
      this.message = message;
    });
    this.bloc.inbox().next(
      new OrdersListAction({
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
        new OrdersListAction({
          type: 'UPDATE_PAGINATION',
          payload: {
            skip,
            limit,
          },
        })
      );
    },
    sortUpdated(sort: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_SORT',
          payload: {
            sort,
          },
        })
      );
    },
    filtersUpdated(filters: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new OrdersListAction({
          type: 'UPDATE_FILTERS',
          payload: {
            filter: filters,
          },
        })
      );
    },
    showOrderDetails(orderId: number): void {
      this.bloc.inbox().next(
        new OrdersListAction({
          type: 'NAVIGATE_TO_ORDER_DETAILS',
          payload: { orderId },
        })
      );
    },
  },
});
</script>

<style scoped lang="scss"></style>
