<template>
  <vg-panel :title="$t('APP_MANAGEMENT_DOMAINS')">
    <vg-radio-buttons :value="domain" :items="domains" @input="changeDomain">
    </vg-radio-buttons>
  </vg-panel>
</template>
<script>
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgRadioButtons } from '@survv/commons/components/VgRadioButtons';

const events = {
  changeDomain: 'change:domain',
};

export default {
  name: 'DomainSelector',
  components: { VgPanel, VgRadioButtons },
  props: {
    domain: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      domains: [
        {
          value: VendorType.FOOD.valueOf(),
          string: 'APP_DOMAIN_FOOD',
        },
        {
          value: VendorType.PHARMACY.valueOf(),
          string: 'APP_DOMAIN_PHARMACIES',
        },
        {
          value: VendorType.PETS.valueOf(),
          string: 'APP_DOMAIN_PET_STORES',
        },
        {
          value: VendorType.GROCERIES.valueOf(),
          string: 'APP_DOMAIN_GROCERIES',
        },
        {
          value: VendorType.C2C.valueOf(),
          string: 'APP_DOMAIN_C2C',
        },
        {
          value: VendorType.SURVV_SHOP.valueOf(),
          string: 'APP_DOMAIN_SURVV_SHOP',
        },
      ],
    };
  },
  methods: {
    changeDomain(vendorType) {
      this.$emit(events.changeDomain, vendorType.toUpperCase());
    },
  },
};
</script>
<style scoped lang="scss">
.app-management > div {
  margin-bottom: var(--inset-mid);
}
</style>
