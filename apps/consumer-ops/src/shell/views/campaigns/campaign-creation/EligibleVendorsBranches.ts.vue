<template>
  <div class="eligible-vendors-branches-container">
    <vg-panel :title="$t('ELIGIBLE_VENDORS_BRANCHES')" dark>
      <v-radio-group
        :value="eligibleBranchesCriteria"
        hide-details
        style="margin: 0"
        @change="updateEligibleBranchesCriteria"
      >
        <eligibility-option
          :text="$t(branchesEligibilityCriterion.ALL_VENDORS.toString())"
          :value="branchesEligibilityCriterion.ALL_VENDORS.value"
        ></eligibility-option>
        <eligibility-option
          :text="$t(branchesEligibilityCriterion.BRANCHES_IN_AREAS.toString())"
          :value="branchesEligibilityCriterion.BRANCHES_IN_AREAS.value"
        >
          <div
            v-if="isSelected(branchesEligibilityCriterion.BRANCHES_IN_AREAS)"
          >
            <vg-flex gap-size="small">
              <div>{{ selectedAreasCount }} {{ $t('AREAS_SELECTED') }}</div>
              <div>
                <vg-button
                  :loading="loading"
                  expand
                  outlined
                  primary
                  @click="viewBranchesIncluded"
                >
                  {{ $t('VIEW_BRANCHES_INCLUDED', { branchesIncludedCount }) }}
                </vg-button>
              </div>
              <div>
                <vg-button
                  :disabled="loading"
                  expand
                  primary
                  @click="setUpdateAreas"
                  >{{ $t('SET_UPDATE_GEO_BOUNDRY') }}</vg-button
                >
              </div>
            </vg-flex>
          </div>
        </eligibility-option>
        <eligibility-option
          :text="$t(branchesEligibilityCriterion.BRANCHES_WITH_TAGS.toString())"
          :value="branchesEligibilityCriterion.BRANCHES_WITH_TAGS.value"
        >
          <div
            v-if="isSelected(branchesEligibilityCriterion.BRANCHES_WITH_TAGS)"
          >
            <vg-flex gap-size="small">
              <div>
                {{ selectedHashTagsCount }} {{ $t('HASH_TAG_SELECTED') }}
              </div>
              <div>
                <vg-button
                  expand
                  outlined
                  primary
                  :loading="loading"
                  @click="viewBranchesIncluded"
                  >{{ $t('VIEW_BRANCHES_INCLUDED', { branchesIncludedCount }) }}
                </vg-button>
              </div>
              <div>
                <vg-button
                  :disabled="loading"
                  expand
                  primary
                  @click="setUpdateTags"
                  >{{ $t('SET_UPDATE_HASHTAGS') }}
                </vg-button>
              </div>
            </vg-flex>
          </div>
        </eligibility-option>
        <eligibility-option
          :text="$t(branchesEligibilityCriterion.SUBSET_OF_BRANCHES.toString())"
          :value="branchesEligibilityCriterion.SUBSET_OF_BRANCHES.value"
        >
          <div
            v-if="isSelected(branchesEligibilityCriterion.SUBSET_OF_BRANCHES)"
          >
            <vg-flex gap-size="small">
              <div>
                {{ selectedBranchesCount }} {{ $t('BRANCHES_SELECTED') }}
              </div>
              <div>
                <vg-button
                  :loading="loading"
                  expand
                  outlined
                  primary
                  @click="viewBranchesIncluded"
                  >{{ $t('VIEW_BRANCHES_INCLUDED', { branchesIncludedCount }) }}
                </vg-button>
              </div>
              <div>
                <vg-button
                  :disabled="loading"
                  expand
                  primary
                  @click="setUpdateBranches"
                >
                  {{ $t('SET_UPDATE_BRANCHES') }}
                </vg-button>
              </div>
            </vg-flex>
          </div>
        </eligibility-option>
      </v-radio-group>
    </vg-panel>
  </div>
</template>

<script lang="ts">
import EligibilityOption from './EligibilityOption.ts.vue';
import Vue from 'vue';
import { PromotionBranchesCriteria } from '../../../../core/models/Promotion';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  updateEligibleBranchesCriteria: 'update:eligible-branches-criteria',
  setUpdateTagsClicked: 'click:set-update-tags',
  setUpdateAreasClicked: 'click:set-update-areas',
  setUpdateBranchesClicked: 'click:set-update-branches',
  viewBranchesIncluded: 'click:view-branches-included',
};

export default Vue.extend({
  name: 'EligibleVendorsBranches',
  components: { VgPanel, VgButton, VgFlex, EligibilityOption },
  props: {
    eligibleBranchesCriteria: {
      type: String,
      required: true,
    },
    branchesEligibilityCriterion: {
      type: Object,
      required: true,
    },
    selectedHashTagsCount: {
      type: Number,
      required: true,
    },
    selectedAreasCount: {
      type: Number,
      required: true,
    },
    selectedBranchesCount: {
      type: Number,
      required: true,
    },
    branchesIncludedCount: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    updateEligibleBranchesCriteria(val: string): void {
      this.$emit(events.updateEligibleBranchesCriteria, val);
    },
    isSelected(eligibilityOption: PromotionBranchesCriteria): boolean {
      return eligibilityOption.equals(this.eligibleBranchesCriteria);
    },
    setUpdateTags(): void {
      this.$emit(events.setUpdateTagsClicked);
    },
    setUpdateAreas(): void {
      this.$emit(events.setUpdateAreasClicked);
    },
    setUpdateBranches(): void {
      this.$emit(events.setUpdateBranchesClicked);
    },
    viewBranchesIncluded(): void {
      this.$emit(events.viewBranchesIncluded);
    },
  },
});
</script>

<style lang="scss" scoped>
.eligible-vendors-branches-container {
  width: 354px;
}
.container {
  padding: var(--inset-tiny) var(--inset-small);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  margin: var(--inset-small) 0;
  min-width: 314px;
  background-color: var(--color-surface-light);
}
.radio-button-content {
  padding: 0 var(--inset-tiny);
  margin: 0 0 var(--inset-small);
}
.radio-button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--color-on-surface-low-emphasis);

  &__radio-button {
    margin: 0 -8px 0 0;
  }
}
</style>
