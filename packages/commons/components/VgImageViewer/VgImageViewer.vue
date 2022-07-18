<template>
  <div class="image-container">
    <div v-if="showThumb" class="thumb" @click="open()">
      <img :src="src" />
    </div>
    <div v-if="inPreview" class="overlay">
      <div class="content">
        <img
          :src="src"
          :style="{ transform: `rotate(${rotation}deg) scale(${zoom})` }"
          class="preview"
        />
      </div>

      <div class="close" @click="close()">
        <svg
          width="14px"
          height="14px"
          viewBox="0 0 14 14"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="receipts"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <path
              id="Mask"
              d="M12.8925,0.3025 L12.8925,0.3025 C12.5025,-0.0875 11.8725,-0.0875 11.4825,0.3025 L6.5925,5.1825 L1.7025,0.2925 C1.3125,-0.0975 0.6825,-0.0975 0.2925,0.2925 L0.2925,0.2925 C-0.0975,0.6825 -0.0975,1.3125 0.2925,1.7025 L5.1825,6.5925 L0.2925,11.4825 C-0.0975,11.8725 -0.0975,12.5025 0.2925,12.8925 L0.2925,12.8925 C0.6825,13.2825 1.3125,13.2825 1.7025,12.8925 L6.5925,8.0025 L11.4825,12.8925 C11.8725,13.2825 12.5025,13.2825 12.8925,12.8925 L12.8925,12.8925 C13.2825,12.5025 13.2825,11.8725 12.8925,11.4825 L8.0025,6.5925 L12.8925,1.7025 C13.2725,1.3225 13.2725,0.6825 12.8925,0.3025 Z"
              fill="#E83744"
              fill-rule="nonzero"
            ></path>
          </g>
        </svg>
      </div>

      <div class="controller">
        <div class="zoom group">
          <div class="i-button" @click="onRotateLeft()">
            <svg
              width="16px"
              height="19px"
              viewBox="0 0 16 19"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="receipts"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  id="Mask"
                  d="M3.11,7.53 L1.7,6.11 C0.8,7.27 0.24,8.61 0.07,10 L2.09,10 C2.23,9.13 2.58,8.28 3.11,7.53 L3.11,7.53 Z M2.09,12 L0.07,12 C0.24,13.39 0.79,14.73 1.69,15.89 L3.1,14.47 C2.58,13.72 2.23,12.88 2.09,12 L2.09,12 Z M3.1,17.32 C4.26,18.22 5.61,18.76 7,18.93 L7,16.9 C6.13,16.75 5.29,16.41 4.54,15.87 L3.1,17.32 L3.1,17.32 Z M9,3.07 L9,0 L4.45,4.55 L9,9 L9,5.09 C11.84,5.57 14,8.03 14,11 C14,13.97 11.84,16.43 9,16.91 L9,18.93 C12.95,18.44 16,15.08 16,11 C16,6.92 12.95,3.56 9,3.07 L9,3.07 Z"
                  fill="#E83744"
                ></path>
              </g>
            </svg>
          </div>
          <div class="i-button" @click="onRotateRight()">
            <svg
              width="16px"
              height="19px"
              viewBox="0 0 16 19"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="receipts"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  id="Mask"
                  d="M11.55,4.55 L7,0 L7,3.07 C3.06,3.56 0,6.92 0,11 C0,15.08 3.05,18.44 7,18.93 L7,16.91 C4.16,16.43 2,13.97 2,11 C2,8.03 4.16,5.57 7,5.09 L7,9 L11.55,4.55 L11.55,4.55 Z M15.93,10 C15.76,8.61 15.21,7.27 14.31,6.11 L12.89,7.53 C13.43,8.28 13.77,9.13 13.91,10 L15.93,10 L15.93,10 Z M9,16.9 L9,18.92 C10.39,18.75 11.74,18.21 12.9,17.31 L11.46,15.87 C10.71,16.41 9.87,16.76 9,16.9 L9,16.9 Z M12.89,14.48 L14.31,15.89 C15.21,14.73 15.76,13.39 15.93,12 L13.91,12 C13.77,12.87 13.43,13.72 12.89,14.48 L12.89,14.48 Z"
                  fill="#E83744"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <div class="rotate group">
          <div class="i-button" @click="onZoomIn()">
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 18 18"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="receipts"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  id="Mask"
                  d="M12.5,11 L11.71,11 L11.43,10.73 C12.41,9.59 13,8.11 13,6.5 C13,2.91 10.09,0 6.5,0 C2.91,0 0,2.91 0,6.5 C0,10.09 2.91,13 6.5,13 C8.11,13 9.59,12.41 10.73,11.43 L11,11.71 L11,12.5 L16,17.49 L17.49,16 L12.5,11 L12.5,11 Z M6.5,2 C8.99,2 11,4.01 11,6.5 C11,8.99 8.99,11 6.5,11 C4.01,11 2,8.99 2,6.5 C2,4.01 4.01,2 6.5,2 Z M7,4 L6,4 L6,6 L4,6 L4,7 L6,7 L6,9 L7,9 L7,7 L9,7 L9,6 L7,6 L7,4 Z"
                  fill="#E83744"
                ></path>
              </g>
            </svg>
          </div>
          <div class="i-button" @click="onZoomOut()">
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 18 18"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="receipts"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <path
                  id="Mask"
                  d="M12.5,11 L11.71,11 L11.43,10.73 C12.41,9.59 13,8.11 13,6.5 C13,2.91 10.09,0 6.5,0 C2.91,0 0,2.91 0,6.5 C0,10.09 2.91,13 6.5,13 C8.11,13 9.59,12.41 10.73,11.43 L11,11.71 L11,12.5 L16,17.49 L17.49,16 L12.5,11 L12.5,11 Z M6.5,11 C4.01,11 2,8.99 2,6.5 C2,4.01 4.01,2 6.5,2 C8.99,2 11,4.01 11,6.5 C11,8.99 8.99,11 6.5,11 L6.5,11 Z M4,6 L9,6 L9,7 L4,7 L4,6 Z"
                  fill="#E83744"
                ></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    showThumb: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rotation: 0,
      zoom: 1,
      inPreview: false,
    };
  },
  methods: {
    onRotateLeft() {
      this.rotation -= 90;
    },

    onRotateRight() {
      this.rotation += 90;
    },

    onZoomIn() {
      this.zoom += 0.2;
    },

    onZoomOut() {
      this.zoom -= 0.2;

      if (this.zoom < 0.2) this.zoom = 0.2;
    },

    reset() {
      this.rotation = 0;
      this.zoom = 1;
    },

    open() {
      this.reset();
      this.inPreview = true;
    },

    close() {
      this.inPreview = false;
    },
  },
};
</script>

