<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_TAGS')">
    <vg-flex gap-size="small" align-items="center">
      <vg-chip
        v-for="tag in tags"
        :key="tag.id"
        :img="tag.icon"
        @cancel="removeTag(tag)"
      >
        {{ $t(tag.name) }}
      </vg-chip>
      <div>
        <vg-button
          class="add-button"
          outlined
          icon
          :loading="loading"
          :disabled="loading"
          @click="openTagSelection"
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
import { UnifiedTag } from '../../../../core/models/UnifiedTag';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  updateTags: 'update:tags',
  openTagSelection: 'open:tag-selection',
};
export default Vue.extend({
  name: 'VendorOnlineFormCreationTags',
  components: { VgPanel, VgChip, VgButton, VgFlex },
  props: {
    tags: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeTag(tag: UnifiedTag): void {
      this.$emit(
        events.updateTags,
        (this.tags as UnifiedTag[]).filter(
          (selectedTag: UnifiedTag) => selectedTag.id != tag.id
        )
      );
    },
    openTagSelection(): void {
      this.$emit(events.openTagSelection);
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
