<template>
  <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_DISPLAY_NAME')">
    <div class="display-name-inputs">
      <vg-text-field
        :value="name.en"
        :validator="validators['name.en']"
        outlined
        type="text"
        label="ENGLISH"
        required
        @input="updateEnName"
      ></vg-text-field>
      <vg-text-field
        :value="name.ar"
        :validator="validators['name.ar']"
        outlined
        type="text"
        label="ARABIC"
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
  updateName: 'update:name',
};

export default Vue.extend({
  name: 'VendorOnlineProfileFormDisplayName',
  components: { VgPanel, VgTextField },
  props: {
    name: {
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
      this.$emit(events.updateName, { en: newVal, ar: this.name.ar });
    },
    updateArName(newVal: string | undefined): void {
      this.$emit(events.updateName, { en: this.name.en, ar: newVal });
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
