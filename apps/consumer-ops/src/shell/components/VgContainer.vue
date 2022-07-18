<template>
  <v-main v-if="fullContainer">
    <v-container class="container--fluid pa-0 fill-height">
      <slot />
    </v-container>
  </v-main>

  <v-main v-else>
    <v-container>
      <v-row>
        <v-col cols="12">
          <slot name="title" />
        </v-col>
        <v-col cols="12">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'VgContainer',
  computed: {
    fullContainer() {
      return this.$route.meta.fullContainer;
    },
  },
};
</script>
