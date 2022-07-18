<template>
  <div>
    <component :is="tag" v-for="(string, key) in bilingualString" :key="key">
      {{ string }}
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { MultilingualString } from '../../core/models/MultilingualString';

export default Vue.extend({
  name: 'VgBilingualString',
  props: {
    value: {
      type: MultilingualString,
      default(): MultilingualString {
        return new MultilingualString();
      },
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  computed: {
    bilingualString(): Partial<MultilingualString> {
      const string: { en?: string; ar?: string } = {};

      if (this.value.en) {
        string.en = this.value.en;
      }

      if (this.value.ar) {
        string.ar = this.value.ar;
      }

      return string;
    },
  },
});
</script>
<style scoped>
h1 {
  color: var(--color-on-surface-mid-emphasis);
  font-size: 16px;
  line-height: 20px;
}
</style>
