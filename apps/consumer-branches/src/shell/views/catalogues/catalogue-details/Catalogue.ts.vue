<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-grid class="catalogue">
      <vg-grid
        class="catalogue__details vg-border"
        :class="{ disabled: pm.disableCatalogueProfile }"
      >
        <div class="catalogue__details__header">
          <vg-bilingual-string
            class="catalogue__details__header__title"
            tag="h1"
            :value="pm.catalogue.displayName"
          ></vg-bilingual-string>
        </div>
        <div class="catalogue__details__attributes">
          <vg-flex gap-size="small">
            <vg-pair
              dense
              :label="$t('CATALOGUE_ORDERING_HOURS')"
              :value="$t(pm.catalogue.orderingHours)"
            ></vg-pair>
          </vg-flex>
        </div>
        <div class="catalogue__details__description">
          <vg-panel collapsible :title="$t('CATALOGUE_DESCRIPTION')">
            {{ $t(pm.catalogue.description) }}
          </vg-panel>
        </div>
      </vg-grid>
      <vg-grid class="catalogue__sections vg-border">
        <catalogue-sections-view-mode
          :catalogue-sections="pm.catalogue.catalogueSections"
          :selected-catalogue-section="pm.selectedCatalogueSection"
          @select:catalogue-section="pm.selectCatalogueSection($event)"
          @set-available:item="pm.setItemAvailable($event)"
          @set-unavailable:item="pm.setItemUnavailable($event)"
        >
        </catalogue-sections-view-mode>
      </vg-grid>
    </vg-grid>
  </vg-content>
</template>

<script lang="ts">
import CatalogueSectionsViewMode from './CatalogueSectionsViewMode.ts.vue';
import Vue from 'vue';
import { CatalogueDetailsPM } from '../../../../core/presentation-models/catalogues/CatalogueDetailsPM';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../repositories/catalogues/CataloguesRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { routeNames } from '../../../../core/routes/routeNames';

export default Vue.extend({
  name: 'Catalogue',
  components: {
    VgBilingualString,
    VgPair,
    VgPanel,
    VgGrid,
    VgFlex,
    CatalogueSectionsViewMode,
    VgContent,
  },
  data() {
    return {
      pm: new CatalogueDetailsPM({
        notificationService,
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: Number(this.$route.params.catalogueId),
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: routeNames.CATALOGUES_LIST,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUES_LIST',
        },
        {
          routeName: routeNames.CATALOGUES_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.catalogue.displayName,
        },
      ];
    },
  },
  created(): Promise<void> {
    return this.pm.init();
  },
});
</script>

<style scoped lang="scss">
.catalogue {
  &__details {
    padding: var(--inset-mid);
    &__header {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      &__title {
        font-weight: 500;
        font-size: var(--font-size-large);
      }
    }
  }
  &__sections {
    padding: var(--inset-mid);
  }
}
</style>
