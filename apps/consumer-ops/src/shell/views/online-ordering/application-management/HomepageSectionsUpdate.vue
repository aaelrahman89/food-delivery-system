<template>
  <vg-actionable-panel>
    <template #header>
      <div class="app-management__header">
        <vg-flex gap-size="small">
          <div>
            <vg-button outlined large :to="sectionsViewRoute">
              {{ $t('APP_MANAGEMENT_SECTION_DISCARD') }}
            </vg-button>
          </div>
          <div>
            <vg-button
              outlined
              large
              :disabled="disableSaveLayoutChanges"
              @click="saveLayoutChanges"
            >
              {{ $t('APP_MANAGEMENT_SECTION_SAVE') }}
            </vg-button>
          </div>
        </vg-flex>
        <div>
          <vg-button outlined large @click="openSectionCreation"
            ><div class="add-button">
              <svg viewBox="0 0 448 448" class="add-button__icon">
                <path
                  d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
                />
              </svg>
              <span>{{ $t('APP_MANAGEMENT_ADD_SECTION') }}</span>
            </div>
          </vg-button>
        </div>
      </div>
    </template>
    <vg-draggable
      :list="sections"
      gutters="small"
      @update:list="arrangeSections"
    >
      <template #item="{ item }" class="here">
        <div class="vg-border vg-padding--mid vg-surface--dark">
          <vg-flex justify-content="space-between" align-items="flex-start">
            <div class="vg-text--mid vg-text-emphasis--mid">
              {{ item.name }}
            </div>
            <vg-flex align-items="center" flex-grow="0">
              <div class="dragging-icon-container">
                <vg-svg
                  class="dragging-icon"
                  :src="SVG_ICON_DRAG"
                  width="24px"
                  height="24px"
                />
              </div>
              <vg-action-menu :actions="computeItemMenuAction(item)" />
            </vg-flex>
          </vg-flex>
          <div>
            <vg-pairs-list :pairs="item.pairs"></vg-pairs-list>
          </div>
        </div>
      </template>
    </vg-draggable>
  </vg-actionable-panel>
</template>

<script>
import { SVG_ICON_DRAG } from '@survv/assets';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgActionablePanel } from '@survv/commons/components/VgActionablePanel';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgDraggable } from '@survv/commons/components/VgDraggable';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPairsList } from '@survv/commons/components-deprecated/VgPairs';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  openSectionCreation: 'open:section-creation',
  arrangeSections: 'arrange:sections',
  saveLayoutChanges: 'save-layout-changes',
  removeSection: 'remove:section',
};

export default {
  name: 'HomepageSectionsUpdate',
  components: {
    VgActionablePanel,
    VgButton,
    VgPairsList,
    VgDraggable,
    VgFlex,
    VgActionMenu,
    VgSvg,
  },
  props: {
    sections: {
      type: Array,
      default() {
        return [];
      },
    },
    disableSaveLayoutChanges: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      SVG_ICON_DRAG,
    };
  },

  computed: {
    sectionsViewRoute() {
      return {
        name: 'routes.online_ordering.application.view',
        params: { ...this.$route.params },
      };
    },
  },
  methods: {
    openSectionCreation() {
      this.$emit(events.openSectionCreation);
    },
    arrangeSections(sortedSections) {
      this.$emit(events.arrangeSections, sortedSections);
    },
    saveLayoutChanges() {
      this.$emit(events.saveLayoutChanges);
    },
    computeItemMenuAction(item) {
      const actions = [];
      actions.push({
        name: this.$t('APP_MANAGEMENT_SECTION_REMOVE'),
        onClick: () => {
          this.$emit(events.removeSection, item);
        },
      });
      return actions;
    },
  },
};
</script>

<style scoped lang="scss">
.app-management__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.vg-button:not(:last-child) {
  margin-inline-end: var(--inset-large);
}
.add-button {
  display: flex;
  align-items: center;
}
.add-button__icon {
  width: 14px;
  height: 14px;
  fill: var(--color-primary);
  margin-inline-end: var(--inset-small);
}
.dragging-icon-container {
  display: inline-block;
}
.dragging-icon {
  cursor: move;
}
</style>
