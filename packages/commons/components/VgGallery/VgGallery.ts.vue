<template>
  <div>
    <vg-flex class="vg-gallery" gap-size="small">
      <template v-if="empty">
        <div class="vg-gallery--empty">
          {{ $t('GALLERY_EMPTY_PLACEHOLDER') }}
        </div>
      </template>
      <template v-else>
        <template v-for="(image, index) in computedGallery">
          <vg-img
            v-show="isDisplayedImage(index)"
            :key="image"
            :src="image"
            alt="gallery-image"
            :width="imageSize + 'px'"
            :height="imageSize + 'px'"
            border-radius="4px"
            class="vg-gallery__image vg-border vg-clickable"
            @click.native="showInImageViewer(image)"
          >
            <div
              v-if="shouldDisplayCoverIcon(image)"
              class="vg-gallery__image--cover"
            >
              <vg-svg
                :src="SVG_ICON_GALLERY_COVER"
                fill="var(--color-primary)"
              ></vg-svg>
            </div>
          </vg-img>
        </template>
        <button
          v-if="overflow"
          type="button"
          class="
            vg-gallery__overflow-button
            vg-border
            vg-surface--dark
            vg-text--mid
          "
          :class="overflowButtonClass"
          @click="toggleShowMore()"
        >
          {{ overflowButtonLabel }}
        </button>
      </template>
    </vg-flex>
    <vg-image-viewer ref="imageViewer" :src="selectedImage"></vg-image-viewer>
  </div>
</template>

<script lang="ts">
import ResizeObserver from 'resize-observer-polyfill';
import Vue from 'vue';
import { SVG_ICON_GALLERY_COVER } from '@survv/assets';
import { VgFlex } from '../VgFlex/index';
import { VgImageViewer } from '../VgImageViewer';
import { VgImg } from '../VgImg/index';
import { VgSvg } from '../VgSvg/index';

export default Vue.extend({
  name: 'VgGallery',
  components: {
    VgImg,
    VgFlex,
    VgSvg,
    VgImageViewer,
  },
  props: {
    gallery: {
      type: Array,
      default(): string[] {
        return [];
      },
    },
    imageSize: {
      type: String,
      default: '120',
    },
    cover: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      containerWidth: 0,
      containerPadding: 8,
      resizeObserver: new ResizeObserver(() => true),
      showMore: false,
      SVG_ICON_GALLERY_COVER,
      selectedImage: '',
    };
  },
  computed: {
    computedGallery(): string[] {
      if (this.cover) {
        return [this.cover, ...(this.gallery as string[])];
      }
      return this.gallery as string[];
    },
    empty(): boolean {
      return this.computedGallery.length === 0;
    },
    overflowLimit(): number {
      return (
        Math.floor(
          this.containerWidth / (Number(this.imageSize) + this.containerPadding)
        ) - 1
      );
    },
    overflowButtonClass(): Record<string, boolean> {
      return {
        'vg-gallery__overflow-button--collapse': this.showMore,
      };
    },
    overflowButtonLabel(): string {
      return this.showMore
        ? this.$t('GALLERY_SHOW_LESS')
        : this.$t('GALLERY_SHOW_MORE');
    },
    overflow(): boolean {
      return this.computedGallery.length > this.overflowLimit;
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => this.updateContainerWidth());
    this.updateContainerWidth();

    this.resizeObserver.observe(this.$el);
  },
  destroyed() {
    this.resizeObserver.disconnect();
  },
  methods: {
    toggleShowMore(): void {
      this.showMore = !this.showMore;
    },
    updateContainerWidth(): void {
      this.containerWidth = (this.$el as HTMLElement).clientWidth;
    },
    isDisplayedImage(imageIndex: number): boolean {
      return this.showMore || imageIndex < this.overflowLimit;
    },
    shouldDisplayCoverIcon(image: string): boolean {
      return this.cover == image;
    },
    showInImageViewer(image: string): void {
      this.selectedImage = image;
      this.$refs.imageViewer.open();
    },
  },
});
</script>

<style scoped lang="scss">
.vg-gallery {
  &__image {
    position: relative;
    &--cover {
      background-color: white;
      width: 30px;
      height: 30px;
      border-radius: 12px;
      position: absolute;
      bottom: var(--inset-small);
      left: var(--inset-small);
      padding: var(--inset-tiny);
    }
  }

  &__overflow-button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    height: 120px;
    color: var(--color-on-surface-mid-emphasis);
    &--collapse {
      flex-grow: 0;
      width: 120px;
    }
  }
  &--empty {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
