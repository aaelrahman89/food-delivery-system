<template>
  <vg-bottom-sheet-list
    searchable
    :open="open"
    :item-groups="itemGroups"
    :search-label="$t('AVAILABLE_CATALOGUE_ITEMS_BOTTOM_SHEET_SEARCH_LABEL')"
    @search="searchItems"
    @backdrop="emitBackdrop"
    @click:item="emitClickedItem"
  >
    <template #header>{{
      $t('AVAILABLE_CATALOGUE_ITEMS_BOTTOM_SHEET_HEADER')
    }}</template>
    <template #item="{ item }">
      <vg-flex
        align-items="stretch"
        gap-size="mid"
        no-wrap
        class="catalogue-item"
      >
        <div class="vg-border catalogue-item__cover-photo">
          <vg-img
            :src="item.value.coverPhoto"
            alt="Item cover photo"
            width="60px"
            height="60px"
            border-radius="4px"
          ></vg-img>
        </div>

        <div class="vg-text--ellipsis catalogue-item__text">
          <div class="vg-text--bold">
            {{ $t(item.value.displayName) }}
          </div>
          <div class="vg-text-emphasis--low vg-text--ellipsis">
            {{ $t(item.value.description) }}
          </div>
        </div>
        <div class="vg-text-primary vg-text--mid catalogue-item__price">
          {{ item.value.price.toString() }}
          {{ $t(item.value.price.currency) }}
        </div>
      </vg-flex>
    </template>
  </vg-bottom-sheet-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { CatalogueItemsListItem } from '../../../../core/models/CatalogueItem';
import { PropValidator } from 'vue/types/options';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImg } from '@survv/commons/components/VgImg';

const events = {
  backdrop: 'backdrop',
  clickItem: 'click:item',
  search: 'search',
};

export default Vue.extend({
  name: 'OrderAvailableCatalogueItemsBottomSheet',
  components: {
    VgBottomSheetList,
    VgFlex,
    VgImg,
  },
  props: {
    items: {
      type: Array,
      required: true,
    } as PropValidator<CatalogueItemsListItem[]>,
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    itemGroups(): BottomSheetListGroup<CatalogueItemsListItem>[] {
      return [
        {
          items: this.items.map((item) => ({
            id: item.id,
            icon: item.coverPhoto,
            label: item.displayName,
            value: item,
          })),
        },
      ];
    },
  },
  methods: {
    searchItems(value: string): void {
      this.$emit(events.search, value);
    },
    emitClickedItem(value: CatalogueItemsListItem): void {
      this.$emit(events.clickItem, value);
    },
    emitBackdrop(): void {
      this.$emit(events.backdrop);
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue-item {
  width: 100%;
  &__text {
    flex: 1 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  &__price {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
}
</style>
