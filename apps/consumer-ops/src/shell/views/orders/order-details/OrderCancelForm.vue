<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="cancel-form">
        <div class="cancel-form__header">
          <h1>{{ $t('CANCEL_ORDER_FORM_TITLE') }}</h1>
        </div>
        <div class="cancel-form__body">
          <div class="cancel-form__input">
            <vg-select
              :selection.sync="pm.form.reason"
              :options="pm.form.cancelReasons"
              :validator="pm.validators().reason"
              label="CANCEL_ORDER_FORM_REASON"
              required
              outlined
            ></vg-select>
          </div>
          <div class="cancel-form__input">
            <vg-checkbox
              v-model="pm.form.requestRefund"
              hide-details
              :label="$t('CANCEL_ORDER_FORM_REFUND_REQUEST')"
            ></vg-checkbox>
          </div>
        </div>
        <div class="cancel-form__footer">
          <vg-button outlined @click="discard">{{
            $t('CANCEL_ORDER_FORM_CANCEL')
          }}</vg-button>
          <vg-button type="submit" :disabled="!pm.canSubmit">{{
            $t('CANCEL_ORDER_FORM_SUBMIT')
          }}</vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script>
import { CancelOrderPM } from '../../../../core/presentation-models/orders/CancelOrderPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  submit: 'submit',
  backdrop: 'backdrop',
  discard: 'discard',
};

export default {
  name: 'OrderCancelForm',
  components: {
    VgSelect,
    VgOverlay,
    VgButton,
    VgCheckbox,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: CancelOrderPM,
      default: undefined,
    },
  },
  methods: {
    async submit() {
      if (await this.pm.submit()) {
        this.$emit(events.submit);
      }
    },
    backdrop() {
      this.pm.reset();
      this.$emit(events.backdrop);
    },
    discard() {
      this.pm.reset();
      this.$emit(events.discard);
    },
  },
};
</script>

<style scoped lang="scss">
.cancel-form {
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
    justify-content: space-between;
  }

  &__footer {
    justify-content: flex-end;

    button:not(:last-child) {
      margin-inline-end: var(--inset-mid);
    }
  }

  &__input {
    width: 360px;
    max-width: 360px;
    &:not(:last-child) {
      margin-inline-end: var(--inset-large);
    }
  }
}
.vg-select {
  max-width: 360px;
}
</style>
