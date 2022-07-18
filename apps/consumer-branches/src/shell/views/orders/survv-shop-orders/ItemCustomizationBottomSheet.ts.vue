<template>
  <vg-overlay
    type="bottom-sheet"
    max-width="600px"
    :open="open"
    @backdrop="backdrop"
  >
    <vg-flex
      flex-direction="column"
      class="item-customization-bottom-sheet"
      no-wrap
    >
      <div class="item-customization-bottom-sheet__header vg-padding--mid">
        <h1>{{ title }}</h1>
      </div>

      <vg-flex
        flex-grow="1"
        flex-direction="column"
        align-items="start"
        no-wrap
        class="
          item-customization-bottom-sheet__body
          vg-padding-block-end--mid
          vg-padding-inline-end--mid
          vg-padding-inline-start--mid
        "
      >
        <template v-if="pm.initializing">
          <div class="loader">
            <vg-progress-circular
              indeterminate
              size="64"
            ></vg-progress-circular>
          </div>
        </template>
        <template v-else>
          <div
            class="
              vg-padding--small
              vg-border
              item-customization-bottom-sheet__item-summary
            "
          >
            <vg-flex align-items="stretch" gap-size="mid" no-wrap>
              <div
                class="
                  vg-border
                  item-customization-bottom-sheet__item-summary__cover-photo
                "
              >
                <vg-img
                  :src="pm.catalogueItem.coverPhoto"
                  alt="Item cover photo"
                  width="60px"
                  height="60px"
                  border-radius="4px"
                ></vg-img>
              </div>

              <div
                class="
                  vg-text--ellipsis
                  item-customization-bottom-sheet__item-summary__text
                "
              >
                <div class="vg-text--bold">
                  {{ $t(pm.catalogueItem.displayName) }}
                </div>
                <div class="vg-text-emphasis--low vg-text--ellipsis">
                  {{ $t(pm.catalogueItem.description) }}
                </div>
              </div>
              <div
                class="
                  vg-text-primary
                  vg-text--mid
                  item-customization-bottom-sheet__item-summary__price
                "
              >
                {{ pm.catalogueItem.price.toString() }}
                {{ $t(pm.catalogueItem.price.currency) }}
              </div>
            </vg-flex>
          </div>
          <vg-text-field
            v-model="pm.quantity"
            required
            class="item-customization-bottom-sheet__item-quantity"
            :label="$t('ITEM_CUSTOMIZATION_LABEL_QUANTITY')"
            clearable
            hide-details
            max-width="100%"
            type="number"
            outlined
          ></vg-text-field>
          <vg-panel
            v-for="(option, index) in pm.catalogueItem.options"
            :key="option.id"
            class="item-customization-bottom-sheet__item-option"
            dark
            collapsible
            :collapsed="pm.isCollapsedOption(index)"
            @toggle="pm.onOptionCollapseChange(index)"
          >
            <template #header>
              <vg-flex gap-size="mid" align-items="center">
                <vg-svg
                  :src="SVG_ICON_CIRCLE_CHECK"
                  :fill="getOptionCheckMarkColor(index)"
                  :svg-props="{
                    width: `20`,
                    height: `20`,
                  }"
                ></vg-svg>
                <div
                  class="
                    vg-text--bold
                    item-customization-bottom-sheet__item-option__title
                  "
                >
                  {{ $t(option.displayName) }}
                </div>
                <div v-if="option.mandatory" class="required-option">
                  {{ $t('MISC_REQUIRED') }}
                </div>
              </vg-flex>
            </template>
            <div
              class="
                item-customization-bottom-sheet__item-option-selection-list
              "
            >
              <div class="selection-item">
                <template v-if="option.multiSelection">
                  {{
                    $t('ITEM_CUSTOMIZATION_SELECTION_HEADER_MULTI', {
                      min: option.minAllowed,
                      max: option.maxAllowed,
                    })
                  }}
                </template>
                <template v-else>
                  {{ $t('ITEM_CUSTOMIZATION_SELECTION_HEADER_SINGLE') }}
                </template>
              </div>

              <div
                v-for="selection in option.selections"
                :key="selection.id"
                class="selection-item"
              >
                <vg-checkbox
                  v-if="option.multiSelection"
                  :label="$t(selection.displayName)"
                  hide-details
                  :value="
                    pm.isActiveCustomization({
                      selectionId: selection.id,
                      optionId: option.id,
                    })
                  "
                  class="selection-item__checkbox"
                  @input="
                    pm.onOptionMultiSelectionChange({
                      selectionId: selection.id,
                      optionId: option.id,
                      checked: $event,
                    })
                  "
                ></vg-checkbox>
                <vg-radio
                  v-else
                  :label="$t(selection.displayName)"
                  hide-details
                  class="selection-item__checkbox"
                  single
                  :value="
                    pm.isActiveCustomization({
                      selectionId: selection.id,
                      optionId: option.id,
                    })
                  "
                  @input="
                    pm.onOptionSingleSelectionChange({
                      selectionId: selection.id,
                      optionId: option.id,
                      checked: $event,
                    })
                  "
                ></vg-radio>

                <div class="vg-text-primary">
                  {{ selection.price.toString() }}
                  {{ $t(selection.price.currency) }}
                </div>
              </div>
            </div>
          </vg-panel>
        </template>
      </vg-flex>
      <vg-flex
        flex-grow="0"
        justify-content="center"
        align-items="center"
        class="item-customization-bottom-sheet__footer vg-padding--mid"
      >
        <div>
          <vg-button
            :disabled="!pm.canSaveChanges()"
            :loading="pm.loading"
            @click="saveItem"
          >
            {{ saveLabel }}
          </vg-button>
        </div>
      </vg-flex>
    </vg-flex>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueItemCustomizationPM } from '../../../../core/presentation-models/orders/CatalogueItemCustomizationPM';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { OrderItem } from '../../../../core/models/Order';
