<template>
  <div ref="container" class="container">
    <v-carousel
      v-if="coverPhotos.length"
      hide-delimiters
      height="100%"
      class="elevation-0"
    >
      <v-carousel-item
        v-for="(photo, index) in coverPhotos"
        :key="index"
        :src="photo.url"
      ></v-carousel-item>
    </v-carousel>
    <div v-else class="image-container">
      <img :src="IMAGES.NOT_AVAILABLE" loading="lazy" />
    </div>
  </div>
</template>

<script>
import { IMAGES } from '../../../../../core/constants';

export default {
  name: 'ItemCoverPhotos',
  props: {
    coverPhotos: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      IMAGES,
      style: {},
    };
  },
  mounted() {
    this.style = {
      maxHeight: `${this.$refs.container.offsetHeight}px`,
      height: `${this.$refs.container.offsetHeight}px`,
      width: `${Math.floor((this.$refs.container.offsetHeight * 3) / 2)}px`,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 300px;
  max-height: 400px;
  height: 100%;
  padding: 0;
  border: 1px solid lightgray;
}
.image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.image-container img {
  object-fit: contain;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
