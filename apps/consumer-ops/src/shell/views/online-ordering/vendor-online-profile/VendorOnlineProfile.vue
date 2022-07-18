<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <div class="profile-container">
      <vg-cover v-if="pm.initialized">
        <template>
          <img :src="pm.vendorOnlineProfile.logo" alt="vendor-logo" />
        </template>
        <template #content>
          <div class="vendor-online-profile-container">
            <section class="vendor-online-profile-container__section">
              <vendor-online-profile-header
                :vendor="pm.vendorOnlineProfile"
                @setVendorStacking="pm.openStackingConfigurationBottomSheet()"
                @disableVendorStacking="pm.disableVendorStacking()"
              ></vendor-online-profile-header>
            </section>
            <section class="vendor-online-profile-container__section">
              <vendor-online-profile-settings
                :vendor="pm.vendorOnlineProfile"
              ></vendor-online-profile-settings>
            </section>
            <section class="vendor-online-profile-container__section">
              <vendor-online-profile-description
                :vendor="pm.vendorOnlineProfile"
              ></vendor-online-profile-description>
            </section>
            <section class="vendor-online-profile-container__section">
              <vendor-online-profile-tags
                :vendor="pm.vendorOnlineProfile"
              ></vendor-online-profile-tags>
            </section>
            <section
              class="
                vendor-online-profile-container__section
                vg-border
                vg-padding--small
              "
            >
              <vg-gallery
                :cover="pm.vendorOnlineProfile.cover"
                :gallery="pm.vendorOnlineProfile.gallery"
              >
              </vg-gallery>
            </section>
          </div>
        </template>
      </vg-cover>

      <vendor-online-profile-catalogues
        :catalogues="pm.vendorOnlineProfile.catalogues"
      ></vendor-online-profile-catalogues>
      <vg-panel collapsible :title="usersTableTitle">
        <vendor-online-profile-contacts-table
          :items="pm.vendorOnlineProfile.contactPeople"
          :total-items-count="pm.vendorOnlineProfile.contactPeople.length"
        >
        </vendor-online-profile-contacts-table>
      </vg-panel>
      <branch-listing-table :show-actions="shouldShowBranchActions" />
    </div>
    <stacking-configuration-bottom-sheet
      :open="pm.shouldShowStackingConfigurationBottomSheet"
      :average-preparation-time="pm.vendorOnlineProfile.averagePreparationTime"
      :max-stacked-orders.sync="pm.stackingConfigurationForm.maxStackedOrders"
      :stacking-window-in-minutes.sync="
        pm.stackingConfigurationForm.stackingWindowInMinutes
      "
      :validators="pm.stackingConfigurationForm.validators"
      :can-submit="pm.stackingConfigurationForm.submittable"
      @backdrop="pm.closeStackingConfigurationBottomSheet()"
      @discard="pm.closeStackingConfigurationBottomSheet()"
      @submit="submit"
    ></stacking-configuration-bottom-sheet>
  </vg-content>
</template>

<script>
import BranchListingTable from '../../restaurants/branches/list/BranchListingTable.ts.vue';
import StackingConfigurationBottomSheet from '../vendor-online-profile-form/StackingConfigurationBottomSheet.ts.vue';
import VendorOnlineProfileCatalogues from './VendorOnlineProfileCatalogues.vue';
import VendorOnlineProfileContactsTable from './VendorOnlineProfileContactsTable.vue';
import VendorOnlineProfileDescription from './VendorOnlineProfileDescription.vue';
import VendorOnlineProfileHeader from './VendorOnlineProfileHeader.vue';
import VendorOnlineProfileSettings from './VendorOnlineProfileSettings.vue';
import VendorOnlineProfileTags from './VendorOnlineProfileTags.vue';
import { OrderingSystem } from '../../../../core/models/OrderingSystem';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VendorOnlineProfilePM } from '../../../../core/presentation-models/online-ordering/VendorOnlineProfilePM';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgCover } from '@survv/commons/components/VgCover';
import { VgGallery } from '@survv/commons/components/VgGallery';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'VendorOnlineProfile',
  components: {
    StackingConfigurationBottomSheet,
    VendorOnlineProfileContactsTable,
    VendorOnlineProfileCatalogues,
    VendorOnlineProfileDescription,
    VendorOnlineProfileHeader,
    VendorOnlineProfileSettings,
    VendorOnlineProfileTags,
    BranchListingTable,
    VgContent,
    VgCover,
    VgGallery,
    VgPanel,
  },
  data() {
    return {
      pm: new VendorOnlineProfilePM({
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        vendorId: Number(this.$route.params.vendorId),
        notificationService,
      }),
    };
  },
  computed: {
    breadcrumbs() {
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
          text: this.$t(this.pm.vendorOnlineProfile?.name),
        },
      ];
    },
    usersTableTitle() {
      return this.pm.vendorOnlineProfile.orderingSystem.equals(
        OrderingSystem.CALL_CENTER_DASHBOARD
      )
        ? this.$t('VENDOR_ONLINE_PROFILE_VENDOR_ADMINS')
        : this.$t('VENDOR_ONLINE_PROFILE_CONTACTS');
    },
    shouldShowBranchActions() {
      return !OrderingSystem.CALL_CENTER_DASHBOARD.equals(
        this.pm.vendorOnlineProfile.orderingSystem
      );
    },
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    async submit() {
      if (await this.pm.stackingConfigurationForm.submit()) {
        this.pm.closeStackingConfigurationBottomSheet();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.profile-container {
  display: grid;
  row-gap: var(--inset-large);
}

.vendor-online-profile-container {
  display: grid;
  row-gap: var(--inset-mid);
}
</style>
