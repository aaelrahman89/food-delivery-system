<template>
  <pilot-info-template>
    <template #avatar>
      <v-progress-circular
        :size="70"
        :color="pilot.status.color"
        rotate="360"
        value="value"
      >
        <v-avatar size="60">
          <img
            :src="pilot.imageUrl"
            :alt="$t('pilots.requests_list.pilot_image')"
            data-test="image-pilot"
            @error.prevent="$event.target.src = IMAGES.PROFILE_FALLBACK"
          />
        </v-avatar>
      </v-progress-circular>
    </template>
    <div>
      <div data-test="span-pilot-fullName">
        {{ pilot.fullName }}
      </div>
      <div data-test="span-pilot-mobileNo">
        {{ pilot.mobileNo }}
      </div>
      <div>
        <v-chip
          label
          small
          :color="pilot.status.color"
          :dark="pilot.status.dark"
          class="ma-0"
        >
          {{ $t(pilot.status.string) }}
        </v-chip>
        <template
          v-if="
            pilot.status.value != 'COLLECTING' &&
            pilot.status.value != 'WAITING' &&
            pilot.status.value != 'LOADED'
          "
        >
          {{ $t('SINCE') }}
          <bdi class="grey--text text--darken-2">{{ elapsedTime }} </bdi>
        </template>
      </div>
    </div>
  </pilot-info-template>
</template>

<script>
import PilotInfoTemplate from './PilotInfoTemplate.vue';
import { images } from '../../../../../core/deprecated/constants';

export default {
  name: 'PilotInfoSection',
  components: { PilotInfoTemplate },
  props: {
    pilot: {
      type: Object,
      default() {
        return {};
      },
    },
    elapsedTime: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      IMAGES: images,
    };
  },
};
</script>

<style scoped></style>
