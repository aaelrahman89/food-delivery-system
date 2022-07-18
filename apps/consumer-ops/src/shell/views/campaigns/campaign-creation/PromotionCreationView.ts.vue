<template>
  <vg-content :pm="pm" :title="$t('CAMPAIGN_CREATION_TITLE')">
    <vg-grid>
      <campaign-setup
        :name.sync="pm.campaignForm.name"
        :start-date.sync="pm.campaignForm.startDate"
        :end-date.sync="pm.campaignForm.endDate"
        :budget.sync="pm.campaignForm.budget"
        :max-activations.sync="pm.campaignForm.maxActivations"
        :name-validator.sync="pm.campaignForm.validators.name"
        :budget-validator.sync="pm.campaignForm.validators.budget"
        :max-activations-validator.sync="
          pm.campaignForm.validators.maxActivations
        "
        :service="pm.campaignForm.service"
        :promotion-type="pm.campaignForm.promotionType"
        :services="pm.services"
        :promotion-types="pm.promotionTypes"
      >
      </campaign-setup>
      <promo-code-setup
        :name.sync="pm.campaignForm.promoCode.name"
        :name-validator="pm.campaignForm.validators.promoCodeName"
        :max-uses-number.sync="pm.campaignForm.promoCode.maxNumberOfUses"
        :max-uses-number-validator="
          pm.campaignForm.validators.promoCodeMaxNoOfUses
        "
        :type="pm.campaignForm.promoCode.type"
        :type-validator="pm.campaignForm.validators.promoCodeType"
        :usage="pm.campaignForm.promoCode.usage"
        :usage-validator="pm.campaignForm.validators.promoCodeUsage"
        :percentage.sync="pm.campaignForm.promoCode.percentage"
        :percentage-validator="pm.campaignForm.validators.promoCodePercent"
        :cap.sync="pm.campaignForm.promoCode.cap"
        :cap-validator="pm.campaignForm.validators.promoCodeCap"
        :value.sync="pm.campaignForm.promoCode.value"
        :value-validator="pm.campaignForm.validators.promoCodeValue"
        :min-spending.sync="pm.campaignForm.promoCode.minSpending"
        :min-spending-validator="
          pm.campaignForm.validators.promoCodeMinSpending
        "
        :number-of-orders-operator.sync="
          pm.campaignForm.promoCode.numberOfOrdersOperator
        "
        :number-of-orders.sync="pm.campaignForm.promoCode.numberOfOrders"
        :types="pm.promoCodeTypes"
        :usages="pm.promoCodeUsages"
        :number-of-orders-operators="pm.numberOfOrdersOperators"
        :should-show-type="pm.shouldShowPromoCodeType"
        :should-show-percentage="pm.shouldShowPromoCodePercentage"
        :should-show-cap="pm.shouldShowPromoCodeCap"
        :should-show-value="pm.shouldShowPromoCodeValue"
        @update:usage="pm.updatePromoCodeUsage($event)"
        @update:type="pm.updatePromoCodeType($event)"
      ></promo-code-setup>
      <vg-panel :title="$t('AUDIENCE')">
        <vg-flex gap-size="large">
          <eligible-users
            :eligible-users-criteria="pm.campaignForm.eligibleUsersCriteria"
            :customer-eligibility-criteria="pm.customersEligibilityCriterion"
            :csv-file-name="pm.CSVFileName"
            @input:csv-data="pm.updateSubsetUsersPhoneNumbers($event)"
            @update:eligible-users-criteria="
              pm.updateEligibleUsersCriteria($event)
            "
          ></eligible-users>
          <eligible-vendors-branches
            :eligible-branches-criteria="
              pm.campaignForm.eligibleBranchesCriteria
            "
            :loading="pm.loading"
            :branches-eligibility-criterion="pm.branchesEligibilityCriterion"
            :selected-hash-tags-count="pm.selectedHashTagsCount"
            :selected-areas-count="pm.selectedAreasCount"
            :selected-branches-count="pm.selectedBranchesCount"
            :branches-included-count="pm.branchesIncludedCount"
            @click:set-update-tags="pm.setUpdateHashTags()"
            @click:set-update-areas="pm.setUpdateAreas()"
            @click:set-update-branches="pm.setUpdateBranches()"
            @click:view-branches-included="pm.viewBranchesIncluded()"
            @update:eligible-branches-criteria="
              pm.updateEligibleBranchesCriteria($event)
            "
          ></eligible-vendors-branches>
        </vg-flex>
      </vg-panel>
      <div class="form-actions">
        <div class="form-actions__discard">
          <vg-button outlined large @click="discard">
            {{ $t('DISCARD_CHANGES') }}
          </vg-button>
        </div>
        <div class="form-actions__save">
          <vg-button large :disabled="!pm.submittable" @click="submit">
            {{ $t('SAVE_CHANGES') }}
          </vg-button>
        </div>
      </div>
    </vg-grid>
    <vg-bottom-sheet-list
      searchable
      selectable
      :loading="pm.loading"
      :selections="pm.selectedHashTags"
      :open="pm.shouldOpenHashtagBottomSheet"
      :item-groups="pm.hashTags"
      :search-label="$t('SEARCH_HASHTAGS')"
      @search="pm.searchHashTags($event)"
      @backdrop="pm.closeHashtagBottomSheet()"
      @update:selections="pm.onHashTagsSelection($event)"
    >
      <template #header>{{ $t('SET_UPDATE_HASHTAGS') }}</template>
      <template #item="{ item }">
        <vg-flex align-items="stretch" gap-size="mid" no-wrap>
          <div class="vg-text--bold">
            {{ $t(item.label) }}
          </div>
        </vg-flex>
      </template>
      <template #submit="{ selections }">
        {{ $t('ADD_TAGS', { selectionsCount: selections.length }) }}
      </template>
    </vg-bottom-sheet-list>
    <vg-bottom-sheet-list
      searchable
      selectable
      :loading="pm.loading"
      :selections="pm.selectedAreas"
      :open="pm.shouldOpenAreasBottomSheet"
      :item-groups="pm.areas"
      :search-label="$t('SEARCH_GEO_BOUNDRY')"
      @search="pm.searchAreas($event)"
      @update:selections="pm.onAreasSelection($event)"
      @backdrop="pm.closeAreasBottomSheet()"
    >
      <template #header>{{ $t('SET_UPDATE_GEO_BOUNDRY') }} </template>
      <template #item="{ item }">
        <vg-flex align-items="stretch" gap-size="mid" no-wrap>
          <div class="vg-text--bold">
            {{ $t(item.label) }}
          </div>
        </vg-flex>
      </template>
      <template #submit="{ selections }">
        {{ $t('ADD_AREAS', { selectionsCount: selections.length }) }}
      </template>
    </vg-bottom-sheet-list>
    <specific-branches-bottom-sheet-list
      searchable
      selectable
      :loading="pm.loading"
      :selections.sync="pm.selectedBranches"
      :open="pm.shouldOpenBranchesBottomSheet"
      :item-groups="pm.branches"
      :search-label="$t('SEARCH_BRANCHES')"
      @search="pm.searchBranches($event)"
      @submit:selections="pm.onBranchesSelection($event)"
      @backdrop="pm.closeBranchesBottomSheet()"
    >
      <template #header>{{ $t('SET_UPDATE_BRANCHES') }} </template>
      <template #item="{ item }">
        <vg-flex flex-direction="column" gap-size="mid" no-wrap>
          <div class="vg-text--bold">
            {{ item.label }}
          </div>
          <div v-if="pm.isBranchSelected(item)">
            <vg-button
              outlined
              primary
              @click="pm.selectAllBranchesFromVendor(item.value)"
            >
              {{
                $t('SELECT_ALL_BRANCHES_FROM_VENDOR', {
                  vendorLabel: item.value.vendorLabel,
                })
              }}
            </vg-button>
          </div>
        </vg-flex>
      </template>
      <template #submit="{ selections }">
        {{ $t('ADD_BRANCHES', { selectionsCount: selections.length }) }}
      </template>
    </specific-branches-bottom-sheet-list>
    <vg-bottom-sheet-list
      searchable
      :loading="pm.loading"
      :open="pm.shouldOpenBranchesIncludedBottomSheet"
      :item-groups="pm.branchesIncluded"
      :search-label="$t('SEARCH_BRANCHES')"
      @search="pm.searchBranchesIncluded($event)"
      @backdrop="pm.closeBranchesIncludedBottomSheet()"
    >
      <template #header>{{ $t('INCLUDED_BRANCHES') }}</template>
      <template #item="{ item }">
        <vg-flex align-items="stretch" gap-size="mid" no-wrap>
          <div class="vg-text--bold">
            {{ item.label }}
          </div>
        </vg-flex>
      </template>
    </vg-bottom-sheet-list>
  </vg-content>
