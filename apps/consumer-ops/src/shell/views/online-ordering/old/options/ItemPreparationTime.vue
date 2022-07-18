<template>
  <v-row align="start">
    <v-col tag="h4" class="shrink">
      {{ $t('catalogues.items.prep_time') }}:
    </v-col>
    <v-col v-if="prepTime" class="shrink">
      {{ prepTime.humanize() }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemPreparationTime',
  props: {
    prepTime: {
      type: Object,
      default: undefined,
    },
  },
};
</script>

<style scoped></style>
