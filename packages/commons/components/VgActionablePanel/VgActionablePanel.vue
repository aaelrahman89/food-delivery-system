<template>
  <div class="panel-container" :class="{ dark: dark }">
    <div class="panel-header">
      <slot name="header"></slot>
    </div>
    <div style="border-bottom: 1px dashed #c2c2c2"></div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VgActionablePanel',
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.panel-container {
  width: 100%;
  min-height: 50px;

  position: relative;

  padding: var(--inset-mid);

  display: flex;
  flex-direction: column;

  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  .panel-header {
    padding-bottom: var(--inset-mid);

    top: 0;
    left: 0;
    right: 0;
  }

  .panel-body {
    padding-top: var(--inset-mid);

    display: block;
  }
}

.dark {
  background-color: var(--color-surface-dark);
}
</style>
