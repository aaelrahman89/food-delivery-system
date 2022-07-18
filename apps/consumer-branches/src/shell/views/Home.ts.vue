<template>
  <v-app>
    <vg-app-shell
      :logo-url="logoUrl"
      :menu="pm.appMenu"
      @sign-out="signOut"
      @switch:language="switchLanguage"
    >
      <template #app-bar>
        <div class="home-app-bar">
          <div>
            <template>
              <router-link
                :to="{
                  name: 'routes.home.scheduled_orders',
                }"
                class="vg-link-container"
              >
                <vg-notification-chip
                  :count="pm.scheduledOrders.length"
                  :title="$t('NOTIFICATION_CHIP_SCHEDULED_ORDERS')"
                  :sound="incomingOnlineOrderSound"
                  ripple
                >
                  <template #icon>
                    <vg-svg
                      :src="scheduledOrdersIcon"
                      fill="var(--color-primary)"
                      width="100%"
                      height="100%"
                    ></vg-svg>
                  </template>
                </vg-notification-chip>
              </router-link>
            </template>
          </div>
          <div>
            <template>
              <router-link
                :to="{
                  name: 'routes.home.pending_orders',
                }"
                class="vg-link-container"
              >
                <vg-notification-chip
                  :count="pm.pendingOrders.length"
                  :title="$t('NOTIFICATION_CHIP_ONLINE_ORDERS')"
                  :sound="incomingOnlineOrderSound"
                  ripple
                >
                  <template #icon>
                    <vg-svg
                      :src="onlineOrdersIcon"
                      fill="var(--color-primary)"
                      width="100%"
                      height="100%"
                    ></vg-svg>
                  </template>
                </vg-notification-chip>
              </router-link>
            </template>
          </div>
          <div>
            <vg-flex justify-content="space-between">
              <b2c-status-menu
                :statuses="pm.b2cStatusOptions"
                @select:status="pm.updateB2CStatus($event)"
              >
                <template slot="activator-button">
                  <vg-button outlined>
                    {{ $t(pm.branchProfile.b2cStatus)
                    }}<v-icon small class="vg-margin-inline-start--mid"
                      >fa-angle-down</v-icon
                    >
                  </vg-button>
                </template>
              </b2c-status-menu>
            </vg-flex>
          </div>
        </div>
      </template>
      <vg-container v-if="$route.meta.deprecatedContainer && pm.initialized">
        <template #alert>
          <balance-at-risk-alert v-if="pm.balanceAtRisk">
          </balance-at-risk-alert>
          <app-update-alert
            v-if="pm.shouldShowAppUpdateAlert"
            @apply="pm.applyAppUpdates()"
          >
          </app-update-alert>
          <notification-permission-alert
            v-if="pm.shouldShowPermissionRequestAlert"
            @apply="pm.requestNotificationPermission()"
          >
          </notification-permission-alert>
        </template>

        <template #title>
          <h1 class="vg-red--text">
            {{ $t($route.name) }}
          </h1>
        </template>
        <template #default>
          <router-view />
        </template>
      </vg-container>
      <div v-if="!$route.meta.deprecatedContainer && pm.initialized">
        <app-update-alert
          v-if="pm.shouldShowAppUpdateAlert"
          @apply="pm.applyAppUpdates()"
        >
        </app-update-alert>
        <notification-permission-alert
          v-if="pm.shouldShowPermissionRequestAlert"
          @apply="pm.requestNotificationPermission()"
        >
        </notification-permission-alert>
        <router-view />
      </div>
      <template v-if="pm.shouldShowBusinessBranchButton" #body-footer>
        <div class="separator"></div>
        <div>
          <v-btn
            class="navigation-button"
            block
            outlined
            color="primary"
            @click="redirectToBusinessBranch"
          >
            {{ $t('BUSINESS_BRANCH_NAVIGATION') }}
          </v-btn>
        </div>
      </template>
      <template #menu-footer>
        <vg-flex
          class="branch-profile-container vg-padding-block-end--large"
          justify-content="center"
          align-items="center"
          flex-direction="column"
          gap-size="mid"
          no-wrap
        >
          <div class="branch-profile-container__logo">
            <vg-img
              alt="branch-logo"
              :src="pm.branchProfile.logo"
              width="75px"
              height="75px"
              border-radius="50%"
            ></vg-img>
          </div>
          <div class="branch-profile-container__label">
            {{ pm.branchProfile.label }}
          </div>
        </vg-flex>
      </template>
    </vg-app-shell>
  </v-app>
</template>

