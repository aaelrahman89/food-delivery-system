<template>
  <h1 class="vg-content__title">{{ $t(computedTitle) }}</h1>
</template>

<script>
export default {
  name: 'VgContentTitle',
  props: {
    title: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    computedTitle() {
      return this.title || this.$route.name;
    },
  },
};
</script>

<style scoped lang="scss">
.vg-content__title {
  font-size: 32px;
  font-weight: 500;
}
</style>
