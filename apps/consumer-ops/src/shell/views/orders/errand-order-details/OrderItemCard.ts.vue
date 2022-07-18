<template>
  <vg-grid
    :class="[
      'order-details-card vg-text--mid vg-border vg-padding--mid',
      { 'vg-border--dashed': editMode },
      { 'red-border': editMode },
      { 'vg-clickable': editMode },
    ]"
    gap-size="mid"
    @click.native="editItem"
  >
    <vg-flex
      class="order-details-card__header"
      align-items="center"
      justify-content="flex-start"
      gap-size="mid"
    >
      <div class="order-details-card__header__title">
        {{ `${item.quantity} ${$t(item.name)}` }}
      </div>
      <div
        v-if="editMode"
        class="order-details-card__header__removal-icon vg-clickable"
        @click.self="removeItem()"
      >
        <vg-svg
          :src="SVG_ICON_REMOVE"
          fill="red"
          width="15px"
          height="15px"
        ></vg-svg>
      </div>
    </vg-flex>
    <div class="vg-text-emphasis--low vg-padding-inline-start--large">
      {{ item.brand }}
    </div>
    <div class="vg-text-emphasis--low vg-padding-inline-start--large">
      {{ item.notes }}
    </div>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { Money } from '@survv/commons/core/models/money';
import { SVG_ICON_REMOVE } from '@survv/assets';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

const events = {
  removeItem: 'remove:item',
  editItem: 'edit:item',
};

export default Vue.extend({
  name: 'OrderItemCard',
  components: {
    VgFlex,
    VgSvg,
    VgGrid,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      SVG_ICON_REMOVE,
    };
  },
  computed: {
    shouldRenderOptionsAndSelections(): boolean {
      return isNotEmpty(this.item.options);
    },
  },
  methods: {
    removeItem(): void {
      this.$emit(events.removeItem);
    },
    editItem(): void {
      if (this.editMode) {
        this.$emit(events.editItem);
      }
    },
    formatPrice(price: Money): string {
      return price.valueOf() ? price.toString() : '- - - -';
    },
    formatSelectionPrice(price: Money): string {
      return price.valueOf() ? `+${price.toString()}` : '- - - -';
    },
  },
});
</script>

<style scoped lang="scss">
.selection-info-container {
  display: flex;
}
.order-details-card {
  &__header {
    &__quantity {
      min-width: 24px;
      width: max-content;
    }
    &__removal-icon {
      position: relative;
    }
    &__removal-icon:after {
      content: '';
      position: absolute;
      top: -12px;
      bottom: -12px;
      left: -12px;
      right: -12px;
    }
    &__title {
      flex-grow: 1;
    }
  }
}
.order-details-card-second {
  width: 70%;
  height: 100%;
}
.red-border {
  border-color: var(--color-primary);
}
</style>
