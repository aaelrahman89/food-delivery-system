<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form ref="form" @submit.prevent="submit">
      <div class="credit-note-form">
        <div class="credit-note-form__header">
          <h1>{{ $t('CREDIT_NOTE_FORM_HEADER_CREATION') }}</h1>
        </div>
        <div class="credit-note-form__body">
          <div class="credit-note-form__input">
            <vg-text-field
              v-model.trim="form.description"
              type="text"
              outlined
              clearable
              :validator="form.validators['description']"
              :label="$t('CREDIT_NOTE_FORM_DESCRIPTION') + '*'"
            ></vg-text-field>
          </div>
          <div class="credit-note-form__input">
            <vg-text-field
              v-model.trim="form.amount"
              type="text"
              outlined
              clearable
              :validator="form.validators['amount']"
              :label="$t('CREDIT_NOTE_FORM_AMOUNT') + '*'"
            ></vg-text-field>
          </div>
        </div>
        <div class="credit-note-form__footer">
          <vg-button outlined @click="discard">{{ $t('DISCARD') }}</vg-button>
          <vg-button type="submit" :disabled="!form.submittable">{{
            $t('SUBMIT')
          }}</vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { CreditNoteForm } from '../../../../core/models/DebitCreditNotes';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  backdrop: 'backdrop',
  discard: 'discard',
};

export default Vue.extend({
  name: 'CreditNoteForm',
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
    form: {
      type: CreditNoteForm,
      required: true,
    },
  },
  watch: {
    open(val: boolean): void {
      if (!val) {
        this.$refs.form.resetValidation();
      }
    },
  },
  methods: {
    async submit(): Promise<void> {
      if (await this.form.submit()) {
        this.$emit(events.submitted);
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
.credit-note-form {
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
