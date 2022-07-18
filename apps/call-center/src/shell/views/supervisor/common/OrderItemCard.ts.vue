<template>
  <vg-flex
    flex-direction="column"
    justify-content="flex-start"
    align-items="stretch"
    class="order-details-card vg-text--mid vg-border vg-surface--dark"
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
        {{ item.quantity }}
      </div>
      <div class="order-details-card__header__title">
        {{ item.title }}
      </div>
      <div>
        {{ item.price }}
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
          v-for="option in item.options"
          :key="option.optionId"
          class="order-details-card__option"
          :style="[
            option.selections.some((selection) => selection.isAvailable)
              ? { 'background-color': 'var(--color-surface-dark)' }
              : { 'background-color': 'rgba(224, 32, 32, 0.2)' },
          ]"
        >
          {{ option.title }}
          <div
            v-for="selection in option.selections"
            :key="selection.selectionId"
          >
            <vg-flex justify-content="space-between">
              <div class="selection-info-container">
                <div class="vg-text-emphasis--low">
                  {{ selection.quantity }}
                </div>
                <div
                  class="vg-padding-inline-start--small vg-text-emphasis--low"
                >
                  {{ selection.title }}
                </div>
              </div>
              <div>
                {{ selection.price }}
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
import { VgFlex } from '@survv/commons/components/VgFlex';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export default Vue.extend({
  name: 'OrderItemCard',
  components: {
    VgFlex,
  },
  props: {
    item: {
      type: OrderItem,
      required: true,
    },
  },
  computed: {
    shouldRenderOptionsAndSelections(): boolean {
      return isNotEmpty(this.item.options);
    },
  },
  methods: {
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
</style>
