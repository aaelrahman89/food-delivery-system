<template>
  <vg-content :pm="pm" no-header>
    <vg-flex flex-direction="column" gap-size="large">
      <vg-panel collapsible :title="$t('FILTERS')">
        <overview-mode-filter
          :filter-valid="pm.isFilterValid"
          :query-filter="pm.query.queuedOrdersQuery.filter"
          :cities-list="pm.citiesListOptions"
          :areas-list="pm.areasListOptions"
          :hubs-list="pm.hubsListOptions"
          :order-types-list="pm.orderTypesListOptions"
          @city:selected="pm.onCitySelected($event)"
          @area:selected="pm.onAreaSelected($event)"
          @update:filter="pm.onFilterUpdate($event)"
        ></overview-mode-filter>
      </vg-panel>
      <div v-if="pm.isFilterValid">
        <vg-panel
          class="queued-orders-container"
          :title="
            $t('LIVE_OPS_ORDERS_OVERVIEW_QUEUED_ORDERS_COUNTS', {
              b2cCount: pm.queuedOrdersCounts.b2cOrdersCount,
              c2cCount: pm.queuedOrdersCounts.c2cOrdersCount,
            })
          "
        >
          <overview-mode-queued-orders-table
            class="elevation-1"
            :items="pm.queuedOrders.items"
            :total-items-count="pm.queuedOrders.totalItemsCount"
            :sort="pm.query.queuedOrdersQuery.sort"
            :skip="pm.query.queuedOrdersQuery.skip"
            :limit="pm.query.queuedOrdersQuery.limit"
            :loading="pm.loading"
            @update:sort="pm.onQueuedOrdersSortUpdate($event)"
            @update:pagination="pm.onQueuedOrdersPaginationUpdate($event)"
          ></overview-mode-queued-orders-table>
        </vg-panel>
        <div class="ongoing-orders-container">
          <overview-mode-ongoing-orders-table
            class="elevation-1"
            :items="pm.ongoingOrders.items"
            :total-items-count="pm.ongoingOrders.totalItemsCount"
            :sort="pm.query.ongoingOrdersQuery.sort"
            :skip="pm.query.ongoingOrdersQuery.skip"
            :limit="pm.query.ongoingOrdersQuery.limit"
            :loading="pm.loading"
            @update:sort="pm.onOngoingOrdersSortUpdate($event)"
            @update:pagination="pm.onOngoingOrdersPaginationUpdate($event)"
          ></overview-mode-ongoing-orders-table>
        </div>
      </div>
    </vg-flex>
  </vg-content>
</template>

<script lang="ts">
import OverviewModeFilter from './OverviewModeFilter.ts.vue';
import OverviewModeOngoingOrdersTable from './OverviewModeOngoingOrdersTable.ts.vue';
import OverviewModeQueuedOrdersTable from './OverviewModeQueuedOrdersTable.ts.vue';
import Vue from 'vue';
import { AreasRepoImpl } from '../../../repositories/areas/AreasRepoImpl';
import { CitiesRepoImpl } from '../../../repositories/cities/CitiesRepoImpl';
import { HubsRepoImpl } from '../../../repositories/hubs/HubsRepoImpl';
import { OrdersOverviewModePM } from '../../../../core/presentation-models/live-ops/OrdersOverviewModePM';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'OverviewMode',
  components: {
    VgPanel,
    VgContent,
    VgFlex,
    OverviewModeFilter,
    OverviewModeOngoingOrdersTable,
    OverviewModeQueuedOrdersTable,
  },
  data() {
    return {
      pm: new OrdersOverviewModePM({
        ordersRepo: new OrdersRepoImpl(),
        citiesRepo: new CitiesRepoImpl(),
        areasRepo: new AreasRepoImpl(),
        hubsRepo: new HubsRepoImpl(),
        notificationService,
        query: this.$parseJSONQuery(this.$route.query.q),
      }),
    };
  },
  async created() {
    await this.pm.init();
  },
  async beforeDestroy() {
    await this.pm.onViewDestroyed();
  },
});
</script>

<style scoped lang="scss">
.queued-orders-container {
  border: 1px solid #e83744 !important;
  background: rgba(231, 54, 66, 0.1);
}
.ongoing-orders-container {
  max-width: 100%;
  margin-top: var(--inset-large);
}
</style>
