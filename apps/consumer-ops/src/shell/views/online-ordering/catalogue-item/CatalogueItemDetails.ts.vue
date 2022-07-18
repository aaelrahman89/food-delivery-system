<template>
  <vg-grid class="vg-border vg-padding--mid">
    <vg-flex justify-content="space-between">
      <vg-bilingual-string
        tag="h1"
        :value="item.displayName"
      ></vg-bilingual-string>
      <div>
        <vg-button color="primary" outlined :to="itemUpdateRoute">
          {{ $t('CATALOGUE_ITEM_UPDATE_INFO') }}
        </vg-button>
      </div>
    </vg-flex>
    <vg-flex gap-size="mid">
      <vg-pair
        dense
        :label="$t('CATALOGUE_ITEM_MINIMUM_PRICE')"
        :value="$t(item.price)"
      ></vg-pair>
      <vg-pair
        dense
        :label="$t('CATALOGUE_ITEM_PREPERATION_TIME')"
        :value="$t(item.prepTime)"
      ></vg-pair>
      <vg-pair
        dense
        :label="$t('CATALOGUE_ITEM_CALORIES')"
        :value="$t(item.calories)"
      ></vg-pair>
      <vg-pair
        dense
        :label="$t('CATALOGUE_ITEM_POPULAR')"
        :value="$t(item.popular.toString())"
      ></vg-pair>
    </vg-flex>
    <vg-panel collapsible :title="$t('CATALOGUE_ITEM_DESCRIPTION')">
      {{ $t(item.description) }}
    </vg-panel>
    <vg-panel collapsible :title="$t('CATALOGUE_ITEM_TAGS')">
      <vg-flex gap-size="small">
        <vg-chip v-for="tag in item.tags" :key="tag.id" :img="tag.icon">
          {{ $t(tag.name) }}
        </vg-chip>
      </vg-flex>
    </vg-panel>
    <vg-panel collapsible :title="$t('CATALOGUE_ITEM_ALLERGIES')">
      <vg-flex gap-size="small">
        <vg-chip
          v-for="allergy in item.allergies"
          :key="allergy.id"
          :img="allergy.icon"
        >
          {{ $t(allergy.name) }}
        </vg-chip>
      </vg-flex>
    </vg-panel>
    <vg-panel collapsible :title="$t('CATALOGUE_ITEM_SECTIONS')">
      <vg-flex gap-size="small">
        <vg-chip v-for="section in item.catalogueSections" :key="section.id">
          {{ $t(section.displayName) }}
        </vg-chip>
      </vg-flex>
    </vg-panel>
    <vg-gallery :cover="item.coverPhoto" :gallery="item.gallery"></vg-gallery>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueItem } from '../../../../core/models/CatalogueItem';
import { Location } from 'vue-router';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGallery } from '@survv/commons/components/VgGallery';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default Vue.extend({
  name: 'CatalogueItemDetails',
  components: {
    VgButton,
    VgGrid,
    VgPair,
    VgBilingualString,
    VgFlex,
    VgPanel,
    VgGallery,
    VgChip,
  },
  props: {
    item: {
      type: CatalogueItem,
      required: true,
    },
  },
  computed: {
    itemUpdateRoute(): Location {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_UPDATE,
        params: { ...this.$route.params },
      };
    },
  },
});
</script>

<style scoped></style>
