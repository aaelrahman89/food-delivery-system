<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vendor-online-profile-form
      :pm="pm"
      @submit="submit"
      @discard="goToVendorOnlineProfilesList"
    ></vendor-online-profile-form>
  </vg-content>
</template>

<script lang="ts">
import VendorOnlineProfileForm from '../vendor-online-profile-form/VendorOnlineProfileForm.ts.vue';
import Vue from 'vue';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { TagsSelectionPM } from '../../../../core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTagsRepoImpl } from '../../../repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileCreationPM } from '../../../../core/presentation-models/online-ordering/VendorOnlineProfileCreationPM';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOpsProfileListPM } from '../../../../core/presentation-models/online-ordering/VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'VendorOnlineProfileCreation',
  components: {
    VgContent,
    VendorOnlineProfileForm,
  },
  data() {
    return {
      pm: new VendorOnlineProfileCreationPM({
        vendorType: new VendorType(this.$route.params.vendorType.toUpperCase()),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        notificationService,
        children: {
          tagsSelectionPM: new TagsSelectionPM({
            unifiedTagsRepo: new UnifiedTagsRepoImpl(),
            notificationService,
            vendorType: new VendorType(
              this.$route.params.vendorType.toUpperCase()
            ),
          }),
          vendorOpsProfileListPM: new VendorOpsProfileListPM({
            vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
            notificationService,
            vendorType: new VendorType(
              this.$route.params.vendorType.toUpperCase()
            ),
          }),
        },
      }),
      notificationService,
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
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_CREATION,
          routeParams: { ...this.$route.params },
          text: 'NAV_VENDOR_ONLINE_PROFILE_CREATION',
        },
      ];
    },
  },
  watch: {
    'pm.vendor': async function VendorWatcher(vendor): Promise<void> {
      await this.$router.push({
        query: { vendorId: vendor.id, vendorName: vendor.name },
      });
    },
  },
  methods: {
    async submit(): Promise<void> {
      if (await this.pm.submit()) {
        await this.goToVendorOnlineProfilesList();
      }
    },

    async goToVendorOnlineProfilesList(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
        params: { ...this.$route.params },
      });
    },
  },
});
</script>
<style scoped></style>
