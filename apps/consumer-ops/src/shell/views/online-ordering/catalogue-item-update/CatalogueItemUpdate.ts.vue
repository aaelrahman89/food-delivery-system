<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <catalogue-item-form
      :pm="pm"
      @submit="submit"
      @discard="goToCatalogueItemDetails"
    ></catalogue-item-form>
  </vg-content>
</template>

<script lang="ts">
import CatalogueItemForm from '../catalogue-item-form/CatalogueItemForm.ts.vue';
import Vue from 'vue';
import { CatalogueItemUpdatePM } from '../../../../core/presentation-models/online-ordering/CatalogueItemUpdatePM';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../repositories/online-ordering/CataloguesRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { TagsSelectionPM } from '../../../../core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTagsRepoImpl } from '../../../repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CatalogueItemUpdate',
  components: {
    CatalogueItemForm,
    VgContent,
  },
  data() {
    return {
      pm: new CatalogueItemUpdatePM({
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        notificationService,
        vendorId: Number(this.$route.params.vendorId),
        catalogueId: Number(this.$route.params.catalogueId),
        itemId: Number(this.$route.params.itemId),
        children: {
          tagsSelectionPM: new TagsSelectionPM({
            unifiedTagsRepo: new UnifiedTagsRepoImpl(),
            notificationService,
            vendorType: new VendorType(
              this.$route.params.vendorType.toUpperCase()
            ),
          }),
        },
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
          text: this.pm.vendorName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUES',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.catalogueDisplayName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUE_ITEMS',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.itemDisplayName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_UPDATE,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUE_ITEM_UPDATE',
        },
      ];
    },
  },
  created(): Promise<void> {
    return this.pm.init();
  },
  methods: {
    async submit(): Promise<void> {
      if (await this.pm.submit()) {
        await this.goToCatalogueItemDetails();
      }
    },
    async goToCatalogueItemDetails(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: { ...this.$route.params },
      });
    },
  },
});
</script>

<style scoped></style>
