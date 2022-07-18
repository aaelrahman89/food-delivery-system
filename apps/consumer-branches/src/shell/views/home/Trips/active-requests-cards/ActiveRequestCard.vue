<template>
  <v-card class="pt-3 pl-3" data-test="card-request">
    <searching-pilot-section
      v-if="!request.pilot"
      :elapsed-time="request.lastStatusElapsedTime.humanize()"
      :deliveries-count="request.requestedTasksCount"
    >
    </searching-pilot-section>
    <pilot-info-section
      v-if="request.pilot"
      :pilot="request.pilot"
      :elapsed-time="request.lastStatusElapsedTime.humanize()"
    >
    </pilot-info-section>
    <request-info-section
      v-if="request.pilot"
      :eta="request.eta.value ? request.eta.humanize() : undefined"
      :deliveries-count="request.requestedTasksCount"
    ></request-info-section>
  </v-card>
</template>

<script>
import PilotInfoSection from './PilotInfoSection.vue';
import RequestInfoSection from './RequestInfoSection.vue';
import SearchingPilotSection from './SearchingPilotSection.vue';

export default {
  name: 'ActiveRequestCard',
  components: {
    RequestInfoSection,
    PilotInfoSection,
    SearchingPilotSection,
  },
  props: {
    request: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
