<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_DESCRIPTION')">
    <div class="description-inputs">
      <vg-textarea
        :value="description.en"
        :disabled="!languageSupport.en"
        :class="{ disabled: !languageSupport.en }"
        label="CATALOGUE_ITEM_FORM_ENGLISH"
        rows-count="4"
        outlined
        auto-grow
        @input="updateDescriptionEn"
      >
      </vg-textarea>
      <vg-textarea
        :value="description.ar"
        :disabled="!languageSupport.ar"
        :class="{ disabled: !languageSupport.ar }"
        label="CATALOGUE_ITEM_FORM_ARABIC"
        rows-count="4"
        outlined
        auto-grow
        @input="updateDescriptionAr"
      >
      </vg-textarea>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextarea } from '@survv/commons/components/VgTextarea';

const events = {
  update: 'update:description',
};

export default Vue.extend({
  name: 'CatalogueItemFormDescription',
  components: { VgPanel, VgTextarea },
  props: {
    languageSupport: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateDescriptionEn(value: string): void {
      this.$emit(
        events.update,
        new MultilingualString({ en: value, ar: this.description.ar })
      );
    },
    updateDescriptionAr(value: string): void {
      this.$emit(
        events.update,
        new MultilingualString({ en: this.description.en, ar: value })
      );
    },
  },
});
</script>

<style scoped>
.description-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
</style>
