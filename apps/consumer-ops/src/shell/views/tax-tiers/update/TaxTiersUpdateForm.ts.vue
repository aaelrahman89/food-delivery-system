<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="tax-tiers-form">
        <div class="tax-tiers-form__header">
          <h1>{{ $t('TAX_TIER_FORM_HEADER_UPDATE') }}</h1>
        </div>
        <div class="tax-tiers-form__body">
          <div class="tax-tiers-form__input">
            <vg-text-field
              v-model.trim="pm.form.displayName.en"
              type="text"
              outlined
              clearable
              :validator="pm.form.validators['displayName.en']"
              :label="`${$t('TAX_TIER_FORM_ENGLISH_NAME')}*`"
            ></vg-text-field>
          </div>
          <div class="tax-tiers-form__input">
            <vg-text-field
              v-model.trim="pm.form.displayName.ar"
              type="text"
              outlined
              clearable
              :validator="pm.form.validators['displayName.ar']"
              :label="`${$t('TAX_TIER_FORM_ARABIC_NAME')}*`"
            ></vg-text-field>
          </div>
          <div class="tax-tiers-form__input">
            <vg-text-field
              v-model.number="pm.form.percentage"
              type="number"
              outlined
              clearable
              :validator="pm.form.validators['percentage']"
              :label="`${$t('TAX_TIER_FORM_PERCENTAGE')}*`"
            ></vg-text-field>
          </div>
        </div>
        <div class="tax-tiers-form__footer">
          <vg-button outlined @click="discard">{{
            $t('TAX_TIER_FORM_CANCEL')
          }}</vg-button>
          <vg-button type="submit" :disabled="!pm.canSubmit">{{
            $t('TAX_TIER_FORM_SUBMIT')
          }}</vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { TaxTierUpdatePM } from '../../../../core/presentation-models/tax-tiers/TaxTierUpdatePM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submit: 'submit',
  backdrop: 'backdrop',
  discard: 'discard',
};

export default Vue.extend({
  name: 'TaxTiersUpdateForm',
  components: {
    VgOverlay,
    VgButton,
    VgTextField,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    pm: {
      type: TaxTierUpdatePM,
      default: undefined,
    },
  },
  methods: {
    async submit(): Promise<void> {
      if (await this.pm?.form.submit()) {
        this.$emit(events.submit);
      }
    },
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
  },
});
</script>

<style scoped lang="scss">
.tax-tiers-form {
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
