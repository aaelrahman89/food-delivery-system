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
      <div class="order-details-card__header__quantity">
        {{ item.quantity }}
      </div>
      <div class="order-details-card__header__title">
        {{ $t(item.title) }}
      </div>
      <div
        v-if="editMode"
        class="order-details-card__header__removal-icon vg-clickable"
        @click.self="removeItem()"
      >
        <vg-svg
          :src="SVG_ICON_REMOVE"
          fill="red"
          width="16px"
          height="16px"
        ></vg-svg>
      </div>
    </vg-flex>
    <template v-if="shouldRenderOptionsAndSelections">
      <div class="vg-border vg-border--dashed"></div>
      <vg-grid gap-size="small" class="vg-text-emphasis--low vg-text--mid">
        <div
          v-for="option in item.options"
          :key="option.optionId"
          class="vg-text--ellipsis"
        >
          {{ $t(option.title) }}
          <div
            v-for="selection in option.selections"
            :key="selection.selectionId"
            class="vg-padding-inline-start--large"
          >
            {{ $t(selection.title) }}
          </div>
        </div>
      </vg-grid>
    </template>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { OrderItem } from '../../../../core/models/Order';
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
  name: 'SurvvShopOrderItemCard',
  components: {
    VgFlex,
    VgSvg,
    VgGrid,
  },
  props: {
    item: {
      type: OrderItem,
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
  },
});
</script>

<style scoped lang="scss">
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
