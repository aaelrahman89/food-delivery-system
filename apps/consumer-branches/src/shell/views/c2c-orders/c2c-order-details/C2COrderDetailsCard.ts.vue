<template>
  <div>
    <vg-flex
      class="c2c-order-details-card vg-text--mid vg-border vg-border--dashed"
      flex-direction="row"
      align-items="center"
    >
      <vg-flex
        class="c2c-order-details-card-first"
        flex-direction="column"
        align-items="center"
        flex-grow="0"
      >
        <vg-flex
          class="c2c-order-details-card-first__quantity vg-text--bold"
          align-items="center"
          >{{ $t(selection.quantity) }}</vg-flex
        >
        <vg-flex
          class="c2c-order-details-card-first__empty"
          align-items="center"
        ></vg-flex
      ></vg-flex>
      <vg-flex
        class="c2c-order-details-card-second"
        flex-direction="column"
        align-items="flex-start"
        flex-grow="0"
      >
        <vg-flex
          class="c2c-order-details-card-second__name vg-text--bold"
          align-items="center"
          >{{ $t(selection.title.en) }}</vg-flex
        >
        <vg-flex
          class="c2c-order-details-card-second__brand vg-text-emphasis--mid"
          align-items="center"
          >{{ $t(selection.title.ar) }}</vg-flex
        ></vg-flex
      >
      <vg-flex
        class="c2c-order-details-card-third"
        align-items="center"
        flex-grow="0"
        ><div class="vg-clickable" @click="removeSelection(selectionIndex)">
          <vg-svg
            :src="SVG_ICON_REMOVE"
            fill="red"
            class="c2c-order-details-card-third__remove"
          ></vg-svg></div
      ></vg-flex>
    </vg-flex>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SVG_ICON_REMOVE } from '@survv/assets';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  removeSelection: 'remove:selection',
};

export default Vue.extend({
  name: 'C2COrderDetailsCard',
  components: {
    VgSvg,
    VgFlex,
  },
  props: {
    selection: {
      type: Object,
      required: true,
    },
    selectionIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      SVG_ICON_REMOVE,
    };
  },
  methods: {
    removeSelection(index: number): void {
      this.$emit(events.removeSelection, index);
    },
  },
});
</script>

<style scoped lang="scss">
.c2c-order-details-card {
  height: 100px;
}
.c2c-order-details-card-first {
  width: 15%;
  height: 100%;

  &__quantity {
    flex-basis: 50%;
  }
  &__name {
    flex-basis: 50%;
  }
  &__brand {
    flex-basis: 50%;
  }
  &__empty {
    flex-basis: 50%;
  }
}
.c2c-order-details-card-second {
  width: 70%;
  height: 100%;
}
.c2c-order-details-card-third {
  width: 15%;
  height: 100%;

  &__remove {
    width: 16px;
    height: 16px;
  }
}
</style>
