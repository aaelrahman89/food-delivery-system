<template>
  <v-responsive min-width="200px">
    <img ref="image" v-bind="$attrs" v-on="$listeners" />
  </v-responsive>
</template>

<script>
import Viewer from 'viewerjs';

export default {
  name: 'VgImageViewer',

  data() {
    return {
      viewer: {},
    };
  },

  mounted() {
    this.viewer = new Viewer(this.$refs.image, {
      backdrop: true,
      inline: true,
      title: false,
      navbar: false,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        rotateLeft: true,
        rotateRight: true,
        reset: true,
      },
      viewed() {
        this.viewer.zoom(0.2);
      },
    });
  },
};
</script>

<style scoped>
@import '~viewerjs/dist/viewer.min.css';
</style>
