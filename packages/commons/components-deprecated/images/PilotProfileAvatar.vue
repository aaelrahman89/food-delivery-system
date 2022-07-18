<template>
  <v-avatar :size="size">
    <v-img :src="url" @error="activateFallback">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="accent"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-avatar>
</template>

<script>
export default {
  name: 'PilotProfileAvatar',
  props: {
    size: {
      type: String,
      default: '48',
    },
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fallback: false,
    };
  },
  computed: {
    url() {
      if (this.fallback) {
        return '/assets/images/profile-fallback.svg';
      }
      return this.src;
    },
  },
  methods: {
    activateFallback() {
      this.fallback = true;
    },
  },
};
</script>

<style scoped></style>
