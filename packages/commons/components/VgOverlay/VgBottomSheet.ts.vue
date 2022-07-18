<template>
  <v-bottom-sheet
    :inset="inset"
    :value="visible"
    :persistent="persistent"
    :max-width="maxWidth"
    :scrollable="true"
    :return-value="visible"
    @input="backdrop"
  >
    <div class="bottom-sheet-container">
      <div class="vg-bottom-sheet">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'VgBottomSheet',
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: [Number, String],
      default: undefined,
    },
  },
  computed: {
    inset(): boolean {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
  methods: {
    backdrop(value: boolean): void {
      if (!value) {
        this.$emit(events.backdrop);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.bottom-sheet-container {
  display: flex;
  flex-wrap: wrap;
}
.vg-bottom-sheet {
  width: 100%;
  max-height: 80vh;
  overflow: auto;
  border-radius: 4px;
}
</style>
