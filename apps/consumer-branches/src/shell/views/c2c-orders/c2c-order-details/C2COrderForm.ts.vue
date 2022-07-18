<template>
  <v-form ref="c2cStructuredOrderForm" @submit.prevent="submit">
    <vg-flex class="c2c-order-form" justify-content="center" gap-size="mid">
      <div>
        <vg-button large outlined @click="reject">
          {{ $t('C2C_ORDER_FORM_REJECT_ORDER') }}</vg-button
        >
      </div>
      <div>
        <vg-button large type="submit">
          {{ $t('C2C_ORDER_FORM_ACCEPT_ORDER') }}</vg-button
        >
      </div>
    </vg-flex>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { C2CStructuredOrderForm } from '../../../../core/models/C2COrder';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';

const events = {
  reject: 'reject',
  submit: 'submit',
};

export default Vue.extend({
  name: 'C2COrderForm',
  components: { VgButton, VgFlex },
  props: {
    form: {
      type: C2CStructuredOrderForm,
      required: true,
      default(): C2CStructuredOrderForm {
        return new C2CStructuredOrderForm();
      },
    },
  },
  methods: {
    reject(): void {
      this.$emit(events.reject);
    },
    submit(): void {
      this.$emit(events.submit);
    },
  },
});
</script>

<style scoped lang="scss">
.c2c-order-form {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);
  padding: var(--inset-mid);

  &__body,
  &__footer {
    margin-top: var(--inset-mid);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__body {
    border: 1px solid var(--color-border-light);
    border-radius: var(--inset-tiny);
    padding: var(--inset-mid);
    padding-bottom: 0;
  }

  &__footer {
    justify-content: flex-end;

    button:not(:last-child) {
      margin-inline-end: var(--inset-mid);
    }
  }

  &__input {
    max-width: 240px;
    &:not(:last-child) {
      margin-inline-end: var(--inset-mid);
    }
  }
}
</style>
