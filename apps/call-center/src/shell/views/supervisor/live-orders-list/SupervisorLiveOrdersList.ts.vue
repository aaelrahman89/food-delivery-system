<template>
  <div class="page-container">
    <div class="orders-list-container">
      <div class="orders-list-container__header">
        <div class="panel-title">{{ $t('SUPERVISOR_LIVE_ORDERS_LIST') }}</div>
      </div>
      <div class="orders-list-container__body">
        <div class="orders-list-container__tabs">
          <v-tabs v-model="activeTab" centered grow hide-slider>
            <v-tab href="#queued-orders" @click="redirectToEmptyState">
              {{ $t('SUPERVISOR_QUEUED_ORDERS') }}
            </v-tab>
            <v-tab href="#working-orders" @click="redirectToEmptyState">
              {{ $t('SUPERVISOR_WORKING_ORDERS') }}
            </v-tab>
            <v-tab href="#scheduled-orders" @click="redirectToEmptyState">
              {{ $t('SUPERVISOR_SCHEDULED_ORDERS') }}
            </v-tab>
          </v-tabs>
        </div>
        <div class="orders-list-container__orders">
          <v-tabs-items v-model="activeTab">
            <v-tab-item value="queued-orders">
              <template v-for="order in message.state.queuedOrders">
                <order-card
                  :key="order.customerOrderId"
                  :order="order"
                  :active="isActiveOrder(order.id)"
                />
              </template>
            </v-tab-item>
            <v-tab-item value="working-orders">
              <template v-for="order in message.state.workingOrders">
                <order-card
                  :key="order.customerOrderId"
                  :order="order"
                  :active="isActiveOrder(order.id)"
                />
              </template>
            </v-tab-item>
            <v-tab-item value="scheduled-orders">
              <template v-for="order in message.state.scheduledOrders">
                <order-card
                  :key="order.customerOrderId"
                  :order="order"
                  :active="isActiveOrder(order.id)"
                />
              </template>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import OrderCard from '../common/OrderCard.ts.vue';
import Vue from 'vue';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { SupervisorLiveOrdersListBloc } from '../../../../core/blocs/supervisor/live-orders/SupervisorLiveOrdersListBloc';
import {
  SupervisorLiveOrdersListMessage,
  SupervisorOrdersListAction,
} from '../../../../core/blocs/supervisor/live-orders/SupervisorLiveOrdersListMessage';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'SupervisorLiveOrdersList',
  components: {
    OrderCard,
  },
  data() {
    return {
      activeTab: 'queued-orders',
      bloc: new SupervisorLiveOrdersListBloc({
        ordersRepo: new OrdersRepoImpl(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      }),
      message: new SupervisorLiveOrdersListMessage(),
    };
  },
  created() {
    this.bloc.outbox().subscribe((message: SupervisorLiveOrdersListMessage) => {
      this.message = message;
    });

    this.bloc.inbox().next(
      new SupervisorOrdersListAction({
        type: 'INITIALIZE',
      })
    );

    this.ordersInterval = setInterval(() => {
      this.bloc.inbox().next(
        new SupervisorOrdersListAction({
          type: 'INITIALIZE',
        })
      );
    }, 10000);
  },
  destroyed() {
    clearInterval(this.ordersInterval);
  },
  methods: {
    isActiveOrder(id: number): boolean {
      return Number(this.$route.params.orderId) === id;
    },
    async redirectToEmptyState(): Promise<void> {
      await this.$router.replace({
        name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-wrap: wrap;
  padding: var(--inset-large);
  height: calc(100vh - 64px);
  gap: var(--inset-large);
}
.orders-list-container {
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  &__header {
    min-height: 60px;
    padding: var(--inset-mid);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-surface-dark);
    border-bottom: 1px solid var(--color-border-light);

    .panel-title {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 22px;
      line-height: 24px;
    }
  }

  &__body {
    height: calc(100% - 60px);
    background-color: var(--color-surface-light);
  }

  &__tabs {
    padding: var(--inset-mid);
  }

  &__orders {
    height: calc(100% - 80px);
    padding: 0 var(--inset-mid);
    overflow: auto;
  }
}
.v-tab {
  color: var(--color-primary) !important;
  background-color: var(--color-surface-light);
  border: 1px solid var(--color-primary);
  border-radius: 28px;
  margin: 0 5px;
  font-weight: bold;
}
.v-tab--active {
  color: var(--color-surface-light) !important;
  background-color: var(--color-primary);
  border: 1px solid var(--color-surface-light);
}
</style>