<script lang="ts">
import AppUpdateAlert from './app-alerts/AppUpdateAlert.ts.vue';
import B2cStatusMenu from './B2CStatusMenu.ts.vue';
import BalanceAtRiskAlert from './app-alerts/BalanceAtRiskAlert.ts.vue';
import NotificationPermissionAlert from './app-alerts/NotificationPermissionAlert.ts.vue';
import VgContainer from '../components/deprecated/VgLayout/VgContainer.vue';
import Vue from 'vue';
import { BranchesRepoImpl } from '../repositories/branches/BranchesRepoImpl';
import {
  IMAGE_LOGO,
  SOUND_INCOMING_ONLINE_ORDER,
  SVG_GLOBAL_ONLINE_ORDERS,
  SVG_GLOBAL_SCHEDULED_ORDERS,
  SVG_ICON_PLUS,
  SVG_NAVIGATION_PILOT,
} from '@survv/assets';
import { IntercomRepoImpl } from '../repositories/intercom/IntercomRepoImpl';
import { OrdersRepoImpl } from '../repositories/orders/OrdersRepoImpl';
import { PilotsRepoImpl } from '../repositories/pilots/PilotsRepoImpl';
import { PushNotificationRepoImpl } from '../repositories/push-notification/PushNotificationRepoImpl';
import { RootPM } from '../../core/presentation-models/root/RootPM';
import { VgAppShell } from '@survv/commons/components/VgAppShell';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgNotificationChip } from '@survv/commons/components/VgNotificationChip';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { ZonesRepoImpl } from '../repositories/zones/ZonesRepoImpl';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchAppMenu } from '../../menu';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { pushNotificationManager } from '@survv/pwa/shell/push-notification-manager-impl';
import { routeNames } from '../../core/routes/routeNames';
import { serviceWorkerManager } from '@survv/pwa/shell/service-worker-manager-impl';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { vendorRepoImpl } from '../repositories/vendors/VendorRepoImpl';
import * as mapboxModule from '@survv/commons/shell/maps/mapbox.nc';

export default Vue.extend({
  name: 'Home',
  components: {
    VgAppShell,
    VgNotificationChip,
    VgSvg,
    VgContainer,
    VgFlex,
    AppUpdateAlert,
    BalanceAtRiskAlert,
    NotificationPermissionAlert,
    VgButton,
    B2cStatusMenu,
    VgImg,
  },
  data() {
    return {
      incomingOnlineOrderSound: SOUND_INCOMING_ONLINE_ORDER,
      onlineOrdersIcon: SVG_GLOBAL_ONLINE_ORDERS,
      scheduledOrdersIcon: SVG_GLOBAL_SCHEDULED_ORDERS,
      pilotIcon: SVG_NAVIGATION_PILOT,
      pilotRequestIcon: SVG_ICON_PLUS,
      routeNames,
      pm: new RootPM({
        pushNotificationManager,
        vendorRepo: vendorRepoImpl,
        branchRepo: new BranchesRepoImpl(),
        userPreferenceRepo,
        authTokenRepo,
        notificationService,
        pushNotificationRepo: new PushNotificationRepoImpl(),
        serviceWorkerManager,
        ordersRepo: new OrdersRepoImpl(),
        pilotsRepo: new PilotsRepoImpl(),
        zonesRepo: new ZonesRepoImpl(),
        intercomRepo: new IntercomRepoImpl(),
        allowNewPilotRequests: 'new-request-flow' in this.$route.query,
        branchAppMenu,
      }),
      IMAGE_LOGO,
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
  watch: {
    '$route': function updateIntercom(): void {
      this.$intercom.update();
    },
    'pm.shouldRedirectToHome': async function redirectToHome(
      newValue
    ): Promise<void> {
      if (newValue) {
        await this.$router.push({
          name: routeNames.LOGIN,
          query: {
            redirect: this.$route.path,
          },
        });
      }
    },
  },

  async created() {
    this.$root.pm = this.pm;
    await this.pm.init();

    mapboxModule.configure({
      accessToken: this.pm.mapBoxAccessToken,
      rtlTextPluginUrl:
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js',
    });

    this.$intercom.boot({
      app_id: this.pm.intercomAppId,
      user_id: this.pm.branchProfile.id,
      name: this.pm.branchProfile.label,
      Type: 'Branch',
      avatar: {
        type: 'avatar',
        image_url: this.pm.branchProfile.logo,
      },
      action_color: '#ef3744',
      background_color: '#ef3744',
      hide_default_launcher: false,
    });
  },

  async beforeDestroy(): Promise<void> {
    await this.pm.onViewDestroyed();
  },

  methods: {
    async signOut(): Promise<void> {
      await this.pm.signOut();
      this.$intercom.shutdown();
      await this.$router.push({ name: routeNames.LOGIN });
    },
    async switchLanguage(): Promise<void> {
      await this.pm.switchLanguage();
      window.location.reload();
    },
    redirectToBusinessBranch(): void {
      window.location.href = '/business-branch/';
    },
  },
});
</script>

<style scoped lang="scss">
.home-app-bar {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--inset-large);
  & > * + * {
    margin-inline-start: var(--inset-large);
  }
}
.pilot-request {
  display: flex;
  align-items: center;
  justify-content: center;
  &__text {
    margin-inline-end: var(--inset-small);
  }
  @media (max-width: 1000px) {
    &__text {
      display: none;
    }
  }
}
.branch-profile-container {
  &__label {
    color: var(--color-on-surface-low-emphasis);
  }
}
.separator {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 12px 0;
}
.navigation-button {
  text-transform: none;
  margin: 0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}
</style>
