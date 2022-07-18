<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <div v-on="on">
        <slot name="activator-button"></slot>
      </div>
    </template>
    <v-list class="menu__actions-list">
      <template v-for="(status, index) in statuses">
        <v-list-item :key="index" @click="onStatusSelected(status)">
          <v-list-item-title>
            <vg-flex justify-content="space-between" gap-size="mid">
              <div>{{ $t(status) }}</div>
            </vg-flex>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { VgFlex } from '@survv/commons/components/VgFlex';

export default Vue.extend({
  name: 'B2CStatusMenu',
  components: { VgFlex },
  props: {
    statuses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onStatusSelected(status: BranchB2CStatus): void {
      this.$emit('select:status', status);
    },
  },
});
</script>

<style scoped></style>
