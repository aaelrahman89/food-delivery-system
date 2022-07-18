<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <v-form @submit.prevent="submit()">
      <div class="stacking-form">
        <div class="stacking-form__header">
          <h1>{{ $t('STACKING_CONFIG_FORM_TITLE') }}</h1>
        </div>

        <div class="stacking-form__body">
          <div class="stacking-form__body__input">
            <vg-text-field
              :value="form.averagePrepTime"
              max-width="100%"
              type="text"
              outlined
              disabled
              :label="$t('STACKING_CONFIG_FORM_AVERAGE_PREP_TIME')"
            ></vg-text-field>
          </div>
          <div class="stacking-form__body__input">
            <vg-text-field
              v-model.number="form.maxStackedOrders"
              max-width="100%"
              type="number"
              outlined
              :label="$t('STACKING_CONFIG_FORM_MAX_STACKED_ORDERS')"
            ></vg-text-field>
          </div>
          <div class="stacking-form__body__input">
            <vg-text-field
              v-model.number="form.stackingWindowInMinutes"
              max-width="100%"
              type="number"
              outlined
              :label="$t('STACKING_CONFIG_FORM_STACKING_WINDOW')"
            ></vg-text-field>
          </div>
        </div>

        <div class="stacking-form__footer">
          <div class="stacking-form__footer__button">
            <vg-button
              color="error"
              outlined
              class="stacking-form__footer__button"
              @click="discard"
            >
              {{ $t('STACKING_CONFIG_FORM_DISCARD') }}
            </vg-button>
          </div>
          <div class="stacking-form__footer__button">
            <vg-button
              color="error"
              :disabled="!form.isValid()"
              @click="submit"
            >
              {{ $t('STACKING_CONFIG_FORM_SAVE') }}
            </vg-button>
          </div>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submit: 'submit',
  discard: 'discard',
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'StackingConfigFormBottomSheet',
  components: {
    VgOverlay,
    VgTextField,
    VgButton,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: undefined,
    },
    form: {
      type: Object,
      required: true,
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submit);
    },
  },
});
</script>

<style scoped lang="scss">
.stacking-form {
  background-color: var(--color-surface-light);
  padding: var(--inset-mid);

  &__header {
    margin-bottom: var(--inset-x-large);
  }

  &__body {
    display: flex;

    &__input {
      padding-left: var(--inset-mid);
      padding-right: var(--inset-mid);
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;

    &__button {
      padding-left: var(--inset-small);
      padding-right: var(--inset-small);
    }
  }
}
</style>
