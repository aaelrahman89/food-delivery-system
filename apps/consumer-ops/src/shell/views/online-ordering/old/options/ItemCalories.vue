<template>
  <v-row align="start">
    <v-col tag="h4" class="shrink">
      {{ $t('catalogues.items.calories') }}:
    </v-col>
    <v-col class="shrink"> {{ calories }} </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemCalories',
  props: {
    calories: {
      type: Number,
      default: undefined,
    },
  },
};
</script>

<style scoped></style>
