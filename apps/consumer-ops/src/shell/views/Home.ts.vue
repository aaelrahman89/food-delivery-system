<template>
  <v-app>
    <vg-app-shell
      :logo-url="logoUrl"
      :menu="pm.appMenu"
      @sign-out="signOut"
      @switch:language="switchLanguage"
    >
      <template #app-bar>
        <div v-if="pm.shouldShowAppTabs" class="tabs-container">
          <a href="/business-ops/">
            <div class="tab vg-padding--mid">Planman</div>
          </a>
          <div class="tab active vg-padding--mid">
            {{ 'Survv' }}
          </div>
        </div>
      </template>
      <template>
        <vg-container v-if="$route.meta.deprecatedContainer">
          <template #title>
            <v-row>
              <v-col>
                <v-row align="center" justify="space-between">
                  <v-col class="grow">
                    <h1 class="vg-red--text">
                      {{ $t($route.name) }}
                    </h1>
                  </v-col>
                  <v-col class="shrink">
                    <router-view name="actions" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <vg-path-breadcrumbs class="pa-0" />
              </v-col>
            </v-row>
          </template>
          <template #default>
            <router-view />
          </template>
        </vg-container>
        <v-main v-else>
          <router-view />
        </v-main>
      </template>
    </vg-app-shell>
  </v-app>
</template>

<script lang="ts">
import VgContainer from '../components/VgContainer.vue';
import VgPathBreadcrumbs from '../components/VgPathBreadcrumbs.vue';
import Vue from 'vue';
import { ROUTE_NAMES } from '../../core/routes/routeNames';
import { RootPM } from '../../core/presentation-models/root/RootPM';
import { VgAppShell } from '@survv/commons/components/VgAppShell';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { consumerOpsAppMenu } from '../../menu';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import * as VueGoogleMaps from 'vue2-google-maps';
import * as mapboxModule from '@survv/commons/shell/maps/mapbox.nc';

export default Vue.extend({
  name: 'Home',
  components: {
    VgAppShell,
    VgContainer,
    VgPathBreadcrumbs,
  },
  data() {
    return {
      pm: new RootPM({
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        consumerOpsAppMenu,
      }),
    };
  },
  computed: {
    logoUrl() {
      if (this.$rtl) {
        return this.pm.logoRtl;
      }
      return this.pm.logoLtr;
    },
  },
  async created() {
    this.$root.pm = this.pm;
    await this.$root.pm.init();

    mapboxModule.configure({
      accessToken: this.pm.mapBoxAccessToken,
      rtlTextPluginUrl:
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js',
    });

    Vue.use(VueGoogleMaps, {
      load: {
        key: this.pm.googleMapsAccessToken,
        installComponents: true,
      },
    });
  },
  methods: {
    async signOut(): Promise<void> {
      await this.pm.signOut();
      await this.$router.push({ name: ROUTE_NAMES.SIGN_IN });
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
