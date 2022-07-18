<template>
  <component
    :is="overlay"
    :presistent="persistent"
    :visible="open"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <slot></slot>
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </component>
</template>

<script lang="ts">
import VgBottomSheet from './VgBottomSheet.ts.vue';
import Vue, { VueConstructor } from 'vue';

const overlayTypes: Record<string, VueConstructor> = {
  'bottom-sheet': VgBottomSheet,
};

const events = {
  open: 'open',
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'VgOverlay',
  props: {
    type: {
      type: String,
      default: undefined,
      required: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    overlay(): VueConstructor {
      return overlayTypes[this.type];
    },
  },
  watch: {
    open(value): void {
      this.$emit(events.open, value);
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
  },
});
</script>

<style scoped></style>
