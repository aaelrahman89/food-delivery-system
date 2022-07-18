<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_ATTRIBUTES')">
    <div class="attributes-container">
      <vg-time-picker
        :value="opensAt"
        :validator="validators['orderingHours.from']"
        label="VENDOR_ONLINE_PROFILE_ATTRIBUTES_OPENS_AT"
        outlined
        max-width="100%"
        @input="updateOpensAt"
      ></vg-time-picker>
      <vg-time-picker
        :value="closesAt"
        :validator="validators['orderingHours.to']"
        label="VENDOR_ONLINE_PROFILE_ATTRIBUTES_CLOSES_AT"
        outlined
        max-width="100%"
        @input="updateClosesAt"
      ></vg-time-picker>
      <vg-text-field
        :value="minimumOrderValue"
        :validator="validators['minimumOrderValue']"
        label="VENDOR_ONLINE_PROFILE_ATTRIBUTES_MINIMUM_ORDER_VALUE"
        outlined
        required
        type="number"
        max-width="100%"
        @input="updateMinimumOrderValue"
      ></vg-text-field>
      <vg-select
        :selection="taxStatus"
        :validator="validators.taxStatus"
        max-width="100%"
        label="VENDOR_ONLINE_PROFILE_ATTRIBUTES_TAX_STATUS_TYPE"
        outlined
        required
        :options="vendorTaxStatusTypes"
        @update:selection="updateTaxStatus($event)"
      ></vg-select>
      <vg-select
        :selection="averagePreparationTime"
        :validator="validators['averagePreparationTime']"
        label="VENDOR_ONLINE_PROFILE_ATTRIBUTES_AVERAGE_PREPARATION_TIME"
        outlined
        required
        :options="averagePreparationTimes"
        max-width="100%"
        @update:selection="updateAveragePreparationTime($event)"
      ></vg-select>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Time } from '@survv/commons/core/models/Time';
import { VendorTaxStatusType } from '../../../../core/models/VendorOnlineProfile';
import { VgPanel } from '@survv/commons/components/VgPanel/index';
import { VgSelect } from '@survv/commons/components/VgSelect/index';
import { VgTextField } from '@survv/commons/components/VgTextField/index';
import { VgTimePicker } from '@survv/commons/components/VgTimePicker';

const events = {
  updateOpensAt: 'update:opens-at',
  updateClosesAt: 'update:closes-at',
  updateMinimumOrderValue: 'update:minimum-order-value',
  updateTaxStatus: 'update:taxStatus',
  updateAveragePreparationTime: 'update:average-preparation-time',
};

export default Vue.extend({
  name: 'VendorOnlineProfileFormAttributes',
  components: { VgTimePicker, VgPanel, VgSelect, VgTextField },
  props: {
    opensAt: {
      type: Time,
      required: true,
    },
    closesAt: {
      type: Time,
      required: true,
    },
    minimumOrderValue: {
      type: Number,
      required: true,
    },
    taxStatus: {
      type: String,
      required: true,
    },
    averagePreparationTime: {
      type: Number,
      required: true,
    },
    validators: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
  },
  data() {
    const vendorTaxStatusTypes = VendorTaxStatusType.lookup().map((taxType) => {
      return {
        label: this.$t(taxType.toString()),
        value: taxType.valueOf(),
      };
    });
    return {
      vendorTaxStatusTypes,
      averagePreparationTimes: [
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
        { label: '25', value: 25 },
        { label: '30', value: 30 },
        { label: '35', value: 35 },
        { label: '40', value: 40 },
        { label: '60', value: 60 },
        { label: '120', value: 120 },
        { label: '180', value: 180 },
      ],
    };
  },

  methods: {
    updateOpensAt(newVal?: string): void {
      this.$emit(events.updateOpensAt, newVal);
    },
    updateClosesAt(newVal?: string): void {
      this.$emit(events.updateClosesAt, newVal);
    },
    updateMinimumOrderValue(newVal?: string): void {
      this.$emit(events.updateMinimumOrderValue, Number(newVal));
    },
    updateTaxStatus(newVal?: string): void {
      this.$emit(events.updateTaxStatus, newVal);
    },
    updateAveragePreparationTime(newVal?: string): void {
      this.$emit(events.updateAveragePreparationTime, Number(newVal));
    },
  },
});
</script>

<style scoped lang="scss">
.attributes-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
.attributes-container ::v-deep .vg-time-picker {
  max-width: 100%;
}
</style>
