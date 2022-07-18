<template>
  <v-row>
    <v-col class="vg-text-nowrap shrink" tag="h4">
      {{ $t('catalogues.items.categories.$self') }}:
    </v-col>
    <v-col class="grow">
      <v-row align="start" justify="start">
        <v-col
          v-for="category in categories"
          :key="category.categoryId"
          class="shrink pa-1"
        >
          <v-chip color="secondary" outlined>
            <bdi>
              <template v-if="inputLanguage.en">
                {{ category.title.en }}
              </template>
              <template v-if="inputLanguage.en && inputLanguage.ar">
                -
              </template>
              <template v-if="inputLanguage.ar">
                {{ category.title.ar }}
              </template>
            </bdi>
          </v-chip>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ItemCategories',
  props: {
    categories: {
      type: Array,
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
