<template>
  <v-app>
    <call-center-app-shell
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

      <template #app-bar>
        <div class="home-app-bar">
          <div>
            <template>
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
            </template>
          </div>
          <div>
            <template>
              <vg-notification-chip
                :count="pm.unassignedOrders.length"
                :title="$t('NOTIFICATION_CHIP_UNASSIGNED_ORDERS')"
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
            </template>
          </div>
        </div>
      </template>
    </call-center-app-shell>
  </v-app>
</template>

<script lang="ts">
import CallCenterAppShell from '../components/CallCenterAppShell.ts.vue';
import Vue from 'vue';
import { OrdersRepoImpl } from '../repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../core/routes/routeNames';
import { RootPM } from '../../core/presentation-models/root/RootPM';
import {
  SOUND_INCOMING_ONLINE_ORDER,
  SVG_GLOBAL_ONLINE_ORDERS,
  SVG_GLOBAL_SCHEDULED_ORDERS,
} from '@survv/assets';
import { VendorRepoImpl } from '../repositories/vendor/VendorRepoImpl';
import { VgNotificationChip } from '@survv/commons/components/VgNotificationChip';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { callCenterAppMenu } from '../../menu';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'Home',
  components: {
    CallCenterAppShell,
    VgNotificationChip,
    VgSvg,
  },
  data() {
    return {
      incomingOnlineOrderSound: SOUND_INCOMING_ONLINE_ORDER,
      onlineOrdersIcon: SVG_GLOBAL_ONLINE_ORDERS,
      scheduledOrdersIcon: SVG_GLOBAL_SCHEDULED_ORDERS,
      pm: new RootPM({
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        callCenterAppMenu,
        vendorRepo: new VendorRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
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
</style>
