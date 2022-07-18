<template>
  <vg-panel>
    <div class="catalogue-item-form__content">
      <catalogue-item-form-name
        :language-support="pm.languageSupport"
        :display-name.sync="pm.form.displayName"
        :validators="pm.form.validators"
      ></catalogue-item-form-name>
      <catalogue-item-form-attributes
        :price.sync="pm.form.price"
        :prep-time.sync="pm.form.prepTime"
        :calories.sync="pm.form.calories"
      >
      </catalogue-item-form-attributes>
      <catalogue-item-form-description
        :language-support="pm.languageSupport"
        :description.sync="pm.form.description"
      >
      </catalogue-item-form-description>
      <catalogue-item-form-tags
        title="CATALOGUE_ITEM_FORM_TAGS"
        :tags.sync="pm.form.tags"
        @open:tag-selection="pm.openTagsSelection()"
      ></catalogue-item-form-tags>
      <catalogue-item-form-tags
        title="CATALOGUE_ITEM_FORM_ALLERGIES"
        :tags.sync="pm.form.allergies"
        @open:tag-selection="pm.openAllergiesSelection()"
      ></catalogue-item-form-tags>
      <catalogue-item-form-sections
        :sections.sync="pm.form.catalogueSections"
        @open:sections-selection="pm.openSectionsSelection()"
      ></catalogue-item-form-sections>
      <vg-gallery-loader
        :gallery.sync="pm.form.gallery"
        :cover-photo.sync="pm.form.coverPhoto"
        @error="pm.onGalleryImageLoadingFailure($event)"
      ></vg-gallery-loader>
      <div class="catalogue-item-form__actions">
        <div class="catalogue-item-form__actions__discard">
          <vg-button outlined @click="discard">
            {{ $t('CATALOGUE_ITEM_FORM_DISCARD') }}
          </vg-button>
        </div>
        <div class="catalogue-item-form__actions__save">
          <vg-button
            :disabled="!pm.form.submittable"
            :loading="pm.form.submitting"
            @click="submit"
          >
            {{ $t('CATALOGUE_ITEM_FORM_SAVE') }}
          </vg-button>
        </div>
      </div>
    </div>
    <vg-bottom-sheet-list
      :open="pm.shouldShowTagsSelectionsList"
      :item-groups="pm.tagsSelectionsList"
      selectable
      :selections.sync="pm.form.tags"
      @backdrop="pm.closeCurrentSelection()"
      @update:selections="pm.closeCurrentSelection()"
    >
      <template #header>
        {{ $t('CATALOGUE_ITEM_FORM_TAG_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{
          $t('CATALOGUE_ITEM_FORM_TAG_SELECTION_SAVE', {
            quantity: selections.length,
          })
        }}
      </template>
    </vg-bottom-sheet-list>
    <vg-bottom-sheet-list
      :open="pm.shouldShowAllergiesSelectionsList"
      :item-groups="pm.allergiesSelectionsList"
      selectable
      :selections.sync="pm.form.allergies"
      @backdrop="pm.closeCurrentSelection()"
      @update:selections="pm.closeCurrentSelection()"
    >
      <template #header>
        {{ $t('CATALOGUE_ITEM_FORM_ALLERGIES_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{
          $t('CATALOGUE_ITEM_FORM_ALLERGIES_SELECTION_SAVE', {
            quantity: selections.length,
          })
        }}
      </template>
    </vg-bottom-sheet-list>
    <vg-bottom-sheet-list
      class="sections-list"
      :open="pm.shouldShowSectionsSelectionsList"
      :item-groups="pm.sectionsList"
      selectable
      :selections.sync="pm.form.catalogueSections"
      @backdrop="pm.closeCurrentSelection()"
      @update:selections="pm.closeCurrentSelection()"
    >
      <template #header>
        {{ $t('CATALOGUE_ITEM_FORM_SECTIONS_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{
          $t('CATALOGUE_ITEM_FORM_SECTIONS_SELECTION_SAVE', {
            quantity: selections.length,
          })
        }}
      </template>
    </vg-bottom-sheet-list>
  </vg-panel>
</template>

<script lang="ts">
import CatalogueItemFormAttributes from './CatalogueItemFormAttributes.ts.vue';
import CatalogueItemFormDescription from './CatalogueItemFormDescription.ts.vue';
import CatalogueItemFormName from './CatalogueItemFormName.ts.vue';
import CatalogueItemFormSections from './CatalogueItemFormSections.ts.vue';
import CatalogueItemFormTags from './CatalogueItemFormTags.ts.vue';
import Vue from 'vue';
import { CatalogueItemCreationPM } from '../../../../core/presentation-models/online-ordering/CatalogueItemCreationPM';
import { CatalogueItemUpdatePM } from '../../../../core/presentation-models/online-ordering/CatalogueItemUpdatePM';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList/';
import { VgButton } from '@survv/commons/components/VgButton/';
import { VgGalleryLoader } from '@survv/commons/components/VgGalleryLoader';
import { VgPanel } from '@survv/commons/components/VgPanel/';

const events = {
  submit: 'submit',
  discard: 'discard',
};

export default Vue.extend({
  name: 'CatalogueItemForm',
  components: {
    CatalogueItemFormName,
    CatalogueItemFormAttributes,
    CatalogueItemFormDescription,
    CatalogueItemFormTags,
    CatalogueItemFormSections,
    VgPanel,
    VgButton,
    VgGalleryLoader,
    VgBottomSheetList,
  },
  props: {
    pm: {
      type: [CatalogueItemCreationPM, CatalogueItemUpdatePM],
      required: true,
    },
  },
  methods: {
    submit(): void {
      this.$emit(events.submit);
    },
    discard(): void {
      this.$emit(events.discard);
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue-item-form__content {
  display: grid;
  row-gap: var(--inset-large);
}
.catalogue-item-form__actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.catalogue-item-form__actions__save {
  margin-inline-start: var(--inset-mid);
}
.sections-list .vg-bottom-sheet-list__body__group__item {
  padding: 15px 20px 15px 10px;
}
</style>