</template>

<script lang="ts">
import CampaignSetup from './CampaignSetup.ts.vue';
import EligibleUsers from './EligibleUsers.ts.vue';
import EligibleVendorsBranches from './EligibleVendorsBranches.ts.vue';
import PromoCodeSetup from './PromoCodeSetup.ts.vue';
import SpecificBranchesBottomSheetList from './SpecificBranchesBottomSheetList.ts.vue';
import Vue from 'vue';
import { AreasRepoImpl } from '../../../repositories/areas/AreasRepoImpl';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { CampaignCreationPM } from '../../../../core/presentation-models/campaigns/CampaignCreationPM';
import { CampaignsRepoImpl } from '../../../repositories/campaigns/CampaignsRepoImpl';
import { HashTagsRepoImpl } from '../../../repositories/hash-tags/HashTagsRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'PromotionCreationView',
  components: {
    EligibleVendorsBranches,
    EligibleUsers,
    PromoCodeSetup,
    CampaignSetup,
    VgGrid,
    VgPanel,
    VgContent,
    VgFlex,
    VgBottomSheetList,
    VgButton,
    SpecificBranchesBottomSheetList,
  },
  data() {
    return {
      pm: new CampaignCreationPM({
        notificationService,
        campaignsRepo: new CampaignsRepoImpl(),
        hashTagsRepo: new HashTagsRepoImpl(),
        branchesRepo: new BranchesRepoImpl(),
        areasRepo: new AreasRepoImpl(),
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.CAMPAIGN_CREATION,
          text: 'CAMPAIGN_CREATION',
        },
      ];
    },
  },
  methods: {
    async discard(): Promise<void> {
      await this.$router.push({ name: ROUTE_NAMES.CAMPAIGNS_LIST });
    },
    async submit(): Promise<void> {
      const submitted = await this.pm.submit();
      if (submitted) {
        await this.$router.push({ name: ROUTE_NAMES.CAMPAIGNS_LIST });
      }
    },
  },
});
</script>

<style scoped>
.form-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 var(--inset-large);
}

.form-actions__save {
  margin-inline-start: var(--inset-mid);
}
</style>
