<template>
  <vg-map-layout>
    <template #map>
      <branch-served-zones></branch-served-zones>
    </template>
    <template #side-pane>
      <v-tabs
        background-color="vg-darkgrey"
        height="48px"
        slider-color="vg-lightgrey"
        dark
        grow
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.to.name"
          :to="tab.to"
          exact
          exact-active-class=""
        >
          {{ $t(tab.to.name) }}
        </v-tab>
      </v-tabs>
      <router-view class="hc-tab-content"> </router-view>
    </template>
  </vg-map-layout>
</template>

<script>
import BranchServedZones from './BranchServedZones.ts.vue';
import VgMapLayout from '../../components/deprecated/VgLayout/VgMapLayout.vue';
import { images } from '../../../core/deprecated/constants';

export default {
  name: 'HomeContainer',
  components: { BranchServedZones, VgMapLayout },
  data() {
    return {
      IMAGES: images,
      tabs: [
        {
          to: { name: 'routes.home.pilots' },
        },
        {
          to: { name: 'routes.home.pending_orders' },
        },
        {
          to: { name: 'routes.home.scheduled_orders' },
        },
        {
          to: { name: 'routes.home.working_orders' },
        },
      ],
    };
  },
};
</script>

<style>
.coming-soon .v-image__image.v-image__image--cover {
  background-size: contain;
}

.hc-tab-content {
  height: calc(100% - 48px);
  overflow: auto;
  border-left: 1px solid lightgrey;
}

html[dir='rtl'] .hc-tab-content {
  border-left: initial;
  border-right: 1px solid lightgrey;
}

.hc-tab-content.hc-no-title {
  height: 100%;
}
</style>
