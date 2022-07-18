<template>
  <vg-overlay
    ref="overlay"
    type="bottom-sheet"
    :open="open"
    @backdrop="backdrop"
  >
    <v-form ref="catalogueSectionForm" @submit.prevent="submit">
      <div class="catalogue-section-form">
        <div class="catalogue-section-form__header">
          <h1>{{ $t('DISPLAY_NAME') }}</h1>
        </div>
        <div class="catalogue-section-form__body">
          <div class="catalogue-section-form__input">
            <vg-text-field
              v-model="catalogueSectionForm.displayName.en"
              type="text"
              outlined
              clearable
              required
              label="ENGLISH"
              :disabled="catalogueSectionForm.disableEnDisplayName"
              :validator="catalogueSectionForm.validators['displayName.en']"
            ></vg-text-field>
          </div>
          <div class="catalogue-section-form__input">
            <vg-text-field
              v-model="catalogueSectionForm.displayName.ar"
              type="text"
              outlined
              clearable
              required
              label="ARABIC"
              :disabled="catalogueSectionForm.disableArDisplayName"
              :validator="catalogueSectionForm.validators['displayName.ar']"
            ></vg-text-field>
          </div>
          <div v-if="canApplyTaxTier" class="catalogue-section-form__input">
            <vg-select
              :selection="catalogueSectionForm.taxTierId"
              :validator="catalogueSectionForm.validators.taxTierId"
              label="CATALOG_SECTIONS_FORM_VAT_TIER"
              outlined
              :options="taxTiersOptions"
              @update:selection="updateVatTierId($event)"
            ></vg-select>
          </div>
        </div>
        <div class="catalogue-section-form__footer">
          <vg-button outlined @click="discard">
            {{ $t('DISCARD_CHANGES') }}
          </vg-button>
          <vg-button
            :disabled="!catalogueSectionForm.submittable"
            type="submit"
          >
            {{ $t('SAVE_CHANGES') }}
          </vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueSectionForm } from '../../../../core/models/CatalogueSection';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgSelect } from '@survv/commons/components/VgSelect/index';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  discard: 'discard',
  backdrop: 'backdrop',
  submitted: 'submitted',
};

export default Vue.extend({
  name: 'CatalogueSectionForm',
  components: { VgOverlay, VgTextField, VgButton, VgSelect },
  props: {
    catalogueSectionForm: {
      type: CatalogueSectionForm,
      required: true,
      default(): CatalogueSectionForm {
        return new CatalogueSectionForm();
      },
    },
    taxTiersOptions: {
      type: Array,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    canApplyTaxTier: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    open(value): void {
      if (value) {
        (this.$refs.catalogueSectionForm as HTMLFormElement).resetValidation();
      }
    },
  },
  methods: {
    discard(): void {
      this.catalogueSectionForm.reset();
      this.$emit(events.discard);
    },
    backdrop(): void {
      this.catalogueSectionForm.reset();
      this.$emit(events.backdrop);
    },
    async submit(): Promise<void> {
      if (await this.catalogueSectionForm.submit()) {
        this.catalogueSectionForm.reset();
        this.$emit(events.submitted);
      }
    },

    updateVatTierId(newVal?: string): void {
      if (newVal) {
        this.catalogueSectionForm.taxTierId = Number(newVal);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue-section-form {
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
