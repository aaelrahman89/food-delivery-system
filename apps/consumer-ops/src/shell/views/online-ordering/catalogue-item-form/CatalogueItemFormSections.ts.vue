<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_CATALOGUE_SECTIONS')">
    <vg-flex gap-size="small" align-items="center">
      <vg-chip
        v-for="section in sections"
        :key="section.id"
        @cancel="removeSection(section)"
      >
        {{ $t(section.displayName) }}
      </vg-chip>
      <div>
        <vg-button
          class="add-button"
          outlined
          icon
          :loading="loading"
          :disabled="loading"
          @click="openSectionsSelection"
        >
          <svg viewBox="0 0 448 448" class="add-button__icon">
            <path
              d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
            />
          </svg>
        </vg-button>
      </div>
    </vg-flex>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueSection } from '../../../../core/models/Catalogue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  updateSections: 'update:sections',
  openSectionsSelection: 'open:sections-selection',
};
export default Vue.extend({
  name: 'CatalogueItemFormSections',
  components: { VgPanel, VgChip, VgButton, VgFlex },
  props: {
    sections: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeSection(section: CatalogueSection): void {
      this.$emit(
        events.updateSections,
        (this.sections as CatalogueSection[]).filter(
          (selectedSection: CatalogueSection) =>
            selectedSection.id != section.id
        )
      );
    },
    openSectionsSelection(): void {
      this.$emit(events.openSectionsSelection);
    },
  },
});
</script>

<style scoped>
.add-button__icon {
  width: 14px;
  height: 14px;
  fill: var(--color-primary);
}
</style>
