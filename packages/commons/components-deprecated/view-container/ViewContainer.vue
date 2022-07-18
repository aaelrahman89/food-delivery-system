<template>
  <v-main>
    <notification :value="pm ? pm.notification : undefined"></notification>
    <v-container
      class="fill-height container--fluid"
      :class="{ 'pa-0': noPadding }"
    >
      <slot v-if="showContent"></slot>
      <v-row v-else align="center" justify="center">
        <v-progress-circular
          color="primary"
          indeterminate
          size="80"
        ></v-progress-circular>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { VgToast as Notification } from '../../components/VgToast';

export default {
  name: 'ViewContainer',
  components: { Notification },
  props: {
    pm: {
      type: Object,
      default: undefined,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showLoader: true,
    };
  },
  computed: {
    showContent() {
      if (this.pm) return !(this.pm.initializing || this.showLoader);
      return true;
    },
  },
  watch: {
    'pm.query': async function queryWatcher(value) {
      const newQuery = JSON.stringify(value);
      if (newQuery != this.$route.query.q) {
        await this.$router.push({
          query: {
            q: newQuery,
          },
        });
      }
    },
  },
  created() {
    window.setTimeout(() => {
      this.showLoader = false;
    }, 500);
  },
  destroyed() {
    this.pm.onViewDestroyed();
  },
};
</script>

<style scoped></style>
