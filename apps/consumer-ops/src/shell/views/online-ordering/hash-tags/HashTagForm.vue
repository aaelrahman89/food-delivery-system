<template>
  <vg-overlay
    ref="overlay"
    type="bottom-sheet"
    :open="open"
    @backdrop="backdrop"
  >
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="hash-tag-creation">
        <div class="hash-tag-creation__header">
          <h1>{{ $t(title) }}</h1>
        </div>
        <div class="hash-tag-creation__body">
          <div class="hash-tag-creation__input">
            <v-text-field
              v-model.trim="pm.form.name.en"
              type="text"
              outlined
              clearable
              :rules="[validate('name.en')]"
              :label="$t('HASH_TAG_FORM_ENGLISH_NAME') + '*'"
            ></v-text-field>
          </div>
          <div class="hash-tag-creation__input">
            <v-text-field
              v-model.trim="pm.form.name.ar"
              type="text"
              outlined
              clearable
              :rules="[validate('name.ar')]"
              :label="$t('HASH_TAG_FORM_ARABIC_NAME') + '*'"
            ></v-text-field>
          </div>
          <div class="hash-tag-creation__input">
            <vg-select
              :selection.sync="pm.form.status"
              :options="pm.hashTagStatusOptions"
              :validator="pm.validators().status"
              label="HASH_TAG_FORM_STATUS"
              required
              outlined
            ></vg-select>
          </div>
        </div>
        <div class="hash-tag-creation__footer">
          <vg-button outlined @click="discard">{{
            $t('HASH_TAG_FORM_CANCEL')
          }}</vg-button>
          <vg-button type="submit" :disabled="!pm.canSubmit">{{
            $t('HASH_TAG_FORM_SUBMIT')
          }}</vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script>
import validation from '../../../components/mixins/validation';
import { HashTagCreationPM } from '../../../../core/presentation-models/online-ordering/HashTagCreationPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  submit: 'submit',
  discard: 'discard',
  backdrop: 'backdrop',
};

export default {
  name: 'HashTagForm',
  components: {
    VgButton,
    VgSelect,
    VgOverlay,
  },
  mixins: [validation],

  props: {
    pm: {
      type: Object,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.pm instanceof HashTagCreationPM
        ? 'HASH_TAG_FORM_HEADER_CREATION'
        : 'HASH_TAG_FORM_HEADER_UPDATE';
    },
  },

  methods: {
    async submit() {
      if (await this.pm.submit()) {
        this.$emit(events.submit);
      }
    },

    backdrop() {
      this.$emit(events.backdrop);
    },
    discard() {
      this.$emit(events.discard);
    },
  },
};
</script>

<style scoped lang="scss">
.hash-tag-creation {
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
