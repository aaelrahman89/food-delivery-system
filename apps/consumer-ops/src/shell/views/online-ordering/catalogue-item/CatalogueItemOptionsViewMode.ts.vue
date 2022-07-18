<template>
  <vg-grid class="vg-border vg-padding--mid">
    <vg-flex justify-content="flex-end">
      <div>
        <vg-button outlined large @click="switchToOptionsUpdateMode">{{
          $t('CATALOGUE_ITEM_OPTIONS_UPDATE')
        }}</vg-button>
      </div>
    </vg-flex>
    <div class="vg-border vg-border--dashed"></div>
    <vg-panel
      v-for="option in options"
      :key="option.id"
      dark
      :title="addRequiredPrefix(option)"
    >
      <vg-flex gap-size="small">
        <vg-chip>
          {{
            $t('CATALOGUE_ITEM_OPTIONS_SELECTIONS', {
              selectionsCount: option.selections.length,
            })
          }}
        </vg-chip>
        <vg-chip>
          {{ selectionsLimit(option) }}
        </vg-chip>
      </vg-flex>
    </vg-panel>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueItemOption } from '../../../../core/models/CatalogueItemOption';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  switchOptionsUpdate: 'switch:options-update',
};

export default Vue.extend({
  name: 'CatalogueItemOptionsViewMode',
  components: {
    VgFlex,
    VgChip,
    VgButton,
    VgPanel,
    VgGrid,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  methods: {
    switchToOptionsUpdateMode(): void {
      this.$emit(events.switchOptionsUpdate);
    },
    addRequiredPrefix(option: CatalogueItemOption): string {
      if (option.mandatory)
        return `${this.$t(option.displayName)} (${this.$t('MISC_REQUIRED')})`;
      return this.$t(option.displayName);
    },
    selectionsLimit(option: CatalogueItemOption): string {
      if (option.multiSelection)
        return this.$t('CATALOGUE_ITEM_OPTIONS_SELECTIONS_LIMIT_MULTI', {
          min: option.minAllowed,
          max: option.maxAllowed,
        });
      return this.$t('CATALOGUE_ITEM_OPTIONS_SELECTIONS_LIMIT_SINGLE');
    },
  },
});
</script>

<style scoped></style>
