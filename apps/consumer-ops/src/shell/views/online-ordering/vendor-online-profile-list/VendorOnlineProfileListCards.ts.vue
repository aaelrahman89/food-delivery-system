<template>
  <div class="vendor-profile-list-cards-container">
    <template v-if="shouldRender">
      <router-link
        v-for="vendorProfile in list.items"
        :key="vendorProfile.vendorId"
        :to="getVendorProfileRoute(vendorProfile)"
        class="vendor-profile-list-card"
      >
        <div class="vendor-profile-list-card__logo">
          <img :src="vendorProfile.logo" alt="vendor-profile-logo" />
        </div>
        <div class="vendor-profile-list-card__body">
          <div class="vendor-profile-list-card__body__title">
            <div>
              <div>{{ vendorProfile.name.en }}</div>
              <div>{{ vendorProfile.name.ar }}</div>
            </div>
            <v-chip
              v-if="vendorProfile.active"
              text-color="white"
              color="green"
              label
              small
              >{{ $t('ENABLED') }}</v-chip
            >
            <v-chip v-else text-color="white" color="red" label small>{{
              $t('DISABLED')
            }}</v-chip>
          </div>
          <div class="vendor-profile-list-card__body__count">
            <div>
              {{
                $t('VENDOR_ONLINE_PROFILE_LIST_CARD_CATALOGUE_COUNT', {
                  count: vendorProfile.cataloguesCount,
                })
              }}
            </div>
            <div class="vendor-profile-list-card__body__count__branches">
              {{
                $t('VENDOR_ONLINE_PROFILE_LIST_CARD_BRANCHES_COUNT', {
                  count: vendorProfile.branchesCount,
                })
              }}
            </div>
            <div v-if="vendorProfile.posIntegrated">
              <v-chip outlined label color="primary">
                {{ $t(vendorProfile.posIntegrationType) }}
              </v-chip>
            </div>
          </div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Location } from 'vue-router';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import {
  VendorOnlineProfileList,
  VendorOnlineProfileListItem,
  VendorPosIntegrationType,
} from '../../../../core/models/VendorOnlineProfile';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export default Vue.extend({
  name: 'VendorOnlineProfileListCards',
  props: {
    list: {
      type: VendorOnlineProfileList,
      default: undefined,
    },
  },
  computed: {
    shouldRender(): boolean {
      return isNotEmpty(this.list?.items);
    },
  },
  methods: {
    VendorPosIntegrationType,
    getVendorProfileRoute(
      vendorProfile: VendorOnlineProfileListItem
    ): Location {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
        params: {
          ...this.$route.params,
          vendorId: String(vendorProfile.vendorId),
        },
      };
    },
  },
});
</script>

<style scoped lang="scss">
.vendor-profile-list-cards-container {
  display: grid;
  grid-gap: var(--inset-mid);
  grid-template-columns: repeat(auto-fill, 370px);
}
.vendor-profile-list-card {
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  padding: var(--inset-small);
  display: grid;
  grid-gap: var(--inset-small);
  grid-template-columns: 68px 1fr;
  cursor: pointer;
  color: initial;

  &__logo {
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    width: 68px;
    height: 68px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    &__title {
      font-weight: 400;
      font-size: var(--inset-mid);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    &__count {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.56);
      gap: var(--inset-mid);
    }
  }
}
</style>