import { SVG_ICON_CIRCLE_CHECK } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgProgressCircular } from '@survv/commons/components/VgProgressCircular';
import { VgRadio } from '@survv/commons/components/VgRadio';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';

const events = {
  saveItem: 'save:item',
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'ItemCustomizationBottomSheet',
  components: {
    VgOverlay,
    VgButton,
    VgCheckbox,
    VgRadio,
    VgFlex,
    VgImg,
    VgPanel,
    VgSvg,
    VgProgressCircular,
    VgTextField,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    saveLabel: {
      type: String,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
    orderItem: {
      type: OrderItem,
      default: undefined,
    },
  },
  data() {
    return {
      pm: new CatalogueItemCustomizationPM({
        notificationService,
        orderItem: this.orderItem,
        itemId: this.itemId,
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      }),
      SVG_ICON_CIRCLE_CHECK,
      completedOptionFill: 'var(--color-primary)',
      incompleteOptionFill: 'var(--color-on-surface-low-emphasis)',
    };
  },
  watch: {
    async open(): Promise<void> {
      if (!this.open) {
        return;
      }
      this.pm = new CatalogueItemCustomizationPM({
        notificationService,
        orderItem: this.orderItem,
        itemId: this.itemId,
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      });
      await this.pm.init();
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    saveItem(): void {
      this.$emit(events.saveItem, this.pm.customizedItem);
    },
    getOptionCheckMarkColor(index: number): string {
      if (this.pm.isCompletedOption(index)) {
        return this.completedOptionFill;
      }

      return this.incompleteOptionFill;
    },
  },
});
</script>

<style scoped lang="scss">
.item-customization-bottom-sheet {
  height: min(80vh, 100vh - 48px);
  border-radius: 4px 0;
  background-color: var(--color-surface-light);

  &__item-summary {
    width: 100%;
    &__text {
      flex: 1 1;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
    }
    &__price {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
  }
  &__item-option-selection-list {
    margin: calc(var(--inset-mid) * -1);
    margin-top: calc(var(--inset-mid));
    background: white;
    & > * + * {
      border-top: solid 1px var(--color-border-light);
      display: flex;
      align-items: center;
    }
  }

  &__item-option {
    min-height: fit-content;
    &__title {
      flex-grow: 1;
    }
  }

  &__item-quantity {
    width: 100%;
  }

  &__header {
    flex-grow: 0;
  }
  &__body {
    & > * + * {
      margin-top: var(--inset-mid);
    }
    overflow-y: scroll;
  }

  &__footer {
    background-color: var(--color-border-light);
  }
}
.required-option {
  --required-option-height: calc(var(--inset-mid) + 20px);
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 var(--inset-mid);
  height: var(--required-option-height);
  border-radius: calc(var(--required-option-height) / 2);
}
.selection-item {
  padding: var(--inset-mid);
  &__checkbox {
    margin-top: 0;
  }
}
.loader {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
