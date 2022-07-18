<template>
  <div class="parent-container">
    <div :style="spacerStyle"></div>
    <div
      ref="floatingContainer"
      :style="floaterStyle"
      class="floating-container vg-padding--xx-large"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VgFloatingContainer',
  props: {
    floaterStyles: {
      type: Object,
      default: (): Record<string, string> => {
        return {};
      },
    },
  },
  data() {
    return {
      offsetHeight: 0,
    };
  },
  computed: {
    spacerStyle(): Record<string, string> {
      return {
        width: '100%',
        height: `${this.offsetHeight + 30}px`,
      };
    },
    floaterStyle(): Record<string, string> {
      return {
        ...this.floaterStyles,
        width: `${
          document.getElementsByClassName('vg-app-shell__body')[0].clientWidth
        }px`,
      };
    },
  },
  created() {
    window.addEventListener('resize', this.calculateFloaterWidth);
  },
  mounted() {
    this.offsetHeight = (
      this.$refs.floatingContainer as HTMLElement
    ).offsetHeight;
  },
  destroyed() {
    window.removeEventListener('resize', this.calculateFloaterWidth);
  },
  methods: {
    calculateFloaterWidth(): void {
      (this.$refs.floatingContainer as HTMLElement).style.width = `${
        document.getElementsByClassName('vg-app-shell__body')[0].clientWidth
      }px`;
    },
  },
});
</script>

<style scoped lang="scss">
.parent-container {
  margin: -16px;
}
.floating-container {
  position: fixed;
  background: white;
  bottom: 0;
  box-shadow: 0px -5px 5px 0px rgba(50, 50, 50, 0.05);
}
</style>
