<template>
  <v-btn
    class="vg-button"
    :outlined="outlined"
    :icon="icon"
    :color="color"
    :large="large"
    :small="small"
    :disabled="disabled"
    :dark="dark"
    :type="type"
    :text="flat"
    :to="to"
    :block="expand"
    :loading="loading"
    active-class="{}"
    @click="click"
  >
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  click: 'click',
};

export default Vue.extend({
  name: 'VgButton',
  props: {
    outlined: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'button',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Object,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click(): void {
      this.$emit(events.click);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-button {
  text-transform: none;
  margin: 0;
  border-radius: 4px;
  font-size: 16px;
}
</style>
