<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_ATTRIBUTES')">
    <div class="attributes-container">
      <vg-text-field
        :value="price"
        label="CATALOGUE_ITEM_FORM_PRICE"
        outlined
        type="number"
        @input="updatePrice"
      ></vg-text-field>
      <vg-text-field
        :value="prepTime"
        label="CATALOGUE_ITEM_FORM_PREP_TIME"
        outlined
        type="number"
        @input="updatePrepTime"
      ></vg-text-field>
      <vg-text-field
        :value="calories"
        label="CATALOGUE_ITEM_FORM_CALORIES"
        outlined
        type="number"
        @input="updateCalories"
      ></vg-text-field>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updatePrice: 'update:price',
  updatePrepTime: 'update:prep-time',
  updateCalories: 'update:calories',
};

export default Vue.extend({
  name: 'CatalogueItemFormAttributes',
  components: {
    VgPanel,
    VgTextField,
  },
  props: {
    price: {
      type: Number,
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    calories: {
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
  methods: {
    updatePrice(newVal?: string): void {
      this.$emit(events.updatePrice, Number(newVal));
    },
    updatePrepTime(newVal?: string): void {
      this.$emit(events.updatePrepTime, Number(newVal));
    },
    updateCalories(newVal?: string): void {
      this.$emit(events.updateCalories, Number(newVal));
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
