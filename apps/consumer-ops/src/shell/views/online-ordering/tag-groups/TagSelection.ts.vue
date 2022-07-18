<template>
  <vg-bottom-sheet-list
    :open="open"
    :item-groups="selectionGroups"
    selectable
    :selections.sync="computedSelections"
    @update:selections="submit"
    @backdrop="backdrop"
  >
    <template #header>
      {{ $t('TAG_SELECTION_HEADER') }}
    </template>
    <template #submit="{ selections }">
      {{ $t('TAG_SELECTION_SAVE', { quantity: selections.length }) }}
    </template>
  </vg-bottom-sheet-list>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  BottomSheetListGroup,
  BottomSheetListItem,
} from '@survv/commons/core/models/ItemsList';
import { TagGroupCreationPM } from '../../../../core/presentation-models/online-ordering/TagGroupCreationPM';
import { TagGroupUpdatePM } from '../../../../core/presentation-models/online-ordering/TagGroupUpdatePM';
import { UnifiedTag } from '../../../../core/models/UnifiedTag';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList/index';

const events = {
  open: 'open',
  submit: 'submit',
  backdrop: 'backdrop',
};

function tagToGroupItem(tag: UnifiedTag): BottomSheetListItem<UnifiedTag> {
  return {
    id: tag.id,
    label: tag.name,
    icon: tag.icon,
    value: tag,
  };
}

export default Vue.extend({
  name: 'TagSelection',
  components: {
    VgBottomSheetList,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: [TagGroupCreationPM, TagGroupUpdatePM],
      default: undefined,
    },
  },
  computed: {
    selectionGroups(): BottomSheetListGroup<UnifiedTag>[] {
      if (this.pm) {
        return Object.entries(this.pm.tagGroupOptions).map(
          ([groupName, tags]) => {
            return {
              name: groupName,
              items: tags.map(tagToGroupItem),
            };
          }
        );
      }
      return [];
    },
    computedSelections: {
      get(): UnifiedTag[] {
        if (this.pm) {
          return this.pm.form.tags as UnifiedTag[];
        }
        return [];
      },
      set(selections: UnifiedTag[]): void {
        if (this.pm) {
          this.pm.form.tags = selections;
        }
      },
    },
  },
  watch: {
    open(value): void {
      this.$emit(events.open, value);
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    submit(): void {
      this.$emit(events.submit);
    },
  },
});
</script>

<style scoped lang="scss"></style>
