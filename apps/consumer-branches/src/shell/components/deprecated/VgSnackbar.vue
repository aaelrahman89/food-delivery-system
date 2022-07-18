<template>
  <v-snackbar
    top
    :value="enable"
    :timeout="6000"
    :color="type"
    :vertical="vertical"
    :multi-line="multiLine"
    :left="$data.$rtl"
    :right="!$data.$rtl"
    @input="$emit('hide', $event)"
  >
    <slot />
  </v-snackbar>
</template>

<script>
export default {
  name: 'VgSnackbar',
  props: {
    type: {
      type: String,
      default: '',
    },
    enable: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
