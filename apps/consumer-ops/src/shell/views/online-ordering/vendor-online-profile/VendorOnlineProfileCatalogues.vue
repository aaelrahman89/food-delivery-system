<template>
  <vg-panel collapsible :title="$t('CATALOGUES')">
    <vg-flex gap-size="small" align-items="center">
      <router-link
        v-for="catalogue in catalogues"
        :key="catalogue.id"
        :to="getCatalogueRoute(catalogue)"
        class=""
      >
        <vg-pair
          dense
          :label="$t(catalogue.displayName)"
          :value="$t(catalogue.status)"
        ></vg-pair>
      </router-link>
      <div>
        <vg-button outlined icon @click="goToCatalogueCreation">
          <svg viewBox="0 0 448 448" class="add-button__icon">
            <path
              d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
            />
          </svg>
        </vg-button>
      </div>
    </vg-flex>
  </vg-panel>
</template>

<script>
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default {
  name: 'VendorOnlineProfileCatalogues',
  components: { VgPair, VgPanel, VgButton, VgFlex },
  props: {
    catalogues: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  methods: {
    goToCatalogueCreation() {
      this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_CREATION,
        params: { ...this.$route.params },
      });
    },
    getCatalogueRoute(catalogue) {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
        params: { ...this.$route.params, catalogueId: catalogue.id },
      };
    },
  },
};
</script>

<style scoped>
.add-button__icon {
  width: 14px;
  height: 14px;
  fill: var(--color-primary);
}
</style>
