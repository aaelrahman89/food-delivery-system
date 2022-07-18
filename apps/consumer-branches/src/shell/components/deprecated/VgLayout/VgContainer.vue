<template>
  <v-main v-if="fullContainer">
    <slot name="alert" />

    <v-container class="container--fluid pa-0">
      <slot />
    </v-container>
  </v-main>

  <v-main v-else>
    <slot name="alert" />
    <v-container>
      <v-row>
        <v-col class="grow">
          <v-row>
            <v-col>
              <slot name="title" />
            </v-col>
            <v-col class="grow">
              <slot name="actions" />
            </v-col>
          </v-row>
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
