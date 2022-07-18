<template>
  <v-switch
    :input-value="value"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :false-value="false"
    :true-value="true"
    @change="$emit('input', $event)"
  ></v-switch>
</template>

<script>
export default {
  name: 'VgSwitch',
  props: {
    color: {
      type: String,
      default: 'secondary',
    },
    value: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
