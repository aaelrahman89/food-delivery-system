<template>
  <v-row class="pa-1" align="center">
    <v-col class="shrink">
      <slot name="avatar"></slot>
    </v-col>
    <v-col class="shrink vg-text-nowrap">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PilotInfoTemplate',
};
</script>

<style scoped></style>
