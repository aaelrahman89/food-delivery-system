<template>
  <img :src="src" :height="height" @error.prevent="onError" />
</template>

<script>
export default {
  name: 'VgLogo',
  props: {
    src: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '48px',
    },
  },
  methods: {
    onError(event) {
      this.$emit('error', event);
    },
  },
};
</script>
