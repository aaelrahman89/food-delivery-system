<template>
  <vg-overlay type="bottom-sheet" :open="open" @backdrop="backdrop">
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="homepage-section-form">
        <div class="homepage-section-form__header">
          <h1>{{ $t(title) }}</h1>
        </div>
        <div class="homepage-section-form__body">
          <div class="homepage-section-form__body__form">
            <vg-panel
              class="homepage-section-form__body__form__panel"
              :title="$t('HOMEPAGE_SECTION_FORM_FIRST_PANEL_TITLE')"
            >
              <div class="panel-input-group">
                <div class="homepage-section-form__input">
                  <vg-select
                    :selection="pm.form.sectionType"
                    :options="pm.sectionTypeOptions"
                    outlined
                    :validator="pm.validators().sectionType"
                    label="HOMEPAGE_SECTION_FORM_SECTION_TYPE"
                    required
                    @update:selection="pm.onSectionTypeChanged($event)"
                  >
                  </vg-select>
                </div>
                <div class="homepage-section-form__input">
                  <vg-select
                    :selection="pm.form.contentCriteria"
                    :options="pm.contentCriteriaOptions"
                    :disabled="!pm.canSelectContentCriteria"
                    outlined
                    :validator="pm.validators().contentCriteria"
                    label="HOMEPAGE_SECTION_FORM_CONTENT_CRITERIA"
                    required
                    @update:selection="pm.onContentCriteriaChanged($event)"
                  >
                  </vg-select>
                </div>
                <div class="homepage-section-form__input">
                  <vg-select
                    :selection.sync="pm.form.status"
                    :options="pm.sectionStatusOptions"
                    outlined
                    :validator="pm.validators().status"
                    label="HOMEPAGE_SECTION_FORM_STATUS"
                    required
                  >
                  </vg-select>
                </div>
              </div>
            </vg-panel>
            <vg-panel
              class="homepage-section-form__body__form__panel"
              :title="$t('HOMEPAGE_SECTION_FORM_SECOND_PANEL_TITLE')"
            >
              <div class="panel-input-group">
                <div class="homepage-section-form__input">
                  <vg-select
                    :selection="pm.form.headerType"
                    :options="pm.headerTypeOptions"
                    :disabled="pm.disableHeaderTypeSelection"
                    outlined
                    :validator="pm.validators().headerType"
                    label="HOMEPAGE_SECTION_FORM_HEADER_TYPE"
                    required
                    @update:selection="pm.onHeaderTypeChanged($event)"
                  >
                  </vg-select>
                </div>
                <div class="homepage-section-form__input">
                  <v-text-field
                    v-if="pm.canDisplaySectionName"
                    v-model.trim="pm.form.name.en"
                    type="text"
                    outlined
                    :clearable="pm.isSectionNameEditable"
                    :readonly="pm.isSectionNameReadOnly"
                    :rules="[validate('name.en')]"
                    :label="$t('HOMEPAGE_SECTION_FORM_ENGLISH_NAME') + '*'"
                  ></v-text-field>
                </div>
                <div class="homepage-section-form__input">
                  <v-text-field
                    v-if="pm.canDisplaySectionName"
                    v-model.trim="pm.form.name.ar"
                    type="text"
                    outlined
                    :clearable="pm.isSectionNameEditable"
                    :readonly="pm.isSectionNameReadOnly"
                    :rules="[validate('name.ar')]"
                    :label="$t('HOMEPAGE_SECTION_FORM_ARABIC_NAME') + '*'"
                  ></v-text-field>
                </div>
                <div class="homepage-section-form__input">
                  <v-text-field
                    v-if="pm.canDisplayThreshold"
                    :value="pm.form.threshold"
                    type="number"
                    outlined
                    clearable
                    :rules="[validate('threshold')]"
                    :label="$t('HOMEPAGE_SECTION_FORM_THRESHOLD') + '*'"
                    @input="pm.onThresholdChanged($event)"
                  ></v-text-field>
                </div>
              </div>
            </vg-panel>
          </div>
        </div>
        <div class="homepage-section-form__footer">
          <vg-button outlined large @click="discard">{{
            $t('HOMEPAGE_SECTION_FORM_CANCEL')
          }}</vg-button>
          <vg-button
            type="submit"
            :loading="pm.loading"
            :disabled="!pm.canSubmit"
            large
            >{{ $t('HOMEPAGE_SECTION_FORM_SUBMIT') }}
          </vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script>
import validation from '../../../components/mixins/validation';
import { HomepageSectionCreationPM } from '../../../../core/presentation-models/online-ordering/HomepageSectionCreationPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  submit: 'submit',
  backdrop: 'backdrop',
  discard: 'discard',
};

export default {
  name: 'HomepageSectionForm',

  components: {
    VgOverlay,
    VgButton,
    VgPanel,
    VgSelect,
  },

  mixins: [validation],

  props: {
    pm: {
      type: HomepageSectionCreationPM,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.pm instanceof HomepageSectionCreationPM
        ? 'HOMEPAGE_SECTION_FORM_HEADER_CREATION'
        : 'HOMEPAGE_SECTION_FORM_HEADER_UPDATE';
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
.homepage-section-form {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);
  padding: var(--inset-mid);

  &__footer {
    margin-top: var(--inset-mid);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__body {
    margin-top: var(--inset-mid);

    &__form {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      flex-wrap: wrap;

      margin-bottom: var(--inset-mid);

      &__panel {
        margin-bottom: var(--inset-mid);
      }

      &__panel .panel-input-group {
        display: flex;
      }
    }

    &__tags {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
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
