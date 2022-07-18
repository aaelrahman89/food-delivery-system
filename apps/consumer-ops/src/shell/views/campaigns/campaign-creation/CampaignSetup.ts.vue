<template>
  <vg-panel :title="$t('CAMPAIGN_SETUP')">
    <vg-flex gap-size="large">
      <vg-text-field
        :value="name"
        :validator="nameValidator"
        max-width="303px"
        width="303px"
        required
        label="CAMPAIGN_SETUP_NAME"
        type="text"
        outlined
        @input="updateName"
      ></vg-text-field>
      <div>
        <vg-date-picker
          :value="startDate"
          width="303px"
          outlined
          :label="$t('CAMPAIGN_SETUP_START_DATE')"
          prepend-inner-icon="fa-calendar"
          required
          @input="updateStartDate"
        ></vg-date-picker>
      </div>
      <div>
        <vg-date-picker
          :value="endDate"
          width="303px"
          outlined
          :label="$t('CAMPAIGN_SETUP_END_DATE')"
          prepend-inner-icon="fa-calendar"
          required
          @input="updateEndDate"
        ></vg-date-picker>
      </div>
      <vg-text-field
        :value="budget"
        :validator="budgetValidator"
        max-width="303px"
        width="303px"
        required
        label="CAMPAIGN_SETUP_BUDGET"
        type="number"
        outlined
        @input="updateBudget"
      ></vg-text-field>
      <vg-text-field
        :value="maxActivations"
        :validator="maxActivationsValidator"
        max-width="303px"
        width="303px"
        required
        label="CAMPAIGN_SETUP_MAX_ACTIVATIONS"
        type="text"
        outlined
        @input="updateMaxActivations"
      ></vg-text-field>
      <vg-select
        :selection="service"
        max-width="303px"
        width="303px"
        required
        hide-details
        label="CAMPAIGN_SETUP_SERVICE"
        :options="services"
        outlined
      ></vg-select>
      <vg-select
        :selection="promotionType"
        max-width="303px"
        width="303px"
        required
        hide-details
        label="CAMPAIGN_SETUP_PROMOTION_TYPE"
        :options="promotionTypes"
        outlined
      ></vg-select>
    </vg-flex>
  </vg-panel>
</template>

<script lang="ts">
import VgDatePicker from '../../../components/VgDatePicker.vue';
import Vue from 'vue';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateName: 'update:name',
  updateStartDate: 'update:start-date',
  updateEndDate: 'update:end-date',
  updateBudget: 'update:budget',
  updateMaxActivations: 'update:max-activations',
};

export default Vue.extend({
  name: 'CampaignSetup',
  components: { VgPanel, VgFlex, VgTextField, VgDatePicker, VgSelect },
  props: {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    maxActivations: {
      type: Number,
      required: true,
    },
    nameValidator: {
      type: Function,
      required: true,
    },
    budgetValidator: {
      type: Function,
      required: true,
    },
    maxActivationsValidator: {
      type: Function,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    promotionType: {
      type: String,
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
    promotionTypes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    updateName(val: string): void {
      this.$emit(events.updateName, val.trim());
    },
    updateStartDate(val: string): void {
      this.$emit(events.updateStartDate, val);
    },
    updateEndDate(val: string): void {
      this.$emit(events.updateEndDate, val);
    },
    updateBudget(val: string): void {
      this.$emit(events.updateBudget, Number(val));
    },
    updateMaxActivations(val: string): void {
      this.$emit(events.updateMaxActivations, Number(val));
    },
  },
});
</script>

<style scoped></style>
