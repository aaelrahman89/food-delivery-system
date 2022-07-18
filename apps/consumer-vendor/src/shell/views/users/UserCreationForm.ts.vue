<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <div class="user-form">
      <div class="user-form__header">
        <h1>{{ $t('USER_CREATION_FORM_TITLE') }}</h1>
      </div>
      <div v-if="open" class="user-form__body">
        <div class="user-form__body__row">
          <div class="user-form__body__row__field">
            <vg-text-field
              v-model="form.name"
              :label="$t('USER_CREATION_FORM_NAME')"
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
        <div class="user-form__body__row">
          <div class="user-form__body__row__field">
            <vg-text-field
              v-model="form.email"
              :label="$t('USER_CREATION_FORM_EMAIL')"
              :validator="validators['email']"
              type="text"
              width="100%"
              max-width="100%"
              required
              outlined
              @input="input"
            />
          </div>
        </div>
        <div class="user-form__body__row">
          <div class="user-form__body__row__field">
            <vg-text-field
              v-model="form.mobileNo"
              :label="$t('USER_CREATION_FORM_MOBILE_NUMBER')"
              :validator="validators['mobileNo']"
              type="text"
              width="100%"
              max-width="100%"
              outlined
              @input="input"
            />
          </div>
        </div>
        <div class="user-form__body__row">
          <div class="user-form__body__row__field">
            <vg-select
              :selection.sync="form.role"
              :options="rolesList"
              :label="$t('USER_CREATION_FORM_ROLE')"
              outlined
              width="100%"
              max-width="100%"
              @update:selection="input"
            />
          </div>
        </div>
      </div>
      <div class="user-form__footer">
        <div class="user-form__footer__button">
          <vg-button expand outlined @click="discard">
            {{ $t('DISCARD') }}
          </vg-button>
        </div>
        <div class="user-form__footer__button">
          <vg-button expand :disabled="!submittable" @click="submit">
            {{ $t('CREATE') }}
          </vg-button>
        </div>
      </div>
    </div>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
  input: 'input',
};

export default Vue.extend({
  name: 'UserCreationForm',
  components: {
    VgOverlay,
    VgButton,
    VgTextField,
    VgSelect,
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
  computed: {
    rolesList() {
      return [
        UserRole.CALL_CENTER_AGENT,
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ].map((role) => ({
        label: this.$t(role.valueOf()),
        value: role.valueOf(),
      }));
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
.user-form {
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
