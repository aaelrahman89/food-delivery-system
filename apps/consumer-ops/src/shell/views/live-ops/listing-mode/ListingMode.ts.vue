<template>
  <vg-content :pm="pm" no-header>
    <vg-flex flex-direction="column" gap-size="large">
      <vg-panel collapsible :title="$t('FILTERS')">
        <listing-mode-filter
          :query-filter="pm.query.filter"
          :branches-list="pm.branchesListOptions"
          :hubs-list="pm.hubsListOptions"
          :order-types-list="pm.orderTypesListOptions"
          :order-status-list="pm.orderStatusListOptions"
          @update:filter="pm.onFilterUpdate($event)"
        ></listing-mode-filter>
      </vg-panel>
      <div>
        <listing-mode-table
          class="elevation-1"
          :items="pm.listingOrders.items"
          :total-items-count="pm.listingOrders.totalItemsCount"
          :sort="pm.query.sort"
          :skip="pm.query.skip"
          :limit="pm.query.limit"
          :loading="pm.loading"
          @update:sort="pm.onSortUpdate($event)"
          @update:pagination="pm.onPaginationUpdate($event)"
        ></listing-mode-table>
      </div>
    </vg-flex>
  </vg-content>
</template>

<script lang="ts">
import ListingModeFilter from './ListingModeFilter.ts.vue';
import ListingModeTable from './ListingModeTable.ts.vue';
import Vue from 'vue';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { HubsRepoImpl } from '../../../repositories/hubs/HubsRepoImpl';
import { OrdersListingModePM } from '../../../../core/presentation-models/live-ops/OrdersListingModePM';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'ListingMode',
  components: {
    VgPanel,
    VgContent,
    VgFlex,
    ListingModeFilter,
    ListingModeTable,
  },
  data() {
    return {
      pm: new OrdersListingModePM({
        ordersRepo: new OrdersRepoImpl(),
        branchesRepo: new BranchesRepoImpl(),
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

<style scoped lang="scss"></style>
