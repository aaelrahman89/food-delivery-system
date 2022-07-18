<template>
  <div>
    <order-card
      v-for="order in $root.pm.workingOrders"
      :key="order.id"
      :customer-order-id="order.customerOrderId"
      :items-count="order.items.length"
      :request-date="order.creationDate"
      :total-value="order.totalWithoutDeliveryFees"
      :to="{
        name: 'routes.orders.details',
        params: { orderId: order.id },
      }"
    >
    </order-card>
  </div>
</template>

<script>
import BaseView from '../../../components/deprecated/BaseView';
import OrderCard from './OrderCard.ts.vue';

export default {
  name: 'WorkingOrders',
  components: { OrderCard },
  extends: BaseView,
};
</script>

<style scoped></style>
