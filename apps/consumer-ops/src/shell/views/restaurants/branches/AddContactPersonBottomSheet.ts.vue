<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <div class="contact-person-form">
      <div class="contact-person-form__header">
        <h1>{{ $t('CONTACT_PERSON_FORM_ADD_NEW') }}</h1>
      </div>
      <vg-panel>
        <div class="contact-person-form__body">
          <div class="contact-person-form__body__row">
            <vg-text-field
              v-model="form.name"
              :label="$t('CONTACT_PERSON_FORM_NAME')"
              :validator="form.validators['name']"
              type="text"
              width="100%"
              max-width="100%"
              hide-details
              required
              outlined
            ></vg-text-field>
            <vg-text-field
              v-model="form.email"
              :label="$t('CONTACT_PERSON_FORM_EMAIL')"
              :validator="form.validators['email']"
              type="text"
              width="100%"
              max-width="100%"
              hide-details
              required
              outlined
            ></vg-text-field>
          </div>

          <div class="contact-person-form__body__row">
            <vg-text-field
              v-model="form.mobileNumber"
              :label="$t('CONTACT_PERSON_FORM_MOBILE_NO')"
              :validator="form.validators['mobileNumber']"
              type="text"
              width="100%"
              max-width="100%"
              hide-details
              required
              outlined
            ></vg-text-field>
            <vg-text-field
              v-model="form.title"
              :label="$t('CONTACT_PERSON_FORM_TITLE')"
              :validator="form.validators['title']"
              type="text"
              width="100%"
              max-width="100%"
              hide-details
              required
              outlined
            ></vg-text-field>
          </div>
        </div>
      </vg-panel>
      <div class="contact-person-form__footer">
        <div>
          <vg-button expand outlined @click="discard">
            {{ $t('CONTACT_PERSON_FORM_DISCARD') }}
          </vg-button>
        </div>
        <div>
          <vg-button expand :disabled="!form.submittable" @click="submit">
            {{ $t('CONTACT_PERSON_FORM_SAVE') }}
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
};

export default Vue.extend({
  name: 'AddContactPersonBottomSheet',
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
    maxWidth: {
      type: String,
      default: '700px',
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
      this.$emit(events.submitted);
    },
  },
});
</script>

<style scoped lang="scss">
.contact-person-form {
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
