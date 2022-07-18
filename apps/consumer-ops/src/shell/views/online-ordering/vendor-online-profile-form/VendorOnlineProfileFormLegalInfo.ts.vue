<template>
  <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_MAIN_DETAILS')">
    <div class="display-name-inputs">
      <vg-text-field
        :value="companyName"
        :validator="validators['legalInfo.companyName']"
        outlined
        type="text"
        :label="$t('VENDOR_ONLINE_PROFILE_COMPANY_NAME')"
        required
        @input="updateCompanyName"
      ></vg-text-field>
      <vg-text-field
        :value="companyAddress"
        :validator="validators['legalInfo.companyAddress']"
        outlined
        type="text"
        :label="$t('VENDOR_ONLINE_PROFILE_COMPANY_ADDRESS')"
        required
        @input="updateCompanyAddress"
      ></vg-text-field>
      <vg-text-field
        :value="label"
        :validator="validators['label']"
        outlined
        type="text"
        :label="$t('VENDOR_ONLINE_PROFILE_COMPANY_LABEL')"
        required
        @input="updateLabel"
      ></vg-text-field>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgPanel } from '@survv/commons/components/VgPanel/index';
import { VgTextField } from '@survv/commons/components/VgTextField/index';

const events = {
  updateCompanyName: 'update:companyName',
  updateCompanyAddress: 'update:companyAddress',
  updateLabel: 'update:label',
};

export default Vue.extend({
  name: 'VendorOnlineProfileFormLegalInfo',
  components: { VgPanel, VgTextField },
  props: {
    companyName: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    label: {
      type: String,
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
    updateCompanyName(value: string): void {
      this.$emit(events.updateCompanyName, value);
    },
    updateCompanyAddress(value: string): void {
      this.$emit(events.updateCompanyAddress, value);
    },
    updateLabel(value: string) {
      this.$emit(events.updateLabel, value);
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
