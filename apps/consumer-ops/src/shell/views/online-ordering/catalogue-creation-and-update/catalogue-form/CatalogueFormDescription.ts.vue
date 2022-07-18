<template>
  <vg-panel :title="$t('DESCRIPTION')">
    <div class="description-inputs">
      <vg-textarea
        :value="description.en"
        label="ENGLISH"
        rows-count="4"
        :disabled="disableDescriptionEn"
        outlined
        auto-grow
        @input="inputDescriptionEn"
      >
      </vg-textarea>
      <vg-textarea
        :value="description.ar"
        label="ARABIC"
        rows-count="4"
        :disabled="disableDescriptionAr"
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
import { VgPanel } from '@survv/commons/components/VgPanel/index';
import { VgTextarea } from '@survv/commons/components/VgTextarea/index';

const events = {
  update: 'update:description',
};

export default Vue.extend({
  name: 'CatalogueFormDescription',
  components: { VgPanel, VgTextarea },
  props: {
    description: {
      type: Object,
      required: true,
    },
    disableDescriptionEn: {
      type: Boolean,
      default: false,
    },
    disableDescriptionAr: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    inputDescriptionEn($event: string): void {
      this.$emit(events.update, { en: $event, ar: this.description.ar });
    },
    inputDescriptionAr($event: string): void {
      this.$emit(events.update, { en: this.description.en, ar: $event });
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
