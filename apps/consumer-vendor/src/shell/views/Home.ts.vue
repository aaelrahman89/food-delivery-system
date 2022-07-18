<template>
  <v-app>
    <consumer-vendor-app-shell
      :logo-url="pm.vendorLogo"
      :vendor-label="pm.vendorLabel"
      :user-name="pm.userName"
      :menu="pm.appMenu"
      @sign-out="signOut"
      @switch:language="switchLanguage"
    >
      <template>
        <v-main>
          <router-view />
        </v-main>
      </template>
    </consumer-vendor-app-shell>
  </v-app>
</template>

<script lang="ts">
import ConsumerVendorAppShell from '../components/ConsumerVendorAppShell.ts.vue';
import Vue from 'vue';
import { ROUTE_NAMES } from '../../core/routes/routeNames';
import { RootPM } from '../../core/presentation-models/root/RootPM';
import { VendorRepoImpl } from '../repositories/vendor/VendorRepoImpl';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { consumerVendorAppMenu } from '../../menu';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'Home',
  components: {
    ConsumerVendorAppShell,
  },
  data() {
    return {
      pm: new RootPM({
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        consumerVendorAppMenu,
        vendorRepo: new VendorRepoImpl(),
      }),
    };
  },
  async created(): Promise<void> {
    this.$root.pm = this.pm;
    await this.$root.pm.init();
  },
  methods: {
    async signOut(): Promise<void> {
      await this.pm.signOut();
      await this.$router.push({ name: ROUTE_NAMES.LOGIN });
    },
    async switchLanguage(): Promise<void> {
      await this.pm.switchLanguage();
      window.location.reload();
    },
  },
});
</script>

<style scoped lang="scss">
a {
  color: inherit;
  text-decoration: inherit;
}
.tabs-container {
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  padding: 0;
  margin-inline-start: var(--inset-mid);
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.56);
  border-bottom: 4px solid transparent;
  cursor: pointer;
}
.active {
  color: #f74046;
  border-bottom: 4px solid #f74046;
  box-sizing: border-box;
  font-weight: bold;
  cursor: default;
}
</style>
