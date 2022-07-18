<template>
  <vg-panel :title="`${$t('VENDOR_ONLINE_PROFILE_LANGUAGE_SUPPORT')}*`">
    <div class="language-support-options">
      <vg-checkbox
        hide-details
        :value="languageSupportOptions.en"
        :label="$t('VENDOR_ONLINE_PROFILE_LANGUAGE_SUPPORT_EN')"
        @input="updateEnOption"
      ></vg-checkbox>
      <vg-checkbox
        hide-details
        :value="languageSupportOptions.ar"
        :label="$t('VENDOR_ONLINE_PROFILE_LANGUAGE_SUPPORT_AR')"
        @input="updateArOption"
      ></vg-checkbox>
    </div>
    <div v-if="computedValidation" class="language-support-__validation-msg">
      {{ `*${$t(computedValidation)}` }}
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox/index';
import { VgPanel } from '@survv/commons/components/VgPanel/index';

const events = {
  update: 'update:language-support-options',
};

export default Vue.extend({
  name: 'VendorOnlineProfileFormLanguageSupport',
  components: { VgPanel, VgCheckbox },
  props: {
    languageSupportOptions: {
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
  computed: {
    computedValidation(): false | string {
      const validationResult = this.validators.languageSupport();
      if (validationResult === true) {
        return false;
      }
      return validationResult;
    },
  },
  methods: {
    updateEnOption(newVal: boolean): void {
      this.$emit(events.update, {
        en: newVal,
        ar: this.languageSupportOptions.ar,
      });
    },
    updateArOption(newVal: boolean): void {
      this.$emit(events.update, {
        en: this.languageSupportOptions.en,
        ar: newVal,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.language-support-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
.language-support-__validation-msg {
  padding-top: var(--inset-small);
  color: var(--color-primary);
}
</style>
