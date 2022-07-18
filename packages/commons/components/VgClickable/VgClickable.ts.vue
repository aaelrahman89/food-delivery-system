<template>
  <div>
    <router-link v-if="route" :to="route">
      <div class="vg-clickable" :class="computedClass">
        <div class="vg-clickable__label">
          {{ label }}
        </div>
        <vg-svg
          :src="SVG_GLOBAL_ARROW_RIGHT"
          fill="var(--color-primary)"
          width="24px"
          height="16px"
        ></vg-svg>
      </div>
    </router-link>
    <div v-if="onClick" @click.stop="onClick">
      <div class="vg-clickable" :class="computedClass">
        <div class="vg-clickable__label">
          {{ label }}
        </div>
        <vg-svg
          :src="SVG_GLOBAL_ARROW_RIGHT"
          :class="{ flip: $rtl }"
          fill="var(--color-primary)"
          width="24px"
          height="16px"
        ></vg-svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SVG_GLOBAL_ARROW_RIGHT } from '@survv/assets';
import { VgSvg } from '../VgSvg';

export default Vue.extend({
  name: 'VgClickable',
  components: {
    VgSvg,
  },
  props: {
    label: {
      type: [String, Number, Boolean, Object],
      required: true,
      default: undefined,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    route: {
      type: Object,
      default: undefined,
    },
    onClick: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      SVG_GLOBAL_ARROW_RIGHT,
    };
  },
  computed: {
    computedClass(): Record<string, boolean> {
      return {
        'vg-clickable--dense': this.dense,
        'vg-clickable--dark': this.dark,
      };
    },
  },
});
</script>

<style scoped lang="scss">
.vg-clickable {
  $pair: &;
  padding: var(--inset-tiny);
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  background-color: var(--color-surface-light);
  border: 1px dashed var(--color-primary);
  border-radius: 4px;

  &--dense {
    padding: var(--inset-small);
  }

  &--dark {
    background-color: var(--color-surface-dark);
  }

  &__label {
    color: #2b2b2b;
    margin-inline-end: var(--inset-mid);

    white-space: nowrap;
    display: block;
    min-width: 60px;

    font-size: 14px;
    line-height: 18px;
    text-align: start;
  }
}
.flip {
  transform: scaleX(-1);
}
</style>
