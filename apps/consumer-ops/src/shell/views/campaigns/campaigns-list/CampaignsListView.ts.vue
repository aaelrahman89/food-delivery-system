<template>
  <vg-content :pm="pm" :title="$t('CAMPAIGNS_LIST')">
    <div class="campaigns-list">
      <div>
        <vg-button outlined primary @click="navigateToCampaignCreation">
          {{ $t('NEW_CAMPAIGN') }}
        </vg-button>
      </div>
      <campaigns-list-filter
        :query-filter="pm.query.filter"
        :branches-list="pm.branchesListOptions"
        :areas-list="pm.areasListOptions"
        :tags-list="pm.hashTagsListOptions"
        :status-list="pm.statusListOptions"
        :services-list="pm.servicesListOptions"
        :usage-types-list="pm.usageTypesOptions"
        :branches-loading="pm.branchesListLoading"
        :areas-loading="pm.areasListLoading"
        :hashtags-loading="pm.hashTagsListLoading"
        @update:filter="pm.onFilterUpdate($event)"
      ></campaigns-list-filter>
      <campaigns-list-table
        class="elevation-1"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :sort="pm.query.sort"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        :loading="pm.campaignsTableLoading"
        @update:sort="pm.onSortUpdate($event)"
        @update:pagination="pm.onPaginationUpdate($event)"
        @set:vendors-criteria-bottom-sheet="
          pm.setVendorsCriteriaBottomSheet($event)
        "
        @set:branches-bottom-sheet="pm.setBranchesBottomSheet($event)"
        @enable:campaign="pm.enableCampaign($event)"
        @disable:campaign="pm.disableCampaign($event)"
      ></campaigns-list-table>
      <vg-bottom-sheet-list
        searchable
        :loading="pm.vendorsCriteriaLoading"
        :open="pm.shouldOpenVendorsCriteriaBottomSheet"
        :item-groups="pm.vendorsCriteriaItems"
        :search-label="$t('SEARCH')"
        @backdrop="pm.closeVendorsCriteriaBottomSheet()"
      >
        <template #header>{{ $t('CRITERIA_ITEMS') }}</template>
        <template #item="{ item }">
          <vg-flex align-items="stretch" gap-size="mid" no-wrap>
            <div class="vg-text--bold">
              {{ $t(item.label) }}
            </div>
          </vg-flex>
        </template>
      </vg-bottom-sheet-list>
      <vg-bottom-sheet-list
        searchable
        :loading="pm.branchesCriteriaLoading"
        :open="pm.shouldOpenBranchesBottomSheet"
        :item-groups="pm.branches"
        :search-label="$t('SEARCH')"
        @backdrop="pm.closeBranchesBottomSheet()"
      >
        <template #header>{{ $t('BRANCHES') }}</template>
        <template #item="{ item }">
          <vg-flex align-items="stretch" gap-size="mid" no-wrap>
            <div class="vg-text--bold">
              {{ $t(item.label) }}
            </div>
          </vg-flex>
        </template>
      </vg-bottom-sheet-list>
    </div>
  </vg-content>
</template>

<script lang="ts">
import CampaignsListFilter from './CampaignsListFilter.ts.vue';
import CampaignsListTable from './CampaignsListTable.ts.vue';
import Vue from 'vue';
import { AreasRepoImpl } from '../../../repositories/areas/AreasRepoImpl';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { CampaignsListPM } from '../../../../core/presentation-models/campaigns/CampaignsListPM';
import { CampaignsRepoImpl } from '../../../repositories/campaigns/CampaignsRepoImpl';
import { HashTagsRepoImpl } from '../../../repositories/hash-tags/HashTagsRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CampaignsListView',

  components: {
    CampaignsListFilter,
    CampaignsListTable,
    VgContent,
    VgFlex,
    VgBottomSheetList,
    VgButton,
  },
  data() {
    return {
      pm: new CampaignsListPM({
        notificationService,
        campaignsRepo: new CampaignsRepoImpl(),
        branchesRepo: new BranchesRepoImpl(),
        areasRepo: new AreasRepoImpl(),
        hashTagsRepo: new HashTagsRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
  },
  methods: {
    async navigateToCampaignCreation(): Promise<void> {
      await this.$router.push({ name: ROUTE_NAMES.CAMPAIGN_CREATION });
    },
  },
});
</script>

<style scoped lang="scss">
.campaigns-list {
  & > * + * {
    margin-top: var(--inset-mid);
  }
}
</style>
