<template>
  <v-row align="start">
    <v-col tag="h4" class="shrink"> {{ $t('catalogues.items.price') }}: </v-col>
    <v-col v-if="price" class="shrink">
      {{ price.string }} {{ $t(price.currency.string) }}
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ItemPrice',
  props: {
    price: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
