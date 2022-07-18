<template>
  <v-app>
    <router-view />
    <vg-toast :value="notificationService.notification"></vg-toast>

    <vg-snackbar
      :enable="enableNotification"
      :type="notification.type"
      multi-line
      @hide="resetNotification()"
    >
      <div class="notification-body">
        <div>
          {{ $t(notification.message, notification.params) }}
        </div>
        <div>
          <v-btn dark text @click="resetAndHide()">
            {{ $t('misc.dismiss') }}
          </v-btn>
        </div>
      </div>
    </vg-snackbar>
  </v-app>
</template>

<script>
import VgSnackbar from './shell/components/deprecated/VgSnackbar.vue';
import { AppPM } from '@survv/commons/core/presentation-models/AppPM';
import { VgToast } from '@survv/commons/components/VgToast';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default {
  name: 'App',
  metaInfo() {
    return {
      link: [
        { rel: 'icon', href: this.pm.favicon },
        { rel: 'manifest', href: this.manifestUrl },
        { rel: 'apple-touch-icon', href: this.pm.favicon },
        { rel: 'mask-icon', href: this.pm.favicon },
        { rel: 'shortcut icon', href: this.pm.favicon },
        { meta: 'msapplication-TileColor', content: '#e83744' },
        { meta: 'theme-color', content: '#e83744' },
      ],
      title: `${this.pm.BRAND_NAME} Branch`,
    };
  },
  components: { VgSnackbar, VgToast },
  data() {
    return {
      notification: {
        message: '',
        type: '',
      },
      pm: new AppPM({ userPreferenceRepo, manifestScope: 'consumer-branch' }),
      manifestUrl: '',
      enableNotification: undefined,
      notificationService,
    };
  },
  async created() {
    await this.pm.init();
    const blob = new Blob([this.pm.manifest], {
      type: 'application/json',
    });
    this.manifestUrl = URL.createObjectURL(blob);
    this.$root.$on('notify', this.showNotificationLegacy);
    this.$root.$on('notification', this.showNotification);
  },
  beforeDestroy() {
    this.$root.off('notify', this.showNotificationLegacy);
    this.$root.off('notification', this.showNotification);
  },
  methods: {
    async showNotificationLegacy({ type, message, options }) {
      this.notification = {
        type,
        message,
        params: options.params,
      };
      await this.$nextTick();
      this.enableNotification = false;
      await this.$nextTick();
      this.enableNotification = true;
    },
    async showNotification(notification) {
      this.notification = notification;
      await this.$nextTick();
      this.enableNotification = false;
      await this.$nextTick();
      this.enableNotification = true;
    },
    resetNotification() {
      this.notification = {};
    },
    async resetAndHide() {
      this.enableNotification = false;
      await this.$nextTick();
      this.notification = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
