<template>
  <v-checkbox
    ref="checkbox"
    :off-icon="$vuetify.icons.radioOff"
    :on-icon="$vuetify.icons.radioOn"
    :input-value="value"
    :hide-details="hideDetails"
    :label="label"
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
  name: 'VgRadio',
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
  },
  mounted(): void {
    const inputElement = (this.$refs.checkbox as Vue).$refs
      .input as HTMLInputElement;
    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('role', 'radio');
  },
  methods: {
    onChange(value: boolean): void {
      this.$emit(events.input, value);
    },
  },
});
</script>

<style scoped lang="scss"></style>
