<template>
  <div class="vg-img" :style="vgImgContainerStyle">
    <div
      v-if="shouldSetFallback"
      class="vg-img__fallback-img"
      :style="imgStyle"
    >
      <vg-svg
        :src="SVG_IMAGE_NOT_FOUND"
        min-width="24px"
        min-height="24px"
        max-width="56px"
        max-height="56px"
        width="50%"
        height="50%"
        fill=" #b9b9b9"
      ></vg-svg>
    </div>
    <img
      v-else
      :src="internalSrc"
      :style="imgStyle"
      :alt="alt"
      class="vg-img__img"
      loading="lazy"
      @error="onImageError"
    />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Base64EncodedFile } from '../../core/models/Files';
import { SVG_IMAGE_NOT_FOUND } from '@survv/assets';
import { VgSvg } from '../VgSvg/index';
import { isObject } from '../../core/utils/checks';

const events = {
  error: 'error',
};

type ImageSource = Base64EncodedFile | { url: string } | string;

export default Vue.extend({
  name: 'VgImg',
  components: {
    VgSvg,
  },
  props: {
    src: {
      type: [String, Object, Base64EncodedFile],
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    objectFit: {
      type: String,
      default: 'cover',
    },
    borderRadius: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      shouldSetFallback: false,
      SVG_IMAGE_NOT_FOUND,
    };
  },
  computed: {
    vgImgContainerStyle(): Record<string, string> {
      return {
        width: this.width,
        height: this.height,
      };
    },
    imgStyle(): Record<string, string> {
      return {
        'object-fit': this.objectFit,
        'border-radius': this.borderRadius,
      };
    },
    internalSrc(): string {
      const src = this.src as ImageSource;
      if (src instanceof Base64EncodedFile) return src.dataUrl;
      if (isObject(src)) return src.url;
      return src;
    },
  },
  watch: {
    internalSrc(): void {
      this.shouldSetFallback = false;
    },
  },
  created(): void {
    if (!this.internalSrc) {
      this.setFallback();
    }
  },
  methods: {
    onImageError(err: ErrorEvent): void {
      this.setFallback();
      this.$emit(events.error, err);
    },
    setFallback(): void {
      this.shouldSetFallback = true;
    },
  },
});
</script>

<style scoped>
.vg-img__img {
  width: 100%;
  height: 100%;
}
.vg-img__fallback-img {
  width: 100%;
  height: 100%;
  background-color: var(--color-surface-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
