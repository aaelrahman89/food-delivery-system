<template>
  <vg-flex
    flex-direction="column"
    justify-content="flex-start"
    :class="[
      'order-details-card vg-text--mid vg-border',
      'vg-surface--dark',
      { 'vg-border--dashed': editMode },
      { 'red-border': editMode },
      { 'vg-clickable': editMode },
    ]"
    @click.native="editItem"
  >
    <vg-flex
      class="order-details-card__header"
      align-items="center"
      justify-content="flex-start"
      :style="[
        item.isAvailable
          ? { 'background-color': 'var(--color-surface-dark)' }
          : { 'background-color': 'rgba(224, 32, 32, 0.2)' },
      ]"
    >
      <div class="order-details-card__header__quantity">
        {{ `${item.quantity > 0 ? item.quantity : 1}x` }}
      </div>
      <div class="order-details-card__header__title">
        {{ $t(item.title) }}
      </div>
      <div v-if="!editMode">
        {{ `${formatPrice(item.price)} ${item.price.currency}` }}
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
    <div class="vg-text-emphasis--low vg-padding-inline-start--large">
      {{ item.notes }}
    </div>
    <template v-if="shouldRenderOptionsAndSelections">
      <div class="vg-border vg-border--dashed"></div>
      <vg-flex
        flex-direction="column"
        justify-content="flex-start"
        align-items="stretch"
        class="vg-text--mid"
      >
        <div
          v-for="(option, i) in item.options"
          :key="option.optionId + option.title.en + i"
          class="order-details-card__option"
          :style="[
            option.selections.some((selection) => selection.isAvailable)
              ? { 'background-color': 'var(--color-surface-dark)' }
              : { 'background-color': 'rgba(224, 32, 32, 0.2)' },
          ]"
        >
          {{ $t(option.title) }}
          <div
            v-for="(selection, l) in option.selections"
            :key="selection.selectionId + selection.title.en + l"
          >
            <vg-flex justify-content="space-between">
              <div class="selection-info-container">
                <div class="vg-text-emphasis--low">
                  {{ `${selection.quantity > 0 ? selection.quantity : 1}x` }}
                </div>
                <div
                  class="vg-padding-inline-start--small vg-text-emphasis--low"
                >
                  {{ $t(selection.title) }}
                </div>
              </div>
              <div>
                {{
                  `${formatSelectionPrice(selection.price)} ${
                    item.price.currency
                  }`
                }}
              </div>
            </vg-flex>
          </div>
        </div>
      </vg-flex>
    </template>
  </vg-flex>
</template>

<script lang="ts">
import Vue from 'vue';
import { Money } from '@survv/commons/core/models/money';
import { OrderItem } from '../../../../core/models/Order';
import { SVG_ICON_REMOVE } from '@survv/assets';
import { VgFlex } from '@survv/commons/components/VgFlex';
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
    padding: var(--inset-mid);
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
  &__option {
    padding: var(--inset-small) var(--inset-mid);
    padding-inline-start: var(--inset-xx-large);
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
