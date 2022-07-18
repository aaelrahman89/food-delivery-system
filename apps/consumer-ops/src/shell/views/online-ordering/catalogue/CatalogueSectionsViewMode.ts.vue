<template>
  <vg-grid>
    <vg-flex gap-size="small" justify-content="flex-end">
      <div>
        <vg-button
          :to="editModeRoute"
          large
          outlined
          @click="updateCatalogueSections"
        >
          {{ $t('CATALOGUE_SECTIONS_UPDATE_ITEMS') }}
        </vg-button>
      </div>
    </vg-flex>
    <div>
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
            :title="`${$t(selectedCatalogueSection.displayName)} ${
              selectedCatalogueSection.taxTier.id !== 0
                ? `- ${$t(selectedCatalogueSection.taxTier.displayName)} (${$t(
                    selectedCatalogueSection.taxTier.percentage
                  )})`
                : ''
            }`"
            dark
            title-size="large"
          >
            <vg-grid>
              <router-link
                v-for="item in selectedCatalogueSection.items"
                :key="item.id"
                :to="getItemRoute(item)"
                class="vg-link-container"
              >
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
                      <vg-bilingual-string
                        :value="item.displayName"
                      ></vg-bilingual-string>
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
              </router-link>
            </vg-grid>
          </vg-panel>
        </div>
      </div>
    </div>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  CatalogueSection,
  CatalogueSectionItem,
} from '../../../../core/models/Catalogue';
import { Location } from 'vue-router';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgCover } from '@survv/commons/components/VgCover';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  updateCatalogueSections: 'update-catalogue-sections',
  selectCatalogueSection: 'select:catalogue-section',
};

export default Vue.extend({
  name: 'CatalogueSectionsViewMode',
  components: {
    VgButton,
    VgGrid,
    VgPanel,
    VgCover,
    VgBilingualString,
    VgFlex,
    VgPair,
    VgChip,
    VgImg,
  },
  props: {
    editModeRoute: {
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
  },
  methods: {
    updateCatalogueSections(): void {
      this.$emit(events.updateCatalogueSections);
    },
    selectCatalogueSection(section: CatalogueSection): void {
      this.$emit(events.selectCatalogueSection, section);
    },
    isActiveSection(section: CatalogueSection): boolean {
      return section.id === this.selectedCatalogueSection?.id;
    },
    getItemRoute(item: CatalogueSectionItem): Location {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: {
          ...this.$route.params,
          itemId: String(item.id),
        },
      };
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
