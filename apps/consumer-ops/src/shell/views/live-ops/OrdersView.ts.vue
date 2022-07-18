<template>
  <vg-content
    :pm="{ onViewDestroyed: () => {} }"
    :title="$t('LIVE_OPS_ORDERS')"
  >
    <v-switch
      v-model="overviewMode"
      :label="currentModeLabel"
      @change="toggleMode"
    />
    <router-view />
  </vg-content>
</template>

<script lang="ts">
import Vue from 'vue';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { VgContent } from '@survv/commons/components/VgContent';

export default Vue.extend({
  name: 'OrdersView',
  components: { VgContent },
  data() {
    return {
      overviewMode: this.$route.name != ROUTE_NAMES.LIVE_OPS_ORDERS_LISTING,
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.LIVE_OPS_ORDERS,
          routeParams: { ...this.$route.params },
          text: 'LIVE_OPS_ORDERS',
        },
      ];
    },
    currentModeLabel(): string {
      if (this.overviewMode) return this.$t('LIVE_OPS_ORDERS_OVERVIEW_MODE');
      return this.$t('LIVE_OPS_ORDERS_LISTING_MODE');
    },
  },
  methods: {
    async toggleMode(val: boolean): Promise<void> {
      if (val) {
        this.overviewMode = val;
        await this.$router.push({
          name: ROUTE_NAMES.LIVE_OPS_ORDERS_OVERVIEW,
        });
      } else {
        this.overviewMode = val;
        await this.$router.push({
          name: ROUTE_NAMES.LIVE_OPS_ORDERS_LISTING,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
