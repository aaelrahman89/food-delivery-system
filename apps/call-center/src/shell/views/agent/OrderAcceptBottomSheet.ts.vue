<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <div class="accept-order-form">
      <div class="accept-order-form__header">
        <h1>{{ $t('ACCEPT_ORDER_FORM_TITLE') }}</h1>
      </div>
      <vg-panel>
        <div class="accept-order-form__body">
          <div class="accept-order-form__body__row">
            <div class="accept-order-form__body__row__field">
              <vg-text-field
                v-model="form.vendorOrderId"
                :label="$t('ACCEPT_ORDER_FORM_ORDER_ID')"
                :validator="validators['vendorOrderId']"
                type="text"
                width="100%"
                max-width="100%"
                required
                outlined
                @input="input"
              />
            </div>
          </div>
        </div>
      </vg-panel>
      <div class="accept-order-form__footer">
        <div>
          <vg-button expand outlined @click="discard">
            {{ $t('DISCARD') }}
          </vg-button>
        </div>
        <div>
          <vg-button expand :disabled="!submittable" @click="submit">
            {{ $t('CONFIRM') }}
          </vg-button>
        </div>
      </div>
    </div>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
  input: 'input',
};

export default Vue.extend({
  name: 'OrderAcceptBottomSheet',
  components: {
    VgPanel,
    VgOverlay,
    VgButton,
    VgTextField,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    submittable: {
      type: Boolean,
      required: true,
    },
    maxWidth: {
      type: String,
      default: '700px',
    },
    form: {
      type: Object,
      required: true,
    },
    validators: {
      type: Object,
      required: true,
    },
  },
  methods: {
    input(): void {
      this.$emit(events.input);
    },
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submitted);
    },
  },
});
</script>

<style scoped lang="scss">
.accept-order-form {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);
  padding: var(--inset-mid);

  &__header {
    margin-bottom: var(--inset-mid);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--inset-large);

    &__row {
      display: flex;
      flex-direction: row;
      gap: var(--inset-large);

      &__field {
        flex-grow: 1;
      }
    }
  }

  &__footer {
    margin-top: var(--inset-mid);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: var(--inset-large);
  }
}
</style>
