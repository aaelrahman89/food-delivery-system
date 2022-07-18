<template>
  <vg-grid>
    <div class="catalogue-sections-container">
      <div
        v-if="catalogueSections.length"
        class="catalogue-sections-container__tabs"
      >
        <div class="catalogue-sections-container__tabs__header">
          {{ $t('CATALOGUE_SECTIONS') }}
        </div>
        <div
          v-for="section in catalogueSections"
          :key="section.id"
          class="catalogue-sections-container__tabs__section vg-clickable"
          @click="selectCatalogueSection(section)"
        >
          <div
            class="catalogue-sections-container__tabs__section__item"
            :class="{
              active: isActiveSection(section),
            }"
          >
            <div
              class="catalogue-sections-container__tabs__section__item__label"
            >
              {{ $t(section.displayName) }}
            </div>
          </div>
        </div>
      </div>
      <div class="catalogue-sections-container__catalogue-sections">
        <vg-panel
          v-if="selectedCatalogueSection.id"
          :title="$t(selectedCatalogueSection.displayName)"
          dark
          title-size="large"
        >
          <vg-grid>
            <div
              v-for="item in selectedCatalogueSection.items"
              :key="item.id"
              class="vg-link-container"
            >
              <vg-cover>
                <template>
                  <vg-img
                    :src="item.coverPhoto"
                    alt="item-cover-photo"
                    width="140px"
                    height="140px"
                    border-radius="4px"
                    class="vg-border"
                  />
                </template>
                <template #content>
                  <vg-grid>
                    <vg-flex justify-content="space-between">
                      <vg-bilingual-string :value="item.displayName" />
                      <vg-action-menu :actions="computeItemMenuAction(item)" />
                    </vg-flex>
                    <div>
                      {{ $t(item.description) }}
                    </div>
                    <vg-flex gap-size="small">
                      <vg-pair
                        dense
                        :label="$t('CATALOGUE_SECTIONS_ITEM_PRICE')"
                        :value="`${item.price} ${$t(item.price.currency)}`"
                      />
                      <vg-pair
                        dense
                        :label="$t('CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME')"
                        :value="`${item.prepTime} ${$t(
                          'CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME_UNIT'
                        )}`"
                      />
                      <vg-pair
                        dense
                        :label="$t('CATALOGUE_SECTIONS_ITEM_CALORIES')"
                        :value="item.calories"
                      />
                      <vg-pair
                        dense
                        :label="$t('CATALOGUE_SECTIONS_ITEM_POPULAR')"
                        :value="$t(item.popular.toString())"
                      />
                      <vg-pair
                        dense
                        :label="$t('CATALOGUE_SECTIONS_ITEM_AVAILABLE')"
                        :value="item.available"
                      />
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
            </div>
          </vg-grid>
        </vg-panel>
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
} from '../../../../../core/models/Catalogue';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgCover } from '@survv/commons/components/VgCover';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  selectCatalogueSection: 'select:catalogue-section',
  setItemAvailable: 'set-available:item',
  setItemUnAvailable: 'set-unavailable:item',
};

export default Vue.extend({
  name: 'CatalogueSectionsViewMode',
  components: {
    VgGrid,
    VgPanel,
    VgCover,
    VgBilingualString,
    VgFlex,
    VgPair,
    VgChip,
    VgImg,
    VgActionMenu,
  },
  props: {
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
  },
  methods: {
    selectCatalogueSection(section: CatalogueSection): void {
      this.$emit(events.selectCatalogueSection, section);
    },
    isActiveSection(section: CatalogueSection): boolean {
      return section.id === this.selectedCatalogueSection?.id;
    },
    computeItemMenuAction(item: CatalogueSectionItem): ActionMenuItem[] {
      const actions: ActionMenuItem[] = [];
      if (!item.available) {
        actions.push({
          name: this.$t('CATALOGUE_SECTIONS_SET_ITEM_AVAILABLE') as string,
          onClick: (): void => {
            this.$emit(events.setItemAvailable, item.id);
          },
        });
      } else {
        actions.push({
          name: this.$t('CATALOGUE_SECTIONS_SET_ITEM_UNAVAILABLE') as string,
          onClick: (): void => {
            this.$emit(events.setItemUnAvailable, item.id);
          },
        });
      }
      return actions;
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue__sections__header {
  display: flex;
  justify-content: flex-end;
}

.catalogue-sections-container {
  display: grid;
  grid-template-columns: 256px auto;
  column-gap: var(--inset-mid);
  height: 100%;
}
.catalogue-sections-container__catalogue-sections {
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
  padding: 0 var(--inset-small);
}
.catalogue-sections-container__tabs__section {
  width: 100%;
  padding: var(--inset-tiny) 0;
}
.catalogue-sections-container__tabs__section__item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--inset-small);
}
.catalogue-sections-container__tabs__section__item__label {
  width: 100%;
}
.active {
  color: var(--color-primary);
  background: var(--color-primary-dim);
  border-radius: 4px;
}
</style>
