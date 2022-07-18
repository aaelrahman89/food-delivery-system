<template>
  <v-radio-group
    :value="value"
    :items="items"
    class="radio-group"
    row
    hide-details
    @change="$emit('input', $event)"
  >
    <v-radio
      v-for="item in items"
      :key="item.value"
      :label="$t(item.string)"
      :value="item.value"
      :color="color"
      :disabled="disabled"
      class="radio-button"
    ></v-radio>
  </v-radio-group>
</template>

<script>
export default {
  name: 'VgRadioButtons',
  props: {
    color: {
      type: String,
      default: 'secondary',
    },
    items: {
      type: Array,
      default: undefined,
      required: true,
    },
    value: {
      type: String,
      default: undefined,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.radio-button {
  margin-inline-end: var(--inset-mid);
}
</style>
