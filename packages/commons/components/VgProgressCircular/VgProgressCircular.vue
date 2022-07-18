<template>
  <v-progress-circular
    :indeterminate="indeterminate"
    :size="size"
    :value="value"
    :width="width"
    color="primary"
  >
    <slot></slot>
  </v-progress-circular>
</template>

<script>
import { VProgressCircular } from 'vuetify/lib/components/VProgressCircular';

export default {
  name: 'VgProgressCircular',
  components: {
    VProgressCircular,
  },
  props: {
    indeterminate: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: 32,
    },
    value: {
      type: [String, Number],
      default: 0,
    },
    width: {
      type: [String, Number],
      default: 4,
    },
  },
};
</script>

<style scoped></style>
