<template>
  <vg-side-pane>
    <template slot="toolbar-title">
      {{ $t('trips.active_pilots') }}
    </template>
    <v-row align="center">
      <v-col cols="12" data-test="active-requests">
        <div v-for="request in pm.requestsList" :key="request.id">
          <active-request-card :request="request"></active-request-card>
          <v-divider />
        </div>
      </v-col>
    </v-row>
  </vg-side-pane>
</template>

<script>
import ActiveRequestCard from './active-requests-cards/ActiveRequestCard.vue';
import ActiveRequestsPM from '../../../../core/deprecated/pilots/ActiveRequestsPM';
import BaseView from '../../../components/deprecated/BaseView';
import VgSidePane from '../../../components/deprecated/VgSidePane.vue';

export default {
  name: 'RequestedTrips',
  components: {
    ActiveRequestCard,
    VgSidePane,
  },
  extends: BaseView,
  data() {
    return {
      pm: new ActiveRequestsPM(),
      pullInterval: {},
      showCancellationReasonsDialog: false,
      selectedRequest: undefined,
      editMode: false,
    };
  },
  async created() {
    try {
      await this.pm.init();
      this.pullInterval = window.setInterval(
        () => !this.editMode && this.pm.hydrate().catch(),
        10000
      );
    } catch (err) {
      this.notify('error', err.message);
    }
  },
  beforeDestroy() {
    window.clearInterval(this.pullInterval);
  },
};
</script>

<style scoped></style>
