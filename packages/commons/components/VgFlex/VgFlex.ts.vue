<template>
  <div class="vg-flex" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VgFlex',
  props: {
    noWrap: {
      type: Boolean,
      default: false,
    },
    gapSize: {
      type: String,
      default: '0',
    },
    justifyContent: {
      type: String,
      default: undefined,
    },
    alignItems: {
      type: String,
      default: undefined,
    },
    flexGrow: {
      type: String,
      default: '1',
    },
    flexDirection: {
      type: String,
      default: 'row',
    },
  },
  computed: {
    style(): Record<string, string> {
      return {
        '--flex-gap-size':
          this.gapSize == '0' ? '0' : `var(--inset-${this.gapSize})`,
        'justify-content': this.justifyContent,
        'flex-wrap': this.noWrap ? 'initial' : 'wrap',
        'align-items': this.alignItems,
        'flex-grow': this.flexGrow,
        'flex-direction': this.flexDirection,
      };
    },
  },
});
</script>

<style scoped>
.vg-flex {
  display: flex;
  --flex-gap-size: 0;
  margin-inline-start: calc(-1 * var(--flex-gap-size));
  margin-block-start: calc(-1 * var(--flex-gap-size));
}

.vg-flex > * {
  margin-inline-start: var(--flex-gap-size);
  margin-block-start: var(--flex-gap-size);
}
</style>
