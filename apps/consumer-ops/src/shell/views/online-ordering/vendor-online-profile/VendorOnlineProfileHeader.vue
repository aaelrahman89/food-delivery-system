<template>
  <div class="profile-header">
    <vg-bilingual-string tag="h1" :value="vendor.name"></vg-bilingual-string>
    <vg-action-menu
      :actions="generateActions()"
      color="primary"
      outlined
    ></vg-action-menu>
  </div>
</template>

<script lang="ts">
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VendorOnlineProfile } from '../../../../core/models/VendorOnlineProfile';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';

const events = {
  setVendorStacking: 'setVendorStacking',
  disableVendorStacking: 'disableVendorStacking',
};
export default {
  name: 'VendorOnlineProfileHeader',
  components: { VgBilingualString, VgActionMenu },
  props: {
    vendor: {
      type: VendorOnlineProfile,
      default: undefined,
    },
  },
  data() {
    return {
      vendorProfileUpdateRoute: {
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_UPDATE,
        params: {
          ...this.$route.params,
        },
      },
    };
  },
  methods: {
    generateActions() {
      return [
        {
          name: this.$t('VENDOR_ONLINE_PROFILE_SET_VENDOR_STACKING'),
          onClick: (): void => {
            this.$emit(events.setVendorStacking);
          },
        },
        {
          name: this.$t('VENDOR_ONLINE_PROFILE_DISABLE_VENDOR_STACKING'),
          onClick: (): void => {
            this.$emit(events.disableVendorStacking);
          },
        },
        {
          name: this.$t('VENDOR_ONLINE_PROFILE_UPDATE_PROFILE'),
          route: {
            name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_UPDATE,
            params: {
              ...this.$route.params,
            },
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
