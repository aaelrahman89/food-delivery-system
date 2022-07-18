<template>
  <vg-panel :title="$t('CATALOGUE_FORM_ORDERING_HOURS')">
    <div class="attributes-container">
      <vg-time-picker
        :value="orderingHours.from"
        :validator="validations['orderingHours.from']"
        label="ORDERING_FROM"
        outlined
        @input="updateOrderingFrom"
      ></vg-time-picker>
      <vg-time-picker
        :value="orderingHours.to"
        :validator="validations['orderingHours.to']"
        label="ORDERING_TO"
        outlined
        @input="updateOrderingTo"
      ></vg-time-picker>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgPanel } from '@survv/commons/components/VgPanel/index';
import { VgTimePicker } from '@survv/commons/components/VgTimePicker/index';

const events = {
  updateOrderingHours: 'update:ordering-hours',
};

export default Vue.extend({
  name: 'CatalogueFormOrderingHours',
  components: { VgTimePicker, VgPanel },
  props: {
    orderingHours: {
      type: Object,
      required: true,
    },
    validations: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
  },
  methods: {
    updateOrderingFrom(newVal: string): void {
      this.$emit(events.updateOrderingHours, {
        from: newVal,
        to: this.orderingHours.to,
      });
    },
    updateOrderingTo(newVal: string): void {
      this.$emit(events.updateOrderingHours, {
        from: this.orderingHours.from,
        to: newVal,
      });
    },
  },
});
</script>

<style scoped>
.attributes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
</style>
