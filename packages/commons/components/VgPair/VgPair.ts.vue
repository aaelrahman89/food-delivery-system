<template>
  <div
    class="vg-pair"
    :style="style"
    :class="computedClass"
    :title="`${label}  ${value}`"
  >
    <div class="vg-pair__label">
      {{ label }}
    </div>
    <bdi class="vg-pair__value">
      <slot name="value">
        {{ value }}
      </slot>
    </bdi>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VgPair',
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
      default: '',
    },
    dense: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: undefined,
    },
    fontColor: {
      type: String,
      default: undefined,
    },
    borderColor: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    style(): Record<string, string> {
      return {
        maxWidth: this.maxWidth,
        backgroundColor: this.backgroundColor,
        color: this.fontColor,
        borderColor: this.borderColor,
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
.vg-pair {
  $pair: &;
  padding: var(--inset-mid);
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

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

    white-space: nowrap;
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
    text-align: end;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
