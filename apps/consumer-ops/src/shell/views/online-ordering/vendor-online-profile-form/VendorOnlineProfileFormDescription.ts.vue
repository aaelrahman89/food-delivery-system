<template>
  <vg-panel :title="$t('CATALOGUE_ITEM_FORM_DESCRIPTION')">
    <div class="description-inputs">
      <vg-textarea
        class="input-background"
        :value="description.en"
        :label="$t('ENGLISH')"
        rows-count="4"
        outlined
        auto-grow
        @input="inputDescriptionEn"
      >
      </vg-textarea>
      <vg-textarea
        class="input-background"
        :value="description.ar"
        :label="$t('ARABIC')"
        rows-count="4"
        outlined
        auto-grow
        @input="inputDescriptionAr"
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
  name: 'VendorOnlineProfileFormDescription',
  components: { VgPanel, VgTextarea },
  props: {
    description: {
      type: Object,
      required: true,
    },
  },
  methods: {
    inputDescriptionEn($event: string): void {
      this.$emit(
        events.update,
        new MultilingualString({ en: $event, ar: this.description.ar })
      );
    },
    inputDescriptionAr($event: string): void {
      this.$emit(
        events.update,
        new MultilingualString({ en: this.description.en, ar: $event })
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
.input-background ::v-deep .v-input__slot {
  background-color: white !important;
}
</style>
