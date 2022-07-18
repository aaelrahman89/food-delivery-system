<template>
  <vg-grid>
    <div class="catalogue__sections__header">
      <vg-flex gap-size="small">
        <div>
          <vg-button
            :to="viewModeRoute"
            outlined
            large
            @click="discardCatalogueSectionsUpdate"
          >
            {{ $t('CATALOGUE_SECTIONS_DISCARD_ITEMS_UPDATE') }}
          </vg-button>
        </div>
        <div>
          <vg-button
            :outlined="!disableSaveLayoutChanges"
            large
            :dark="disableSaveLayoutChanges"
            :disabled="disableSaveLayoutChanges"
            @click="saveLayoutChanges"
          >
            {{ $t('CATALOGUE_SECTIONS_SAVE_ITEMS_UPDATE') }}
          </vg-button>
        </div>
      </vg-flex>
      <vg-button outlined large @click="addItems">
        <vg-flex
          gap-size="small"
          align-items="center"
          justify-content="center"
          no-wrap
        >
          <div>
            <svg viewBox="0 0 448 448" class="add-button__icon">
              <path
                d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
              />
            </svg>
          </div>
          <div>
            {{ $t('CATALOGUE_SECTIONS_ADD_ITEM') }}
          </div>
        </vg-flex>
      </vg-button>
    </div>
    <div>
      <div class="catalogue-sections-container">
        <div class="catalogue-sections-container__tabs">
          <div class="catalogue-sections-container__tabs__header">
            <vg-button outlined @click="openCatalogueSectionCreation">
              <vg-flex
                gap-size="small"
                align-items="center"
                justify-content="center"
                no-wrap
              >
                <div>
                  <svg viewBox="0 0 448 448" class="add-button__icon">
                    <path
                      d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
                    />
                  </svg>
                </div>
                <div>
                  {{ $t('CATALOGUE_SECTIONS_CREATE_SECTION') }}
                </div>
              </vg-flex>
            </vg-button>
          </div>
          <vg-draggable
            :list="catalogueSections"
            handler-class="dragging-icon"
            @update:list="updateCatalogueSections"
          >
            <template #item="{ item }">
              <div
                class="
                  catalogue-sections-container__tabs__section__item
                  vg-clickable
                "
                :class="{
                  active: isActiveSection(item),
                }"
                @click="selectCatalogueSection(item)"
              >
                <vg-flex
                  justify-content="space-between"
                  align-items="center"
                  class="vg-padding--small"
                >
                  <div
                    class="
                      catalogue-sections-container__tabs__section__item__label
                    "
                  >
                    {{ $t(item.displayName) }}
                  </div>
                  <div>
                    <svg
                      class="dragging-icon"
                      version="1.1"
                      viewBox="0 0 512 240"
                      xml:space="preserve"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <rect height="32" width="512" y="144" />
                        <rect height="32" width="512" y="240" />
                      </g>
                    </svg>
                  </div>
                </vg-flex>
              </div>
            </template>
          </vg-draggable>
        </div>
        <div
          v-if="selectedCatalogueSection.id"
          class="catalogue-sections-container__catalogue-sections"
        >
          <div class="catalogue-sections-container__catalogue-sections__header">
            {{ $t(selectedCatalogueSection.displayName) }}
            {{
              selectedCatalogueSection.taxTier.id !== 0
                ? `- ${$t(selectedCatalogueSection.taxTier.displayName)} (${$t(
                    selectedCatalogueSection.taxTier.percentage
                  )})`
                : ''
            }}
            <vg-action-menu
              :actions="catalogueSectionMenuActions"
              color="primary"
              outlined
            ></vg-action-menu>
          </div>
          <div class="catalogue-sections-container__catalogue-sections__items">
            <vg-draggable
              :list="selectedCatalogueSection.items"
              handler-class="dragging-icon"
              @update:list="updateSelectedCatalogueSection"
            >
              <template #item="{ item }">
                <vg-cover>
                  <template>
                    <vg-img
                      :src="item.icon"
                      alt="item-icon"
                      width="140px"
                      height="140px"
                      border-radius="4px"
                      class="vg-border"
                    ></vg-img>
                  </template>
                  <template #content>
                    <vg-grid>
                      <vg-flex justify-content="space-between">
                        <vg-bilingual-string
                          :value="item.displayName"
                        ></vg-bilingual-string>
                        <div>
                          <vg-flex gap-size="small" align-items="center">
                            <div>
                              <svg
                                class="dragging-icon"
                                version="1.1"
                                viewBox="0 0 512 240"
                                xml:space="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <rect height="32" width="512" y="144" />
                                  <rect height="32" width="512" y="240" />
                                </g>
                              </svg>
                            </div>
                            <vg-action-menu
                              :actions="computeItemMenuAction(item)"
                            ></vg-action-menu>
                          </vg-flex>
                        </div>
                      </vg-flex>
                      <div>
                        {{ $t(item.description) }}
                      </div>
                      <vg-flex gap-size="small">
                        <vg-pair
                          dense
                          :label="$t('CATALOGUE_SECTIONS_ITEM_PRICE')"
                          :value="`${item.price} ${$t(item.price.currency)}`"
                        ></vg-pair>
                        <vg-pair
                          dense
                          :label="
                            $t('CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME')
                          "
                          :value="`${item.prepTime} ${$t(
                            'CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME_UNIT'
                          )}`"
                        ></vg-pair>
                        <vg-pair
                          dense
                          :label="$t('CATALOGUE_SECTIONS_ITEM_CALORIES')"
                          :value="item.calories"
                        ></vg-pair>
                        <vg-pair
                          dense
                          :label="$t('CATALOGUE_SECTIONS_ITEM_POPULAR')"
                          :value="$t(item.popular.toString())"
                        ></vg-pair>
                        <vg-pair
                          dense
                          :label="$t('CATALOGUE_SECTIONS_ITEM_TAX_CATEGORY')"
                          :value="
                            selectedCatalogueSection.taxTier.id !== 0
                              ? `${$t(
                                  selectedCatalogueSection.taxTier.displayName
                                )} (${$t(
                                  selectedCatalogueSection.taxTier.percentage
                                )})`
                              : ''
                          "
                        ></vg-pair>
                      </vg-flex>
                      <vg-flex gap-size="small">
                        <vg-chip
                          v-for="tag in item.tags"
                          :key="tag.id"
                          :img="tag.icon"
                        >
                          {{ $t(tag.name) }}
                        </vg-chip>
                      </vg-flex>
                    </vg-grid>
                  </template>
                </vg-cover>
              </template>
            </vg-draggable>
          </div>
        </div>
      </div>
    </div>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMenuItem } from '@survv/commons/core/models/ActionMenu';
import {
  CatalogueSection,
  CatalogueSectionItem,
} from '../../../../core/models/Catalogue';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgCover } from '@survv/commons/components/VgCover';
import { VgDraggable } from '@survv/commons/components/VgDraggable';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgPair } from '@survv/commons/components/VgPair';

const events = {
  discardCatalogueSectionsUpdate: 'discard-catalogue-sections-update',
  openCatalogueSectionCreation: 'open-catalogue-section-creation',
  openCatalogueSectionUpdate: 'open-catalogue-section-update',
  selectCatalogueSection: 'select:catalogue-section',
  addItems: 'add-items',
  updateCatalogueSections: 'update:catalogue-sections',
  updateSelectedCatalogueSection: 'update:selected-catalogue-section',
  saveLayoutChanges: 'save-layout-changes',
  setPopularItem: 'set-popular:item',
  unsetPopularItem: 'unset-popular:item',
  archiveItem: 'archive:item',
};

export default Vue.extend({
  name: 'CatalogueSectionsEditMode',
  components: {
    VgButton,
    VgGrid,
    VgCover,
    VgBilingualString,
    VgFlex,
    VgPair,
    VgActionMenu,
    VgChip,
    VgImg,
    VgDraggable,
  },
  props: {
    viewModeRoute: {
      type: Object,
      required: true,
    },
    catalogueSections: {
      type: Array,
      default: (): [] => {
        return [];
      },
    },
    selectedCatalogueSection: {
      type: CatalogueSection,
      default: undefined,
    },
    disableSaveLayoutChanges: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      catalogueSectionMenuActions: [
        {
          name: this.$t('CATALOGUE_SECTIONS_EDIT_SECTION'),
          onClick: (): void => {
            this.$emit(events.openCatalogueSectionUpdate);
          },
        },
      ],
    };
  },
  methods: {
    discardCatalogueSectionsUpdate(): void {
      this.$emit(events.discardCatalogueSectionsUpdate);
    },
    openCatalogueSectionCreation(): void {
      this.$emit(events.openCatalogueSectionCreation);
    },
    openCatalogueSectionUpdate(): void {
      this.$emit(events.openCatalogueSectionUpdate);
    },
    selectCatalogueSection(section: CatalogueSection): void {
      this.$emit(events.selectCatalogueSection, section);
    },
    addItems(): void {
      this.$emit(events.addItems);
    },
    isActiveSection(section: CatalogueSection): boolean {
      return section.id === this.selectedCatalogueSection?.id;
    },
    computeItemMenuAction(item: CatalogueSectionItem): ActionMenuItem[] {
      const actions: ActionMenuItem[] = [];
      if (item.popular) {
        actions.push({
          name: this.$t('CATALOGUE_SECTIONS_UNSET_ITEM_POPULAR'),
          onClick: (): void => {
            this.$emit(events.unsetPopularItem, item.id);
          },
        });
      }
      if (!item.popular) {
        actions.push({
          name: this.$t('CATALOGUE_SECTIONS_SET_ITEM_POPULAR'),
          onClick: (): void => {
            this.$emit(events.setPopularItem, item.id);
          },
        });
      }
      if (!item.archived) {
        actions.push({
          name: this.$t('CATALOGUE_SECTIONS_ARCHIVE_ITEM'),
          onClick: (): void => {
            this.$emit(events.archiveItem, item.id);
          },
        });
      }
      return actions;
    },
    updateCatalogueSections(catalogueSections: CatalogueSection[]): void {
      this.$emit(events.updateCatalogueSections, catalogueSections);
    },
    updateSelectedCatalogueSection(
      catalogueSectionItems: CatalogueSectionItem[]
    ): void {
      this.$emit(
        events.updateSelectedCatalogueSection,
        new CatalogueSection({
          id: this.selectedCatalogueSection!.id,
          displayName: this.selectedCatalogueSection!.displayName,
          items: catalogueSectionItems,
          creationDate: this.selectedCatalogueSection!.creationDate,
          taxTier: this.selectedCatalogueSection!.taxTier,
        })
      );
    },

    saveLayoutChanges(): void {
      this.$emit(events.saveLayoutChanges);
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue__sections__header {
  display: flex;
  justify-content: space-between;
}
.catalogue__sections__header {
  display: flex;
  justify-content: space-between;
}

.catalogue-sections-container__catalogue-sections {
  width: 100%;
  min-height: 50px;

  position: relative;
  padding: var(--inset-mid);

  display: flex;
  flex-direction: column;

  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  background-color: var(--color-surface-dark);
}

.catalogue-sections-container__catalogue-sections__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  height: 48px;
  padding: var(--inset-mid);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: var(--color-on-surface-mid-emphasis);
  font-size: 24px;
  line-height: 29px;
}

.catalogue-sections-container__catalogue-sections__items {
  margin-top: calc(48px - var(--inset-mid));
  display: block;
}

.catalogue-sections-container {
  display: grid;
  grid-template-columns: 256px auto;
  column-gap: var(--inset-mid);
  height: 100%;
}
.catalogue-sections-container__tabs {
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  padding: var(--inset-mid) var(--inset-small);
  background-color: var(--color-surface-dark);
  color: var(--color-on-surface-low-emphasis);
  overflow-y: auto;
}
.catalogue-sections-container__tabs__header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 var(--inset-small);
  margin-block-end: var(--inset-mid);
}
.catalogue-sections-container__tabs__section {
  height: 48px;
  width: 100%;
  padding: var(--inset-small) 0;
}
.catalogue-sections-container__tabs__section__item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--inset-small);
}
.active {
  color: var(--color-primary);
  background: var(--color-primary-dim);
  border-radius: 4px;
}
.add-button__icon {
  width: 12px;
  height: 12px;
  fill: var(--color-primary);
}
.dragging-icon {
  width: 24px;
  height: 24px;
  cursor: move;
}
</style>
