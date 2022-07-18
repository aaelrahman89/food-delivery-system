<template v-if="shouldRender">
  <v-row>
    <v-col v-if="inputLanguage.en">
      {{ description.en }}
    </v-col>
    <v-col v-if="inputLanguage.ar" tag="bdi">
      {{ description.ar }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemDescription',
  props: {
    description: {
      type: Object,
      default: undefined,
    },
    inputLanguage: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    shouldRender() {
      return this.description && this.inputLanguage;
    },
  },
};
</script>

<style scoped></style>
