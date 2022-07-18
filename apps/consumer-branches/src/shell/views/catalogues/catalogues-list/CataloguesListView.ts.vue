<template>
  <vg-content :pm="pm">
    <catalogues-list-table
      class="elevation-1"
      :items="pm.list.items"
      :total-items-count="pm.list.totalItemsCount"
    ></catalogues-list-table>
  </vg-content>
</template>

<script lang="ts">
import CataloguesListTable from './CataloguesListTable.ts.vue';
import Vue from 'vue';
import { CataloguesListPM } from '../../../../core/presentation-models/catalogues/CataloguesListPM';
import { CataloguesRepoImpl } from '../../../repositories/catalogues/CataloguesRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { routeNames } from '../../../../core/routes/routeNames';

export default Vue.extend({
  name: 'CataloguesListView',
  components: {
    VgContent,
    CataloguesListTable,
  },
  data() {
    return {
      pm: new CataloguesListPM({
        notificationService,
        cataloguesRepo: new CataloguesRepoImpl(),
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
    if (this.pm.shouldRedirectToCatalogueDetails) {
      const [catalogue] = this.pm.list.items;
      await this.$router.replace({
        name: routeNames.CATALOGUES_DETAILS,
        params: {
          catalogueId: String(catalogue.id),
        },
      });
    }
  },
});
</script>
