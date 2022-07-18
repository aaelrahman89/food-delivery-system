<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="8">
          <v-row class="mb-3">
            <v-col>
              <item-title :input-language="inputLanguage" :title="item.title" />
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col>
              <item-description
                :input-language="inputLanguage"
                :description="item.description"
              ></item-description>
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col>
              <item-categories
                :input-language="inputLanguage"
                :categories="item.categories"
              />
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col>
              <item-tags
                :input-language="inputLanguage"
                :tags="item.tags"
              ></item-tags>
            </v-col>
          </v-row>
          <v-row class="vg-text-nowrap">
            <v-col cols="auto">
              <item-price :price="item.price"></item-price>
            </v-col>
            <v-col cols="auto">
              <item-calories :calories="item.calories"></item-calories>
            </v-col>
            <v-col cols="auto">
              <item-preparation-time
                :prep-time="item.prepTime"
              ></item-preparation-time>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <item-cover-photos
            :cover-photos="item.coverPhotos"
          ></item-cover-photos>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ItemCalories from './ItemCalories.vue';
import ItemCategories from './ItemCategories.vue';
import ItemCoverPhotos from './ItemCoverPhotos.vue';
import ItemDescription from './ItemDescription.vue';
import ItemPreparationTime from './ItemPreparationTime.vue';
import ItemPrice from './ItemPrice.vue';
import ItemTags from './ItemTags.vue';
import ItemTitle from './ItemTitle.vue';

export default {
  name: 'ItemDetailsCard',
  components: {
    ItemPreparationTime,
    ItemCalories,
    ItemCoverPhotos,
    ItemPrice,
    ItemTags,
    ItemCategories,
    ItemDescription,
    ItemTitle,
  },
  props: {
    item: {
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
