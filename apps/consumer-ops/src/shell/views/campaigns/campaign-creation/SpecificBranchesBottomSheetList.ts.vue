<template>
  <vg-overlay
    type="bottom-sheet"
    max-width="600px"
    :open="open"
    @backdrop="backdrop"
  >
    <div class="vg-bottom-sheet-list">
      <div class="vg-bottom-sheet-list__header">
        <h1><slot name="header"></slot></h1>
      </div>
      <div v-if="searchable" class="vg-bottom-sheet-list__search">
        <vg-text-field
          v-model="searchValue"
          outlined
          hide-details
          type="text"
          :label="searchLabel"
          clearable
          max-width="100%"
          @input="search"
        ></vg-text-field>
      </div>
      <div v-if="loading" class="progress-loader">
        <vg-progress-circular indeterminate size="80"></vg-progress-circular>
      </div>
      <div v-else>
        <div class="vg-bottom-sheet-list__body">
          <div
            v-for="(group, index) in groups"
            :key="index"
            class="vg-bottom-sheet-list__body__group"
          >
            <div
              v-if="group.name"
              class="vg-bottom-sheet-list__body__group__header"
            >
              {{ $t(group.name) }}
            </div>
            <div
              v-for="item in group.items"
              :key="item.id"
              class="vg-bottom-sheet-list__body__group__item"
              :class="{ clickable: clickable }"
              @click="handleItemClick(item)"
            >
              <slot name="item" :item="item">
                <div class="vg-bottom-sheet-list__body__group__item__title">
                  <vg-img
                    v-if="item.icon"
                    :src="item.icon"
                    alt="item-icon"
                    width="36px"
                    height="36px"
                    border-radius="4px"
                    class="vg-border vg-margin-inline-end--small"
                  />
                  <div>
                    {{ item.label }}
                  </div>
                </div>
              </slot>
              <div v-if="selectable">
                <vg-checkbox
                  :value="isSelected(item)"
                  hide-details
                  class="vg-bottom-sheet-list__body__group__item__checkbox"
                ></vg-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectable" class="vg-bottom-sheet-list__footer">
        <div>
          <vg-button
            :disabled="shouldDisableSelectionCommit"
            @click="onCommitSelections"
          >
            <slot name="submit" :selections="localSelections"></slot>
          </vg-button>
        </div>
      </div>
    </div>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  BottomSheetListGroup,
  BottomSheetListItem,
} from '@survv/commons/core/models/ItemsList';
import { PropValidator } from 'vue/types/options';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgProgressCircular } from '@survv/commons/components/VgProgressCircular';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { deepEqual, notDeepEqual } from '@survv/commons/core/utils/checks';

const events = {
  open: 'open',
  backdrop: 'backdrop',
  updateSelections: 'update:selections',
  clickItem: 'click:item',
  search: 'search',
  submitSelections: 'submit:selections',
};

export default Vue.extend({
  name: 'SpecificBranchesBottomSheetList',
  components: {
    VgOverlay,
    VgButton,
    VgCheckbox,
    VgTextField,
    VgImg,
    VgProgressCircular,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    itemGroups: {
      type: Array,
      required: true,
    } as PropValidator<BottomSheetListGroup<unknown>[]>,
    searchable: {
      type: Boolean,
      default: false,
    },
    searchLabel: {
      type: String,
      default: 'SEARCH_LABEL',
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selections: {
      type: Array,
      default(): BottomSheetListItem<unknown>[] {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localSelections: [] as unknown[],
      searchValue: '',
      searchDebounceTimer: 0,
    };
  },
  computed: {
    groups(): BottomSheetListGroup<unknown>[] {
      return [...this.itemGroups] as BottomSheetListGroup<unknown>[];
    },
    shouldDisableSelectionCommit(): boolean {
      return !this.selectable || this.localSelections.length < 1;
    },
    clickable(): boolean {
      return Boolean(this.$listeners[events.clickItem]) || this.selectable;
    },
  },
  watch: {
    open(value): void {
      if (value === true) {
        this.resetLocalSelections();
      }
      this.$emit(events.open, value);
    },
    selections(value): void {
      this.localSelections = [...value];
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    resetLocalSelections(): void {
      if (this.selectable) {
        this.localSelections = [...this.selections];
      }
    },

    onCommitSelections(): void {
      this.$emit(events.submitSelections, [...this.localSelections]);
    },
    isSelected(item: BottomSheetListItem<unknown>): boolean {
      return this.localSelections.some((selection) =>
        deepEqual(selection, item.value)
      );
    },
    toggleItemSelection(item: BottomSheetListItem<unknown>): void {
      if (this.isSelected(item)) {
        this.localSelections = this.localSelections.filter((selection) =>
          notDeepEqual(selection, item.value)
        );
      } else {
        this.localSelections = [...this.localSelections, item.value];
      }
      this.$emit(events.updateSelections, this.localSelections);
    },
    handleItemClick(item: BottomSheetListItem<unknown>): void {
      if (this.selectable) {
        this.toggleItemSelection(item);
      } else {
        this.$emit(events.clickItem, item.value);
      }
    },
    search(value: string): void {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = window.setTimeout(() => {
        this.$emit(events.search, value);
      }, 500);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-bottom-sheet-list {
  background-color: var(--color-surface-light);
  display: grid;
  grid-gap: var(--inset-large);
  padding: var(--inset-mid);

  &__body,
  &__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__body {
    overflow: auto;
    &__group {
      width: 100%;
      margin: var(--inset-small) 0;
      &__header {
        font-weight: 600;
      }
      &__item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        margin: var(--inset-small) 0;
        padding: var(--inset-small);

        &__title {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        }

        &__checkbox {
          margin: 0;
        }
      }
    }
  }

  &__footer {
    background-color: var(--color-border-light);
    margin: calc(var(--inset-mid) * -1);
    padding: var(--inset-mid);
  }
}
.clickable {
  cursor: pointer;
}
.progress-loader {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
