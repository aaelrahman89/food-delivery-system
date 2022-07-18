<template>
  <vg-panel :title="$t('DISPLAY_NAME')">
    <div class="display-name-inputs">
      <vg-text-field
        :value="displayName.en"
        :validator="validations['displayName.en']"
        outlined
        type="text"
        :label="$t('ENGLISH')"
        :disabled="disableDisplayNameEn"
        required
        @input="updateEnName"
      ></vg-text-field>
      <vg-text-field
        :value="displayName.ar"
        :validator="validations['displayName.ar']"
        outlined
        type="text"
        :label="$t('ARABIC')"
        :disabled="disableDisplayNameAr"
        required
        @input="updateArName"
      ></vg-text-field>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgPanel } from '@survv/commons/components/VgPanel/index';
import { VgTextField } from '@survv/commons/components/VgTextField/index';

const events = {
  update: 'update:display-name',
};

export default Vue.extend({
  name: 'CatalogueFormDisplayName',
  components: { VgPanel, VgTextField },
  props: {
    displayName: {
      type: Object,
      required: true,
    },
    validations: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
    disableDisplayNameEn: {
      type: Boolean,
      default: false,
    },
    disableDisplayNameAr: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateEnName(newVal: string | undefined): void {
      this.$emit(events.update, { en: newVal, ar: this.displayName.ar });
    },
    updateArName(newVal: string | undefined): void {
      this.$emit(events.update, { en: this.displayName.en, ar: newVal });
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
