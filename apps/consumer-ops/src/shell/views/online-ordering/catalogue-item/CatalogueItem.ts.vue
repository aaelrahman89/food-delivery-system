<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs" class="catalogue-item">
    <vg-grid gap-size="large">
      <catalogue-item-details
        :item="pm.item"
        :class="{ disabled: pm.shouldDisableItemDetails }"
      ></catalogue-item-details>
      <catalogue-item-options-view-mode
        v-if="pm.shouldShowOptionsView"
        :options="pm.item.options"
        @switch:options-update="pm.switchToOptionsUpdateMode()"
      ></catalogue-item-options-view-mode>
      <catalogue-item-options-update-mode
        v-if="pm.shouldShowOptionsUpdate"
        :options="pm.item.options"
        @switch:options-view="pm.switchToOptionsViewMode()"
        @delete:option="pm.deleteOption($event)"
      ></catalogue-item-options-update-mode>
    </vg-grid>
  </vg-content>
</template>

<script lang="ts">
import CatalogueItemDetails from './CatalogueItemDetails.ts.vue';
import CatalogueItemOptionsUpdateMode from './CatalogueItemOptionsUpdateMode.ts.vue';
import CatalogueItemOptionsViewMode from './CatalogueItemOptionsViewMode.ts.vue';
import Vue from 'vue';
import { CatalogueItemPM } from '../../../../core/presentation-models/online-ordering/CatalogueItemPM';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../repositories/online-ordering/CataloguesRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CatalogueItem',
  components: {
    CatalogueItemDetails,
    CatalogueItemOptionsViewMode,
    CatalogueItemOptionsUpdateMode,
    VgContent,
    VgGrid,
  },
  data() {
    return {
      pm: new CatalogueItemPM({
        catalogueId: Number(this.$route.params.catalogueId),
        itemId: Number(this.$route.params.itemId),
        vendorId: Number(this.$route.params.vendorId),
        notificationService,
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        cataloguesRepo: new CataloguesRepoImpl(),
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          routeParams: { ...this.$route.params },
          text: `NAV_VENDOR_ONLINE_PROFILE_${this.$route.params.vendorType}`.toUpperCase(),
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          routeParams: { ...this.$route.params },
          text: 'NAV_VENDOR_ONLINE_PROFILE_LIST',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: this.pm.vendorProfile.name,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUES',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.catalogue.displayName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUE_ITEMS',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.item.displayName,
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
});
</script>

<style scoped></style>
