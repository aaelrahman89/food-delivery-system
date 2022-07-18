<template>
  <div>
    <template v-for="order in $root.pm.scheduledOrders">
      <order-card
        v-if="order.isB2C"
        :key="order.id"
        :customer-order-id="order.customerOrderId"
        :items-count="order.items.length"
        :request-date="order.creationDate"
        :total-value="order.totalWithoutDeliveryFees"
        :status="order.status"
        :scheduled="order.scheduled"
        :scheduled-to="order.scheduledTo"
        :to="{
          name: 'routes.orders.details',
          params: { orderId: order.id },
        }"
      >
      </order-card>
      <order-card
        v-if="order.isC2C"
        :key="order.id"
        :customer-order-id="order.customerOrderId"
        :items-count="order.items.length"
        :request-date="order.creationDate"
        :total-value="order.totalWithoutDeliveryFees"
        :status="order.status"
        :scheduled="order.scheduled"
        :scheduled-to="order.scheduledTo"
        :to="{
          name: 'routes.c2c-orders.details',
          params: { orderId: order.id },
        }"
      >
      </order-card>
    </template>
  </div>
</template>

<script>
import BaseView from '../../../components/deprecated/BaseView';
import OrderCard from './OrderCard.ts.vue';

export default {
  name: 'PendingOrders',
  components: { OrderCard },
  extends: BaseView,
};
</script>

<style scoped></style>
