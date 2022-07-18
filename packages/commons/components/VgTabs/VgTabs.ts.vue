<template>
  <div class="vg-border">
    <div class="tabs-container">
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="route"
        class="vg-no-underline router-link"
      >
        <vg-flex
          class="tab vg-padding-block-start--mid vg-padding-block-end--mid"
          :class="{ active: isCurrentRouter(route) }"
          flex-grow="1"
          justify-content="center"
        >
          {{ route.title ? route.title : $t(route.name) }}
        </vg-flex>
      </router-link>
    </div>
    <div class="vg-padding--large"><router-view /></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Location } from 'vue-router';
import { VgFlex } from '../VgFlex';

export default Vue.extend({
  name: 'VgTabs',
  components: { VgFlex },
  props: {
    routes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async changeRoute(route: Location): Promise<void> {
      if (this.$router.currentRoute.name != route.name)
        await this.$router.push(route);
    },
    isCurrentRouter(route: Location): boolean {
      return this.$route.name == route.name;
    },
  },
});
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  padding: 0;
}
.router-link {
  width: 100%;
}
.tab {
  background: #f2f2f2;
  color: rgba(0, 0, 0, 0.56);
  text-transform: uppercase;
  border-bottom: 4px solid transparent;
  cursor: pointer;
}
.active {
  background: #f2dcdc;
  color: #f74046;
  border-bottom: 4px solid #f74046;
  box-sizing: border-box;
  font-weight: bold;
}
</style>
