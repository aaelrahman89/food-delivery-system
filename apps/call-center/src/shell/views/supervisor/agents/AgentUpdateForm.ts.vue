<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <div class="agent-form">
      <div class="agent-form__header">
        <h1>{{ $t('AGENT_UPDATE_FORM_TITLE') }}</h1>
      </div>
      <div v-if="open" class="agent-form__body">
        <div class="agent-form__body__row">
          <div class="agent-form__body__row__field">
            <vg-text-field
              v-model="form.name"
              :label="$t('AGENT_UPDATE_FORM_NAME')"
              :validator="validators['name']"
              type="text"
              width="100%"
              max-width="100%"
              required
              outlined
              @input="input"
            />
          </div>
        </div>
        <div class="agent-form__body__row">
          <div class="agent-form__body__row__field">
            <vg-text-field
              v-model="form.email"
              :label="$t('AGENT_UPDATE_FORM_EMAIL')"
              :validator="validators['email']"
              type="text"
              width="100%"
              max-width="100%"
              required
              outlined
              disabled
              @input="input"
            />
          </div>
        </div>
        <div class="agent-form__body__row">
          <div class="agent-form__body__row__field">
            <vg-text-field
              v-model="form.mobileNo"
              :label="$t('AGENT_UPDATE_FORM_MOBILE_NUMBER')"
              :validator="validators['mobileNo']"
              type="text"
              width="100%"
              max-width="100%"
              outlined
              @input="input"
            />
          </div>
        </div>
      </div>
      <div class="agent-form__footer">
        <div class="agent-form__footer__button">
          <vg-button expand outlined @click="discard">
            {{ $t('DISCARD') }}
          </vg-button>
        </div>
        <div class="agent-form__footer__button">
          <vg-button expand :disabled="!submittable" @click="submit">
            {{ $t('SAVE_CHANGES') }}
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
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
  input: 'input',
};

export default Vue.extend({
  name: 'AgentUpdateForm',
  components: {
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
.agent-form {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);

  &__header {
    margin-bottom: var(--inset-mid);
    padding: var(--inset-mid);
  }

  &__body {
    display: flex;
    flex-direction: column;
    padding: var(--inset-mid);

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
    padding: var(--inset-x-large) var(--inset-huge);
    background: #f2f2f2;
    border: 1px solid var(--color-border-light);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--inset-xx-large);

    &__button {
      flex: 1;
    }
  }
}
</style>
