<template>
  <div class="catalogue-form">
    <catalogue-form-display-name
      :display-name.sync="formPM.form.displayName"
      :validations="formPM.validators()"
      :disable-display-name-en="formPM.disableDisplayNameEn()"
      :disable-display-name-ar="formPM.disableDisplayNameAr()"
    ></catalogue-form-display-name>
    <catalogue-form-ordering-hours
      :ordering-hours.sync="formPM.form.orderingHours"
      :validations="formPM.validators()"
    ></catalogue-form-ordering-hours>
    <catalogue-form-description
      :description.sync="formPM.form.description"
      :disable-description-en="formPM.disableDescriptionEn()"
      :disable-description-ar="formPM.disableDescriptionAr()"
    ></catalogue-form-description>
    <catalogue-form-branches
      :branches="formPM.form.branches"
      @add-branch="formPM.openBranchesSelections()"
      @remove="formPM.removeSelectedBranch($event)"
    >
    </catalogue-form-branches>
    <vg-bottom-sheet-list
      :open="formPM.shouldOpenBranchesSelections"
      :item-groups="formPM.branches"
      selectable
      :selections="formPM.form.branches"
      @backdrop="formPM.closeBranchesSelections()"
      @update:selections="formPM.addBranches($event)"
    >
      <template #header>
        {{ $t('BRANCH_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{ $t('BRANCH_SELECTION_SAVE', { quantity: selections.length }) }}
      </template>
    </vg-bottom-sheet-list>
  </div>
</template>

<script lang="ts">
import CatalogueFormBranches from './CatalogueFormBranches.ts.vue';
import CatalogueFormDescription from './CatalogueFormDescription.ts.vue';
import CatalogueFormDisplayName from './CatalogueFormDisplayName.ts.vue';
import CatalogueFormOrderingHours from './CatalogueFormOrderingHours.ts.vue';
import Vue from 'vue';
import { CatalogueFormPM } from '../../../../../core/presentation-models/online-ordering/CatalogueFormPM';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';

export default Vue.extend({
  name: 'CatalogueForm',
  components: {
    CatalogueFormDisplayName,
    CatalogueFormDescription,
    CatalogueFormOrderingHours,
    CatalogueFormBranches,
    VgBottomSheetList,
  },
  props: {
    formPM: {
      type: CatalogueFormPM,
      required: true,
    },
  },
});
</script>

<style scoped>
.catalogue-form {
  display: grid;
  row-gap: var(--inset-mid);
}
</style>
