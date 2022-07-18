<template>
  <vg-content :pm="pm" :title="title">
    <div class="vendor-online-profile-list">
      <vg-flex gap-size="mid">
        <div class="vendor-online-profile-list__actions__create-vendor">
          <vg-button outlined @click="goToVendorOnlineProfileCreation">{{
            $t('VENDOR_ONLINE_PROFILE_LIST_CREATE_VENDOR_PROFILE')
          }}</vg-button>
        </div>
        <div class="vendor-online-profile-list__actions__manage-hash-tags">
          <vg-button outlined :to="manageHashTagsRoute"
            >{{ $t('VENDOR_ONLINE_PROFILE_LIST_MANAGE_HASH_TAGS') }}
          </vg-button>
        </div>
      </vg-flex>
      <vendor-online-profile-list-filter
        :filter="pm.query.filter"
        :catalogue-status-options="pm.catalogueStatusOptions"
        @update:filter="pm.onFilterUpdate($event)"
      >
      </vendor-online-profile-list-filter>
      <vendor-online-profile-list-cards
        :list="pm.list"
      ></vendor-online-profile-list-cards>
    </div>
  </vg-content>
</template>

<script lang="ts">
import VendorOnlineProfileListCards from './VendorOnlineProfileListCards.ts.vue';
import VendorOnlineProfileListFilter from './VendorOnlineProfileListFilter.ts.vue';
import Vue from 'vue';
import { Location } from 'vue-router';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VendorOnlineProfileListPM } from '../../../../core/presentation-models/online-ordering/VendorOnlineProfileListPM';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOpsProfileListPM } from '../../../../core/presentation-models/online-ordering/VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'VendorOnlineProfileList',
  components: {
    VendorOnlineProfileListFilter,
    VendorOnlineProfileListCards,
    VgContent,
    VgButton,
    VgFlex,
  },
  data() {
    return {
      pm: new VendorOnlineProfileListPM({
        vendorType: new VendorType(this.$route.params.vendorType.toUpperCase()),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        notificationService,
        query: this.$parseJSONQuery(this.$route.query.q as string),
        children: {
          vendorOpsProfileListPM: new VendorOpsProfileListPM({
            notificationService,
            vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
            vendorType: new VendorType(
              this.$route.params.vendorType.toUpperCase()
            ),
          }),
        },
      }),
    };
  },
  computed: {
    title(): string {
      return `NAV_VENDOR_ONLINE_PROFILE_${this.$route.params.vendorType}`.toUpperCase();
    },
    manageHashTagsRoute(): Location {
      return {
        name: 'routes.online_ordering.application.hash-tags',
        params: {
          vendorType: this.$route.params.vendorType,
        },
      };
    },
  },
  watch: {
    '$route.params.vendorType': function reInit(): Promise<void> {
      return this.init();
    },
  },
  created(): Promise<void> {
    return this.init();
  },
  methods: {
    async goToVendorOnlineProfileCreation(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_CREATION,
        params: { ...this.$route.params },
      });
    },
    async init(): Promise<void> {
      this.pm = new VendorOnlineProfileListPM({
        vendorType: new VendorType(this.$route.params.vendorType.toUpperCase()),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        notificationService,
        query: this.$parseJSONQuery(this.$route.query.q as string),
        children: {
          vendorOpsProfileListPM: new VendorOpsProfileListPM({
            notificationService,
            vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
            vendorType: new VendorType(
              this.$route.params.vendorType.toUpperCase()
            ),
          }),
        },
      });
      return this.pm.init();
    },
  },
});
</script>

<style scoped lang="scss">
.vendor-online-profile-list {
  display: grid;
  grid-gap: var(--inset-large);
}
.vendor-online-profile-list__actions__create-vendor {
  margin-inline-end: var(--inset-mid);
}
</style>
