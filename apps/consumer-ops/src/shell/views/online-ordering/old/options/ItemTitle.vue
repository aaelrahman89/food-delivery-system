<template>
  <h2>
    <bdi>
      <template v-if="inputLanguage.en">
        {{ title.en }}
      </template>
      <template v-if="inputLanguage.en && inputLanguage.ar"> - </template>
      <template v-if="inputLanguage.ar">
        {{ title.ar }}
      </template>
    </bdi>
  </h2>
</template>
<script>
export default {
  name: 'VgItemTitle',
  props: {
    title: {
      type: Object,
      default: undefined,
      required: true,
    },
    inputLanguage: {
      type: Object,
      default: undefined,
      required: true,
    },
  },
};
</script>
