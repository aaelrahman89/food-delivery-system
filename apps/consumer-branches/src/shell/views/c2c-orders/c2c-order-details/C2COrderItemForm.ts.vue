<template>
  <vg-overlay
    ref="overlay"
    type="bottom-sheet"
    :open="open"
    @backdrop="backdrop"
  >
    <v-form ref="catalogueSectionForm" @submit.prevent="submit">
      <div class="c2c-order-item-form">
        <div class="c2c-order-item-form__header">
          <h1>{{ $t('C2C_ORDER_ITEM_FORM_ADD_ITEM') }}</h1>
        </div>
        <div class="c2c-order-item-form__body">
          <div class="c2c-order-item-form__input">
            <vg-text-field
              v-model="form.name"
              type="text"
              outlined
              clearable
              required
              :label="$t('C2C_ORDER_ITEM_FORM_NAME')"
              :validator="form.validators['name']"
            ></vg-text-field>
          </div>
          <div class="c2c-order-item-form__input">
            <vg-text-field
              v-model="form.brand"
              type="text"
              outlined
              clearable
              required
              :label="$t('C2C_ORDER_ITEM_FORM_BRAND')"
              :validator="form.validators['brand']"
            ></vg-text-field>
          </div>
          <div class="c2c-order-item-form__input">
            <vg-text-field
              v-model="form.quantity"
              type="number"
              outlined
              clearable
              required
              :label="$t('C2C_ORDER_ITEM_FORM_QUANTITY')"
              :validator="form.validators['quantity']"
            ></vg-text-field>
          </div>
        </div>
        <div class="c2c-order-item-form__footer">
          <vg-button outlined @click="discard">
            {{ $t('C2C_ORDER_ITEM_FORM_DISCARD_CHANGES') }}
          </vg-button>
          <vg-button :disabled="!form.submittable" type="submit">
            {{ $t('C2C_ORDER_ITEM_FORM_SAVE_CHANGES') }}
          </vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { C2CStructuredOrderItemForm } from '../../../../core/models/C2COrder';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  discard: 'discard',
  backdrop: 'backdrop',
  submit: 'submit',
};

export default Vue.extend({
  name: 'C2COrderItemForm',
  components: { VgOverlay, VgTextField, VgButton },
  props: {
    form: {
      type: C2CStructuredOrderItemForm,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    open(value): void {
      if (value) {
        (this.$refs.catalogueSectionForm as HTMLFormElement).resetValidation();
      }
    },
  },
  methods: {
    discard(): void {
      this.form.reset();
      this.$emit(events.discard);
    },
    backdrop(): void {
      this.form.reset();
      this.$emit(events.backdrop);
    },
    async submit(): Promise<void> {
      this.$emit(events.submit);
    },
  },
});
</script>

<style scoped lang="scss">
.c2c-order-item-form {
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
