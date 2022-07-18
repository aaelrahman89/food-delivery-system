<template>
  <div class="m-container">
    <div class="m-map-container" :class="{ 'm-pane-closed': paneClosed }">
      <slot name="map"></slot>
    </div>
    <div class="m-pane" :class="{ 'm-pane-closed': paneClosed }">
      <div class="m-toggle" @click="onPaneToggle">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          :class="{ 'm-pane-closed': paneClosed }"
        >
          <path
            d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"
            fill="#ffffff"
          />
        </svg>
      </div>
      <div class="m-pane-content">
        <slot name="side-pane"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VgMapLayout',
  data() {
    return {
      paneClosed: false,
    };
  },
  methods: {
    onPaneToggle() {
      this.paneClosed = !this.paneClosed;
    },
  },
};
</script>

<style scoped>
.m-container {
  height: calc(100vh - 64px);
  min-height: 350px;
  --side-pane-width: 320px;
  --animation-time: 0.5s;
}

.m-map-container {
  width: calc(100% - var(--side-pane-width));
  float: left;
  height: 100%;
  transition: width var(--animation-time);
  overflow: auto;
}

html[dir='rtl'] .m-map-container {
  float: right;
}

.m-pane {
  width: var(--side-pane-width);
  float: right;
  height: 100%;
  position: relative;
  transition: width var(--animation-time);
}

.m-pane-content {
  height: 100%;
  overflow: auto;
}

html[dir='rtl'] .m-pane {
  float: left;
}

.m-toggle {
  padding: 5px;
  position: absolute;
  right: 100%;
  background-color: #888888;
  border-radius: 0 0 0 4px;
}

html[dir='rtl'] .m-toggle {
  right: initial;
  left: 100%;
  border-radius: 0 0 4px 0px;
}

.m-toggle:hover {
  cursor: pointer;
}

.m-pane.m-pane-closed {
  width: 0;
}

svg {
  transition: transform var(--animation-time);
}

html[dir='rtl'] svg {
  transform: rotate(180deg);
}

svg.m-pane-closed {
  transform: rotate(180deg);
}

html[dir='rtl'] svg.m-pane-closed {
  transform: rotate(0);
}

.m-map-container.m-pane-closed {
  width: 100%;
}
</style>
