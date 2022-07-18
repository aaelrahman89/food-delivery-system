<template>
  <v-row align="start">
    <v-col class="vg-text-nowrap shrink" tag="h4">
      {{ $t('catalogues.tags.$self') }}:
    </v-col>
    <v-col class="grow">
      <v-row align="start" justify="start">
        <v-col v-for="tag in tags" :key="tag.tagId" class="shrink pa-1">
          <v-chip outlined color="primary">
            <bdi>
              <template v-if="inputLanguage.en">
                {{ tag.title.en }}
              </template>
              <template v-if="inputLanguage.en && inputLanguage.ar">
                -
              </template>
              <template v-if="inputLanguage.ar">
                {{ tag.title.ar }}
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
  name: 'ItemTags',
  props: {
    tags: {
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
