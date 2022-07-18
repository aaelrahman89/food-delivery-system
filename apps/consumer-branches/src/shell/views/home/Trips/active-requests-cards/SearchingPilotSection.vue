<template>
  <pilot-info-template>
    <template #avatar>
      <v-progress-circular
        :size="70"
        color="green"
        indeterminate
        data-test="progress-circular"
      >
        <v-avatar size="60" color="vg-lightgrey" />
      </v-progress-circular>
    </template>
    <div data-test="searching-div">
      {{ $t('SEARCHING_SINCE') }}:
      <bdi class="grey--text text--darken-2">{{ elapsedTime }}</bdi>
    </div>
    <div>
      {{ $t('NUMBER_OF_DELIVERIES') }}:
      <span class="grey--text text--darken-2">{{ deliveriesCount }}</span>
    </div>
  </pilot-info-template>
</template>

<script>
import PilotInfoTemplate from './PilotInfoTemplate.vue';

export default {
  name: 'SearchingPilotSection',
  components: { PilotInfoTemplate },
  props: {
    deliveriesCount: {
      type: Number,
      default: 0,
    },
    elapsedTime: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style scoped></style>
