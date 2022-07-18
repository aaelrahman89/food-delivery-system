<template>
  <div class="pair-card" :style="style" :class="computedClass">
    <div class="pair-card__label">
      {{ label }}
    </div>
    <bdi class="pair-card__value">
      <slot name="value">
        {{ value }}
      </slot>
    </bdi>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PairCard',
  props: {
    label: {
      type: [String, Number, Boolean, Object],
      required: true,
      default: undefined,
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: undefined,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: 'fit-content',
    },
    dense: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style(): Record<string, string> {
      return {
        maxWidth: this.maxWidth,
      };
    },
    computedClass(): Record<string, boolean> {
      return {
        'vg-pair--dense': this.dense,
        'vg-pair--column': this.column,
        'vg-pair--dark': this.dark,
      };
    },
  },
});
</script>

<style scoped lang="scss">
.pair-card {
  $pair: &;
  padding: var(--inset-mid);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  min-width: 240px;
  height: fit-content;

  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  &--dense {
    padding: var(--inset-small);
  }

  &--dark {
    background-color: var(--color-surface-dark);
  }

  &--column {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    #{$pair}__label,
    #{$pair}__value {
      white-space: nowrap;
    }

    #{$pair}__value {
      margin-top: var(--inset-small);
      text-align: start;
    }
  }

  &__label {
    margin-inline-end: var(--inset-mid);
    margin-bottom: var(--inset-small);
    white-space: normal;
    display: block;

    color: var(--color-primary);
    font-size: 14px;
    line-height: 18px;
    text-align: start;
  }

  &__value {
    color: var(--color-on-surface-high-emphasis);
    font-size: 14px;
    line-height: 18px;
    text-align: start;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    &__value {
      margin-top: var(--inset-mid);
      text-align: start;
    }
  }
}
</style>
