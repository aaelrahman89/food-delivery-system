<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_DISPLAY_NAME')">
    <div class="display-name-inputs">
      <vg-text-field
        :value="displayName.en"
        :disabled="!languageSupport.en"
        :class="{ disabled: !languageSupport.en }"
        :validator="validators['displayName.en']"
        outlined
        type="text"
        label="CATALOGUE_ITEM_FORM_ENGLISH"
        required
        @input="updateEnName"
      ></vg-text-field>
      <vg-text-field
        :value="displayName.ar"
        :disabled="!languageSupport.ar"
        :class="{ disabled: !languageSupport.ar }"
        :validator="validators['displayName.ar']"
        outlined
        type="text"
        label="CATALOGUE_ITEM_FORM_ARABIC"
        required
        @input="updateArName"
      ></vg-text-field>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateDisplayName: 'update:display-name',
};

export default Vue.extend({
  name: 'CatalogueItemFormName',
  components: { VgPanel, VgTextField },
  props: {
    languageSupport: {
      type: Object,
      required: true,
    },
    displayName: {
      type: Object,
      required: true,
    },
    validators: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
  },
  methods: {
    updateEnName(newVal: string | undefined): void {
      this.$emit(events.updateDisplayName, {
        en: newVal,
        ar: this.displayName.ar,
      });
    },
    updateArName(newVal: string | undefined): void {
      this.$emit(events.updateDisplayName, {
        en: this.displayName.en,
        ar: newVal,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.display-name-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
</style>
