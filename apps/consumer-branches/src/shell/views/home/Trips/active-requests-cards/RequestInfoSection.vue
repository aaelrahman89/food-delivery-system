<template>
  <v-row class="mt-2">
    <v-col cols="3">
      <!-- this is left for alignment purposes -->
    </v-col>
    <v-col cols="9">
      <div v-if="eta">
        {{ $t('ETA') }}:
        <span> {{ eta }} </span>
      </div>
      <div>
        {{ $t('NUMBER_OF_DELIVERIES') }}:
        <span class="grey--text text--darken-2">{{ deliveriesCount }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'RequestInfoSection',
  props: {
    eta: {
      type: String,
      default: undefined,
    },
    deliveriesCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped></style>
