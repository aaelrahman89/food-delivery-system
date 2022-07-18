<template>
  <div v-if="pairs" class="pairs-list">
    <vg-pair
      v-for="(value, key) in pairs"
      :key="key"
      :style="pairStyle"
      class="pair"
      :pair="{ key: $t(key), value: value }"
    ></vg-pair>
  </div>
</template>

<script>
import VgPair from './VgPair.vue';

export default {
  name: 'VgPairsList',
  components: { VgPair },
  props: {
    pairs: {
      type: Object,
      default() {
        return {};
      },
    },
    pairWidth: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    pairStyle() {
      if (this.pairWidth) {
        return {
          width: '100%',
          maxWidth: `${this.pairWidth}px`,
          justifyContent: 'space-between',
        };
      }
      return {};
    },
  },
};
</script>

<style scoped lang="scss">
.pairs-list {
  margin-inline-start: calc(-1 * var(--inset-small));
  margin-top: calc(-1 * var(--inset-small));
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  .pair {
    margin-inline-start: var(--inset-small);
    margin-top: var(--inset-small);
    @media (max-width: 600px) {
      max-width: initial;
    }
  }
}
</style>
