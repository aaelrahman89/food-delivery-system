<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="tag-form">
        <div class="tag-form__header">
          <h1>{{ $t(title) }}</h1>
        </div>
        <div class="tag-form__body">
          <div class="tag-form__input">
            <vg-image-loader
              width="56"
              height="56"
              radius="28"
              :image.sync="pm.form.icon"
              @error="pm.onIconLoadingFailure($event)"
            ></vg-image-loader>
          </div>
          <div class="tag-form__input">
            <v-text-field
              v-model.trim="pm.form.name.en"
              type="text"
              outlined
              clearable
              :rules="[validate('name.en')]"
              :label="$t('TAG_FORM_ENGLISH_NAME') + '*'"
            ></v-text-field>
          </div>
          <div class="tag-form__input">
            <v-text-field
              v-model.trim="pm.form.name.ar"
              type="text"
              outlined
              clearable
              :rules="[validate('name.ar')]"
              :label="$t('TAG_FORM_ARABIC_NAME') + '*'"
            ></v-text-field>
          </div>
          <div class="tag-form__input">
            <vg-select
              :selection.sync="pm.form.status"
              :options="pm.tagStatusOptions"
              :validator="pm.validators().status"
              label="TAG_FORM_STATUS"
              required
              outlined
            ></vg-select>
          </div>
        </div>
        <div class="tag-form__footer">
          <vg-button outlined @click="discard">{{
            $t('TAG_FORM_CANCEL')
          }}</vg-button>
          <vg-button type="submit" :disabled="!pm.canSubmit">{{
            $t('TAG_FORM_SUBMIT')
          }}</vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script>
import validation from '../../../components/mixins/validation';
import { TagCreationPM } from '../../../../core/presentation-models/online-ordering/TagCreationPM';
import { TagUpdatePM } from '../../../../core/presentation-models/online-ordering/TagUpdatePM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgImageLoader } from '@survv/commons/components/VgImageLoader';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  submit: 'submit',
  backdrop: 'backdrop',
  discard: 'discard',
};

export default {
  name: 'TagForm',
  components: {
    VgImageLoader,
    VgOverlay,
    VgButton,
    VgSelect,
  },
  mixins: [validation],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: [TagUpdatePM, TagCreationPM],
      default: undefined,
    },
  },
  computed: {
    title() {
      return this.pm instanceof TagCreationPM
        ? 'TAG_FORM_HEADER_CREATION'
        : 'TAG_FORM_HEADER_UPDATE';
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
.tag-form {
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
