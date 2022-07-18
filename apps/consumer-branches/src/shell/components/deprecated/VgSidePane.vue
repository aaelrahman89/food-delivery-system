<template>
  <div style="overflow-y: scroll" class="vg-map elevation-4">
    <v-toolbar class="side-pane-toolbar" flat dense color="primary">
      <h1 class="side-pane-title">
        <slot name="toolbar-title" />
      </h1>
      <v-spacer />
      <slot name="toolbar-actions" />
    </v-toolbar>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VgSidePane',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
h1 {
  color: white;
  font-size: 1.5rem;
}
.side-pane-toolbar {
  z-index: 1;
}
</style>
