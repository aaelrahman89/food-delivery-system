<template>
  <vg-file-loader :accept="accept" @load="updateImage" @error="handleLoadError">
    <template #activator="{ activate }">
      <div :style="containerStyle" class="vg-image-loader" @click="activate">
        <template v-if="fallback">
          <div class="vg-image-loader__fallback">
            <img :src="imageLoaderIcon.url" alt="icon" />
          </div>
        </template>
        <template v-else>
          <img
            :src="renderedImage"
            :style="imgStyle"
            alt="icon"
            @error="handleViewImgError"
          />
        </template>
      </div>
    </template>
  </vg-file-loader>
</template>

<script lang="ts">
import Vue from 'vue';
import { Base64EncodedFile } from '../../core/models/Files';
import { IMAGE_IMAGE_LOADER } from '@survv/assets';
import { VgFileLoader } from '../VgFileLoader';
import { isObject } from '../../core/utils/checks';

const events = {
  updateImage: 'update:image',
  error: 'error',
};

export default Vue.extend({
  name: 'VgImageLoader',
  components: { VgFileLoader },
  props: {
    accept: {
      type: String,
      default: 'image/jpeg,image/png,.jpeg,.jpg,.png',
    },
    image: {
      type: [String, Base64EncodedFile],
      default: undefined,
    },
    radius: {
      type: String,
      default: undefined,
    },
    width: {
      type: String,
      default: undefined,
    },
    height: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      imageLoaderIcon: IMAGE_IMAGE_LOADER,
      renderFallback: false,
    };
  },
  computed: {
    imgStyle(): Record<string, string> {
      return {
        borderRadius: `${this.radius}px`,
      };
    },
    containerStyle(): Record<string, string> {
      const style: Record<string, string> = {};
      if (this.radius) {
        style.borderRadius = `${this.radius}px`;
      }
      if (this.width) {
        style.width = `${this.width}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
    renderedImage(): string {
      if (isObject(this.image)) {
        return (this.image as Base64EncodedFile).valueOf();
      }
      return this.image as string;
    },
    fallback(): boolean {
      return !this.renderedImage || this.renderFallback;
    },
  },
  methods: {
    updateImage(image: Base64EncodedFile): void {
      this.renderFallback = false;
      this.$emit(events.updateImage, image);
    },
    handleLoadError(err: Error): void {
      this.$emit(events.error, err);
    },
    handleViewImgError(): void {
      this.renderFallback = true;
    },
  },
});
</script>

<style scoped lang="scss">
.vg-image-loader {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid #d7d7d7;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  &__fallback {
    background-color: var(--color-surface-light);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      border-radius: 0;
    }
  }
}
</style>
