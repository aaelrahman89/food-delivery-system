<template>
  <vg-panel :title="$t('PROMO_CODE_SETUP')">
    <vg-flex gap-size="large">
      <vg-text-field
        :value="name"
        :validator="nameValidator"
        max-width="303px"
        width="303px"
        required
        label="PROMO_CODE_SETUP_NAME"
        type="text"
        outlined
        @input="updateName"
      ></vg-text-field>
      <vg-text-field
        :value="maxUsesNumber"
        :validator="maxUsesNumberValidator"
        max-width="303px"
        width="303px"
        required
        label="PROMO_CODE_SETUP_MAX_NUMBER_OF_USE"
        type="number"
        outlined
        @input="updateMaxUsesNumber"
      ></vg-text-field>
      <vg-select
        :value="usage"
        :validator="usageValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_USAGE"
        :options="usages"
        outlined
        @update:selection="updateUsage"
      ></vg-select>
      <vg-select
        v-if="shouldShowType"
        :value="type"
        :validator="typeValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_TYPE"
        :options="types"
        outlined
        @update:selection="updateType"
      ></vg-select>
      <vg-text-field
        v-if="shouldShowValue"
        :value="value"
        :validator="valueValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_VALUE"
        type="number"
        outlined
        @input="updateValue"
      ></vg-text-field>
      <vg-text-field
        v-if="shouldShowPercentage"
        :value="percentage"
        :validator="percentageValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_PERCENT"
        type="number"
        outlined
        @input="updatePercentage"
      ></vg-text-field>
      <vg-text-field
        v-if="shouldShowCap"
        :value="cap"
        :validator="capValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_CAP"
        type="number"
        outlined
        @input="updateCap"
      ></vg-text-field>
      <vg-text-field
        :value="minSpending"
        :validator="minSpendingValidator"
        required
        max-width="303px"
        width="303px"
        label="PROMO_CODE_SETUP_MIN_SPENDING"
        type="number"
        outlined
        @input="updateMinSpending"
      ></vg-text-field>
    </vg-flex>
    <div class="number-of-orders-container">
      <div class="number-of-orders-container__title vg-margin-block-end--mid">
        {{ $t('PROMO_CODE_SETUP_NUMBER_OF_ORDERS_TITLE') }}
      </div>
      <vg-flex gap-size="tiny">
        <vg-select
          :value="numberOfOrdersOperator"
          max-width="120px"
          width="120px"
          label="PROMO_CODE_SETUP_NUMBER_OF_ORDERS_OPERATOR"
          :options="numberOfOrdersOperators"
          outlined
          @update:selection="updateNumberOfOrdersOperator"
        ></vg-select>
        <vg-text-field
          :value="numberOfOrders"
          max-width="200px"
          width="200px"
          label="PROMO_CODE_SETUP_NUMBER_OF_ORDERS"
          type="number"
          outlined
          @input="updateNumberOfOrders"
        ></vg-text-field>
      </vg-flex>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateName: 'update:name',
  updateMaxUsesNumber: 'update:maxUsesNumber',
  updateType: 'update:type',
  updateUsage: 'update:usage',
  updatePercentage: 'update:percentage',
  updateValue: 'update:value',
  updateCap: 'update:cap',
  updateMinSpending: 'update:minSpending',
  updateNumberOfOrdersOperator: 'update:numberOfOrdersOperator',
  updateNumberOfOrders: 'update:numberOfOrders',
};

export default Vue.extend({
  name: 'PromoCodeSetup',
  components: { VgPanel, VgFlex, VgTextField, VgSelect },
  props: {
    name: {
      type: String,
      required: true,
    },
    maxUsesNumber: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    usage: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    cap: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    numberOfOrdersOperator: {
      type: String,
      required: true,
    },
    numberOfOrders: {
      type: String,
      required: true,
    },
    minSpending: {
      type: Number,
      required: true,
    },
    nameValidator: {
      type: Function,
      required: true,
    },
    maxUsesNumberValidator: {
      type: Function,
      required: true,
    },
    typeValidator: {
      type: Function,
      required: true,
    },
    usageValidator: {
      type: Function,
      required: true,
    },
    percentageValidator: {
      type: Function,
      required: true,
    },
    capValidator: {
      type: Function,
      required: true,
    },
    valueValidator: {
      type: Function,
      required: true,
    },
    minSpendingValidator: {
      type: Function,
      required: true,
    },
    numberOfOrdersOperators: {
      type: Array,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    usages: {
      type: Array,
      required: true,
    },
    shouldShowType: {
      type: Boolean,
      default: false,
    },
    shouldShowValue: {
      type: Boolean,
      default: false,
    },
    shouldShowPercentage: {
      type: Boolean,
      default: false,
    },
    shouldShowCap: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateName(val: string): void {
      this.$emit(events.updateName, val.trim());
    },
    updateMaxUsesNumber(val: string): void {
      this.$emit(events.updateMaxUsesNumber, Number(val));
    },
    updateType(val: string): void {
      this.$emit(events.updateType, val);
    },
    updateUsage(val: string): void {
      this.$emit(events.updateUsage, val);
    },
    updatePercentage(val: string): void {
      this.$emit(events.updatePercentage, Number(val));
    },
    updateValue(val: string): void {
      this.$emit(events.updateValue, Number(val));
    },
    updateCap(val: string): void {
      this.$emit(events.updateCap, Number(val));
    },
    updateMinSpending(val: string): void {
      this.$emit(events.updateMinSpending, Number(val));
    },
    updateNumberOfOrdersOperator(val: string): void {
      this.$emit(events.updateNumberOfOrdersOperator, val);
    },
    updateNumberOfOrders(val: string): void {
      this.$emit(events.updateNumberOfOrders, val);
    },
  },
});
</script>

<style scoped>
.number-of-orders-container {
  width: fit-content;
  padding: var(--inset-mid);
  border: 1px solid #aaaaaa;
  border-radius: 4px;
}

.number-of-orders-container__title {
  color: var(--color-on-surface-mid-emphasis);
  font-size: 16px;
  line-height: 20px;
}
</style>
