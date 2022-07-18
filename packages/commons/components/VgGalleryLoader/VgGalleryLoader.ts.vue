<template>
  <vg-file-loader
    :accept="accept"
    multiple
    @load="updateGallery($event)"
    @error="handleLoadError"
  >
    <template #activator="{ activate }">
      <div class="vg-gallery-loader">
        <div class="vg-gallery-loader__title">
          {{ $t('GALLERY') }}
        </div>
        <div v-if="fallback" class="vg-gallery-loader__fallback">
          {{ $t('EMPTY_GALLERY') }}
        </div>
        <div v-else class="vg-gallery-loader__uploaded-images">
          <div
            v-for="img in gallery"
            :key="img.valueOf()"
            class="vg-gallery-loader__uploaded-images__img"
          >
            <img :src="img.valueOf()" width="100%" height="100%" />
            <div class="vg-gallery-loader__uploaded-images--overlay"></div>
            <div class="vg-clickable" @click="removeImage(img)">
              <svg
                class="vg-gallery-loader__uploaded-images__remove-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#f44336"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                />
                <path
                  fill="#fff"
                  d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                />
                <path
                  fill="#fff"
                  d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                />
              </svg>
            </div>
            <div
              class="
                vg-gallery-loader__uploaded-images__set-default-bg
                vg-clickable
              "
              :class="{ 'cover-photo': isCoverPhoto(img) }"
              @click="toggleCoverPhoto(img)"
            >
              <svg
                class="vg-gallery-loader__uploaded-images__set-default-icon"
                :class="{ 'cover-photo': isCoverPhoto(img) }"
                viewBox="0 -10 511.99143 511"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="vg-gallery-loader__activator">
          <vg-button outlined @click="activate">{{
            $t('ADD_PHOTOS')
          }}</vg-button>
        </div>
      </div>
    </template>
  </vg-file-loader>
</template>

<script lang="ts">
import Vue from 'vue';
import { Base64EncodedFile } from '../../core/models/Files';
import { ImageUrlString } from '../../core/models/Images';
import { VgButton } from '../VgButton';
import { VgFileLoader } from '../VgFileLoader';

const events = {
  updateGallery: 'update:gallery',
  remove: 'remove',
  error: 'error',
  updateCoverPhoto: 'update:cover-photo',
};

type GalleryImage = Base64EncodedFile | ImageUrlString;
export default Vue.extend({
  name: 'VgGalleryLoader',
  components: { VgButton, VgFileLoader },
  props: {
    accept: {
      type: String,
      default: 'image/jpeg,image/png,.jpeg,.jpg,.png',
    },
    gallery: {
      type: Array,
      default(): GalleryImage[] {
        return [];
      },
    },
    coverPhoto: {
      type: [Base64EncodedFile, String],
      default: '',
    },
  },

  computed: {
    fallback(): boolean {
      return (this.gallery as GalleryImage[]).length == 0;
    },
  },
  methods: {
    updateGallery(images: GalleryImage[]): void {
      this.$emit(events.updateGallery, [...this.gallery, ...images]);
    },

    removeImage(image: Base64EncodedFile | string): void {
      if (this.coverPhoto.valueOf() == image.valueOf()) {
        this.toggleCoverPhoto(image);
      }
      this.$emit(
        events.updateGallery,
        this.gallery.filter(
          (galleryImage: Base64EncodedFile | string) =>
            galleryImage.valueOf() != image.valueOf()
        )
      );
    },

    isCoverPhoto(image: Base64EncodedFile | string): boolean {
      return this.coverPhoto.valueOf() == image.valueOf();
    },

    async toggleCoverPhoto(image: Base64EncodedFile | string): void {
      let payload;
      if (this.isCoverPhoto(image)) {
        payload = '';
      } else {
        payload = image;
      }
      this.$emit(events.updateCoverPhoto, payload);
    },

    handleLoadError(err: Error): void {
      this.$emit(events.error, err);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-gallery-loader {
  width: 100%;
  padding: var(--inset-mid);
  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  display: grid;
  row-gap: var(--inset-mid);

  .vg-gallery-loader__activator {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border-top: 1px dashed var(--color-border-light);
    padding-top: var(--inset-mid);
  }

  .vg-gallery-loader__fallback {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    background-color: #f2f2f2;
    color: rgba(0, 0, 0, 0.56);
  }

  .vg-gallery-loader__uploaded-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    column-gap: var(--inset-mid);
    row-gap: var(--inset-mid);

    .vg-gallery-loader__uploaded-images__img {
      position: relative;
      width: 120px;
      height: 120px;

      img {
        border-radius: 4px;
        object-fit: cover;
      }

      .vg-gallery-loader__uploaded-images--overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        display: block;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 4px;
      }
      .vg-gallery-loader__uploaded-images__remove-icon {
        width: 24px;
        height: 24px;
        position: absolute;
        top: var(--inset-small);
        right: var(--inset-small);
      }

      .vg-gallery-loader__uploaded-images__set-default-bg {
        background-color: white;
        width: 30px;
        height: 30px;
        border-radius: 12px;
        position: absolute;
        bottom: var(--inset-small);
        left: var(--inset-small);
        padding: var(--inset-tiny);
        opacity: 0.5;

        .vg-gallery-loader__uploaded-images__set-default-icon {
          width: 20px;
          height: 20px;
          fill: #888888;
          fill-opacity: 0.5;
        }

        .vg-gallery-loader__uploaded-images__set-default-icon.cover-photo {
          fill: #e83744;
          fill-opacity: 1;
        }
      }
      .vg-gallery-loader__uploaded-images__set-default-bg.cover-photo {
        opacity: 1;
      }
    }
  }
}
</style>
