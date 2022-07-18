<template>
  <v-app>
    <router-view></router-view>
    <vg-toast :value="notificationService.notification"></vg-toast>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { AppPM } from '@survv/commons/core/presentation-models/AppPM';
import { VgToast } from '@survv/commons/components/VgToast';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
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
      title: `${this.pm.BRAND_NAME} Consumer Ops`,
    };
  },
  components: { VgToast },
  data() {
    return {
      notificationService,
      pm: new AppPM({ userPreferenceRepo, manifestScope: 'consumer-ops' }),
      manifestUrl: '',
    };
  },
  async created() {
    await this.pm.init();
    const blob = new Blob([this.pm.manifest], {
      type: 'application/json',
    });
    this.manifestUrl = URL.createObjectURL(blob);
  },
});
</script>

<style></style>
