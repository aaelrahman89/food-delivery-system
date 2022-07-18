<template>
  <div v-show="show" class="overlay">
    <div class="content">
      <slot></slot>
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
  </div>
</template>

<script>
export default {
  name: 'Overlay',
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
      show: false,
    };
  },
  methods: {
    open() {
      this.show = true;
      this.$emit('open');
    },

    close() {
      this.show = false;
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
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
}
</style>
