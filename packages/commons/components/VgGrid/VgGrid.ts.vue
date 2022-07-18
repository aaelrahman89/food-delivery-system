<template>
  <div class="vg-grid" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VgGrid',
  props: {
    noWrap: {
      type: Boolean,
      default: false,
    },
    gapSize: {
      type: String,
      default: 'mid',
    },
    justifyContent: {
      type: String,
      default: 'initial',
    },
    alignItems: {
      type: String,
      default: 'initial',
    },
    columns: {
      type: String,
      default: 'initial',
    },
  },
  computed: {
    style(): Record<string, string> {
      return {
        '--grid-gap-size':
          this.gapSize === '0' ? '0' : `var(--inset-${this.gapSize})`,
        'justify-content': this.justifyContent,
        'flex-wrap': this.noWrap ? 'initial' : 'wrap',
        'align-items': this.alignItems,
        'grid-template-columns': this.columns,
      };
    },
  },
});
</script>

<style scoped>
.vg-grid {
  display: grid;
  --grid-gap-size: var(--inset-mid);
  grid-gap: var(--grid-gap-size);
}
</style>
