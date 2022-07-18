<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form ref="form">
      <div class="bottom-sheet">
        <div class="bottom-sheet__header">
          <h3>
            {{ formTitle }}
          </h3>
        </div>
        <div class="bottom-sheet__body">
          <vg-panel>
            <vg-flex flex-direction="row" gap-size="small">
              <vg-text-field
                type="text"
                :value="name"
                :validator="validators['name']"
                required
                outlined
                clearable
                label="NAME"
                max-width="100%"
                @input="updateName"
              ></vg-text-field>
              <vg-text-field
                :value="email"
                type="text"
                :validator="validators['email']"
                required
                outlined
                clearable
                label="EMAIL"
                max-width="100%"
                @input="updateEmail"
              ></vg-text-field>
              <vg-text-field
                :value="mobileNo"
                type="text"
                :validator="validators['mobileNumber']"
                required
                outlined
                clearable
                label="MOBILE_NUMBER"
                max-width="100%"
                @input="updateMobileNo"
              ></vg-text-field>
              <vg-text-field
                :value="title"
                type="text"
                :validator="validators['title']"
                required
                outlined
                clearable
                label="TITLE"
                max-width="100%"
                @input="updateTitle"
              ></vg-text-field>
            </vg-flex>
          </vg-panel>
        </div>
        <div class="bottom-sheet__actions">
          <vg-flex
            gap-size="small"
            flex-direction="row"
            justify-content="flex-end"
          >
            <div>
              <vg-button large outlined @click="discard">
                {{ $t('DISCARD') }}
              </vg-button>
            </div>
            <div>
              <vg-button large :disabled="!canSubmit" @click="submit">
                {{ $t('SAVE_CHANGES') }}
              </vg-button>
            </div>
          </vg-flex>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateName: 'update:name',
  updateMobileNo: 'update:mobileNo',
  updateTitle: 'update:title',
  updateEmail: 'update:email',
  backdrop: 'backdrop',
  close: 'close',
  discard: 'discard',
  submit: 'submit',
};

export default Vue.extend({
  name: 'AddContactPersonBottomSheet',
  components: { VgOverlay, VgFlex, VgPanel, VgButton, VgTextField },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mobileNo: {
      type: String,
      default: '',
    },
    canSubmit: {
      type: Boolean,
      default: false,
    },
    formTitle: {
      type: String,
      default: '',
    },
    validators: {
      type: Object,
      required: true,
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.resetForm();
      }
    },
  },
  methods: {
    updateName(val: string): void {
      this.$emit(events.updateName, val);
    },
    updateMobileNo(val: string): void {
      this.$emit(events.updateMobileNo, val);
    },
    updateTitle(val: string): void {
      this.$emit(events.updateTitle, val);
    },
    updateEmail(val: string): void {
      this.$emit(events.updateEmail, val);
    },
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    close(): void {
      this.$emit(events.close);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    resetForm(): void {
      this.$refs.form.resetValidation();
    },
    submit(): void {
      this.$emit(events.submit);
    },
  },
});
</script>

<style lang="scss" scoped>
.bottom-sheet {
  background-color: var(--color-surface-light);
  padding: var(--inset-large) 0;

  &__header {
    font-weight: 600;
    font-size: 32px;
    padding: var(--inset-small) var(--inset-large);
  }

  &__body {
    padding: var(--inset-small) var(--inset-large);
  }

  &__actions {
    padding: var(--inset-large);
  }
  .vg-text-field {
    flex: 45%;
  }
}
</style>
