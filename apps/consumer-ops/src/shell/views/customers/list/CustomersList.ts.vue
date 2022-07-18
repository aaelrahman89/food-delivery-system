<template>
  <vg-content
    :pm="pm"
    :title="$t('CUSTOMERS_LIST_PAGE_TITLE')"
    class="customers-list-container"
  >
    <div class="customers-list-container__section">
      <customers-list-filter
        :query-filter="pm.query.filter"
        @update:filter="pm.onFilterUpdate($event)"
      />
    </div>
    <div class="customers-list-container__section">
      <customers-table
        class="elevation-1"
        :total-items-count="pm.list.totalItemsCount"
        :sort="pm.query.sort"
        :items="pm.list.items"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        :loading="pm.loading"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
      />
    </div>
  </vg-content>
</template>

<script lang="ts">
import CustomersListFilter from './CustomersListFilter.ts.vue';
import CustomersTable from './CustomersTable.ts.vue';
import Vue from 'vue';
import { CustomersListPM } from '../../../../core/presentation-models/customers/CustomersListPM';
import { CustomersRepoImpl } from '../../../repositories/customers/CustomersRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CustomersList',
  components: {
    CustomersListFilter,
    CustomersTable,
    VgContent,
  },
  data() {
    return {
      pm: new CustomersListPM({
        customersRepo: new CustomersRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
        notificationService,
      }),
    };
  },
  async created() {
    await this.pm.init();
  },
});
</script>

<style scoped lang="scss">
.customers-list-container__section {
  margin: var(--inset-large) 0;
}
</style>