<style scoped lang="scss">
.image-container {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  .thumb {
    height: 100%;
    width: 100%;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    img {
      height: 100%;
      width: 100%;

      object-fit: cover;
      user-select: none;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    background: rgba($color: #000000, $alpha: 0.4);

    .content {
      height: 100%;
      width: 100%;

      display: flex;
      justify-content: center;
      align-items: center;

      overflow: auto;

      .preview {
        max-height: 80%;
        max-width: 80%;

        transform: rotate(10deg) scale(1.5);

        object-fit: contain;
        user-select: none;
      }
    }

    .close {
      height: 56px;
      width: 56px;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: 20px;
      right: 20px;

      background-color: var(--color-surface-light);
      box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.24);
      border-radius: 28px;

      cursor: pointer;
    }

    .controller {
      height: 56px;
      width: 320px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      position: absolute;
      bottom: 0;

      border-radius: 4px 4px 0 0;
      background-color: var(--color-surface-light);
      box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.24);

      @media (max-width: 600px) {
        width: 100%;
        border-radius: 0;
      }

      .group {
        height: 40px;

        margin: 8px;

        display: flex;
        align-items: center;

        background-color: var(--color-surface-dark);
        border-radius: 4px;

        .i-button {
          height: 36px;
          width: 36px;

          margin: 12px;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 18px;
          // background: var(--color-primary);

          cursor: pointer;

          svg {
            height: 20px;
            width: 20px;
          }
        }
      }
    }
  }
}
</style>
