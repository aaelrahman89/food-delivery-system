<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <slot name="activator-button" v-on="on"></slot>
    </template>
    <v-list class="menu__actions-list">
      <template v-for="(zone, index) in zones">
        <v-list-item :key="index" @click="onZoneSelected(zone)">
          <v-list-item-title>
            <vg-flex justify-content="space-between" gap-size="mid">
              <div>{{ $t(zone.name) }}</div>
              <div
                class="color-code vg-margin-inline-start--mid"
                :style="zoneColorCodeStyle(zone.rateName)"
              ></div>
            </vg-flex>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { Zone } from '../../core/models/Zone';
import { zoneRateColor } from './zones/ZoneRateColor';

export default Vue.extend({
  name: 'ServedZonesMenu',
  components: { VgFlex },
  props: {
    zones: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onZoneSelected(zone: Zone): void {
      this.$emit('select:zone', zone.name);
    },
    zoneColorCodeStyle(rateName: string): Record<string, string> {
      return {
        backgroundColor: zoneRateColor(rateName),
      };
    },
  },
});
</script>

<style scoped>
.color-code {
  width: 24px;
  height: 24px;
  background: #51c9ff;
  display: inline-block;
  border-radius: 50%;
}
</style>
