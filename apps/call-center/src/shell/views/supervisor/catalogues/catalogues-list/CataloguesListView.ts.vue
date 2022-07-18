<template>
  <vg-content :pm="pm" :title="$t('SUPERVISOR_BRANCH_CATALOGUES_LIST')">
    <catalogues-list-table
      class="elevation-1"
      :items="pm.list.items"
      :total-items-count="pm.list.totalItemsCount"
    />
  </vg-content>
</template>

<script lang="ts">
import CataloguesListTable from './CataloguesListTable.ts.vue';
import Vue from 'vue';
import { CataloguesListPM } from '../../../../../core/presentation-models/catalogues/CataloguesListPM';
import { CataloguesRepoImpl } from '../../../../repositories/catalogues/CataloguesRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CataloguesListView',
  components: {
    VgContent,
    CataloguesListTable,
  },
  data() {
    return {
      pm: new CataloguesListPM({
        branchId: Number(this.$route.params.branchId),
        cataloguesRepo: new CataloguesRepoImpl(),
        notificationService,
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
  },
});
</script>
