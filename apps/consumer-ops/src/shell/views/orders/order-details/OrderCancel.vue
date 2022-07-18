<template>
  <div>
    <div v-if="pm" class="cancel-container">
      <vg-button expand @click="pm.openCancelForm()">{{
        $t('CANCEL')
      }}</vg-button>
    </div>
    <div>
      <order-cancellation-reasons-searchable-list
        :open="pm.shouldOpenCancelForm"
        :form="pm.children.cancelOrderPM.form"
        :can-submit="pm.children.cancelOrderPM.canSubmit"
        max-width="600px"
        @submitted="submit()"
        @discard="pm.closeCancelForm()"
        @backdrop="pm.closeCancelForm()"
        @search="pm.children.cancelOrderPM.searchReasons($event)"
      >
      </order-cancellation-reasons-searchable-list>
    </div>
  </div>
</template>

<script>
import OrderCancellationReasonsSearchableList from './OrderCancellationReasonsSearchableList.vue';
import OrderDetailsPM from '../../../../core/presentation-models/orders/OrderDetailsPM';
import { VgButton } from '@survv/commons/components/VgButton';

export default {
  name: 'OrderCancel',
  components: {
    VgButton,
    OrderCancellationReasonsSearchableList,
  },
  props: {
    pm: {
      type: OrderDetailsPM,
      default: undefined,
    },
  },
  async created() {
    await this.pm.children.cancelOrderPM.init();
  },
  methods: {
    async submit() {
      const cancelled = await this.pm.children.cancelOrderPM.submit();
      if (cancelled) {
        this.$emit('cancelled:order');
      }
    },
  },
};
</script>

<style scoped></style>
