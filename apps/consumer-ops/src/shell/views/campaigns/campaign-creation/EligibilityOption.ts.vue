<template>
  <div class="eligibility-option-container">
    <div
      class="eligibility-option-container__radio-btn-container vg-clickable"
      @click="selectOption"
    >
      <div>
        {{ text }}
      </div>
      <v-radio
        ref="VRadio"
        class="eligibility-option-container__radio-btn-container__radio-btn"
        :value="value"
        color="primary"
      >
      </v-radio>
    </div>
    <div class="eligibility-option-container__radio-btn-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'EligibilityOption',
  props: {
    text: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectOption(): void {
      this.$refs.VRadio.$refs.input.click();
    },
  },
});
</script>

<style lang="scss" scoped>
.eligibility-option-container {
  padding: var(--inset-tiny) var(--inset-small);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  margin: var(--inset-small) 0;
  min-width: 314px;
  background-color: var(--color-surface-light);

  &__radio-btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--color-on-surface-low-emphasis);

    &__radio-btn {
      margin: 0 -8px 0 0;
    }
  }

  &__radio-btn-content {
    padding: 0 var(--inset-tiny);
    margin: 0 0 var(--inset-small);
  }
}
</style>
