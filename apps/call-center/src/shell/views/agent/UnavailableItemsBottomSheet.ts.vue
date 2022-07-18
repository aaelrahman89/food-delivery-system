<template>
  <vg-overlay
    type="bottom-sheet"
    max-width="600px"
    :open="open"
    @backdrop="backdrop()"
    ><vg-flex
      flex-direction="column"
      class="item-availability-bottom-sheet"
      no-wrap
    >
      <div class="item-availability-bottom-sheet__header vg-padding--mid">
        <h1>{{ title }}</h1>
      </div>
      <vg-grid gap-size="mid">
        <div v-for="(item, index) in items" :key="index" :item="item">
          <vg-grid
            :class="[
              'order-details-card vg-text--mid vg-border vg-padding--mid',
              'vg-surface--dark',
            ]"
            gap-size="mid"
          >
            <vg-flex
              class="order-details-card__header"
              align-items="center"
              justify-content="flex-start"
              gap-size="mid"
            >
              <div class="order-details-card__header__quantity">
                {{ `${item.quantity > 0 ? item.quantity : 1}x` }}
              </div>
              <div class="order-details-card__header__title">
                {{ $t(item.title) }}
              </div>
              <div>
                {{ `${formatPrice(item.price)}` }}
              </div>
              <div class="order-details-card__header__checkbox">
                <v-checkbox
                  v-model="selectedItems"
                  :value="item.itemId"
                  color="vg-red"
                  @change="updateSelectedItems"
                ></v-checkbox>
              </div>
            </vg-flex>
            <div class="vg-text-emphasis--low vg-padding-inline-start--large">
              {{ item.notes }}
            </div>
            <template v-if="item.options.length">
              <div class="vg-border vg-border--dashed"></div>
              <vg-grid
                gap-size="small"
                class="
                  vg-text--mid
                  vg-margin-inline-start--large
                  vg-padding-inline-start--large
                "
              >
                <div
                  v-for="(option, i) in item.options"
                  :key="option.optionId + option.title.en + i"
                >
                  {{ $t(option.title) }}

                  <div
                    v-for="(selection, l) in option.selections"
                    :key="selection.selectionId + selection.title.en + l"
                  >
                    <vg-flex
                      class="selection-info-container"
                      align-items="center"
                      justify-content="flex-start"
                      gap-size="mid"
                    >
                      <div class="vg-text-emphasis--low">
                        {{
                          `${selection.quantity > 0 ? selection.quantity : 1}x`
                        }}
                      </div>
                      <div
                        class="
                          selection-info-container__title
                          vg-padding-inline-start--small
                          vg-text-emphasis--low
                        "
                      >
                        {{ $t(selection.title) }}
                      </div>
                      <div>
                        {{ `${formatSelectionPrice(selection.price)}` }}
                      </div>
                      <div class="selection-info-container__checkbox">
                        <v-checkbox
                          v-model="selectedSelections"
                          :value="selection.selectionId"
                          color="vg-red"
                          @change="updateSelectedSelections"
                        ></v-checkbox>
                      </div>
                    </vg-flex>
                  </div>
                </div>
              </vg-grid>
            </template>
          </vg-grid>
        </div>
      </vg-grid>
      <div class="vg-padding--mid">
        <vg-text-field
          v-model="notes"
          type="text"
          :label="$t('ITEMS_UNAVAILABLE_NOTES')"
          hide-details
          clearable
          outlined
          max-width="100%"
          @input="updateNotes"
        ></vg-text-field>
      </div>
    </vg-flex>
    <template #footer>
      <vg-flex
        class="item-availability-bottom-sheet__footer"
        gap-size=" small"
        justify-content="space-between"
      >
        <div class="item-availability-bottom-sheet__footer__button">
          <vg-button expand outlined @click="discardSelections">{{
            $t('DISCARD')
          }}</vg-button>
        </div>
        <div class="item-availability-bottom-sheet__footer__button">
          <vg-button
            expand
            :disabled="shouldDisableConfirm"
            @click="confirmItemsSelection"
            >{{ $t('CONFIRM') }}</vg-button
          >
        </div>
      </vg-flex>
    </template>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  backdrop: 'backdrop',
  submitForm: 'submit:form',
  updateSelectedItems: 'update:selected-items',
  updateSelectedSelections: 'update:selected-selections',
  updateNotes: 'update:notes',
};

export default Vue.extend({
  name: 'UnavailableItemsBottomSheet',
  components: {
    VgOverlay,
    VgFlex,
    VgGrid,
    VgButton,
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
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      b2cBranchStatus: new BranchB2CStatus(''),
      selectedItems: [] as EntityId[],
      selectedSelections: [] as EntityId[],
      notes: '',
    };
  },
  computed: {
    shouldDisableConfirm(): boolean {
      return !(
        this.selectedItems.length > 0 || this.selectedSelections.length > 0
      );
    },
  },
  methods: {
    backdrop(): void {
      this.notes = '';
      this.selectedItems = [];
      this.selectedSelections = [];
      this.$emit(events.updateSelectedItems, []);
      this.$emit(events.updateNotes, '');
      this.$emit(events.updateSelectedSelections, []);
      this.$emit(events.backdrop);
    },
    discardSelections(): void {
      this.notes = '';
      this.selectedItems = [];
      this.selectedSelections = [];
      this.$emit(events.updateSelectedItems, []);
      this.$emit(events.updateNotes, '');
      this.$emit(events.updateSelectedSelections, []);
      this.$emit(events.backdrop);
    },
    confirmItemsSelection(): void {
      this.$emit(events.submitForm);
      this.selectedItems = [];
      this.selectedSelections = [];
      this.notes = '';
    },
    updateSelectedItems(): void {
      this.$emit(events.updateSelectedItems, this.selectedItems);
    },
    updateSelectedSelections(): void {
      this.$emit(events.updateSelectedSelections, this.selectedSelections);
    },
    updateNotes(): void {
      this.$emit(events.updateNotes, this.notes);
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
.item-availability-bottom-sheet {
  border-radius: 4px 0;
  background-color: var(--color-surface-light);
  &__footer {
    max-width: inherit;
    width: 600px;
    background-color: var(--color-surface-dark);
    height: 100px;
    max-height: 10vh;
    padding: 30px;
    border: 1px solid var(--color-border-light);

    &__button {
      width: calc(50% - var(--inset-small));
    }
  }
}
.selection-info-container {
  &__title {
    flex-grow: 1;
  }
  &__checkbox {
    margin-top: 0;
  }
}
.order-details-card {
  margin: var(--inset-mid);
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
    &__checkbox {
      margin-top: 0;
    }
  }
}
</style>
