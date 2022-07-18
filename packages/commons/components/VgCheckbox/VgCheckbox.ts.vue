<template>
  <v-checkbox
    :input-value="value"
    :hide-details="hideDetails"
    :label="label"
    :disabled="disabled"
    color="primary"
    @change="onChange"
  ></v-checkbox>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  input: 'input',
};

export default Vue.extend({
  name: 'VgCheckbox',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: undefined,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onChange(value: boolean): void {
      this.$emit(events.input, value);
    },
  },
});
</script>

<style scoped lang="scss"></style>
