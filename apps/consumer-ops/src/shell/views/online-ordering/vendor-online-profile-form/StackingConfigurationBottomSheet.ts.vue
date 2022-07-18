<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <div class="bottom-sheet">
      <div class="bottom-sheet__header">
        <h3>
          {{ $t('VENDOR_ONLINE_PROFILE_SET_VENDOR_STACKING') }}
        </h3>
      </div>
      <div class="bottom-sheet__body">
        <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_STACKING_PER_BRANCH')">
          <vg-flex gap-size="small" flex-direction="row">
            <vg-text-field
              type="number"
              :value="averagePreparationTime"
              outlined
              disabled
              label="STACKING_CONFIGURATION_AVERAGE_PREPARATION_TIME"
              max-width="100%"
            ></vg-text-field>
            <vg-text-field
              :value="maxStackedOrders"
              type="number"
              :validator="validators['maxStackedOrders']"
              required
              outlined
              clearable
              label="STACKING_CONFIGURATION_MAX_STACKED_ORDERS"
              max-width="100%"
              @input="updateMaxStackedOrders"
            ></vg-text-field>
            <vg-text-field
              :value="stackingWindowInMinutes"
              type="number"
              :validator="validators['stackingWindowInMinutes']"
              required
              outlined
              clearable
              label="STACKING_CONFIGURATION_WINDOW_IN_MINUTES"
              max-width="100%"
              @input="updateStackingWindow"
            ></vg-text-field>
          </vg-flex>
        </vg-panel>
      </div>
      <div class="bottom-sheet__actions">
        <vg-flex
          flex-direction="row"
          justify-content="flex-end"
          gap-size="small"
        >
          <div>
            <vg-button large outlined @click="discard">
              {{ $t('DISCARD') }}
            </vg-button>
          </div>
          <div>
            <vg-button large :disabled="!canSubmit" @click="submit">
              {{ $t('SAVE_CHANGES') }}
            </vg-button>
          </div>
        </vg-flex>
      </div>
    </div>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateMaxStackedOrders: 'update:maxStackedOrders',
  updateStackingWindow: 'update:stackingWindowInMinutes',
  backdrop: 'backdrop',
  close: 'close',
  discard: 'discard',
  submit: 'submit',
};

export default Vue.extend({
  name: 'StackingConfigurationBottomSheet',
  components: { VgOverlay, VgFlex, VgPanel, VgButton, VgTextField },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    averagePreparationTime: {
      type: Number,
      required: true,
    },
    maxStackedOrders: {
      type: Number,
      required: true,
    },
    stackingWindowInMinutes: {
      type: Number,
      required: true,
    },
    canSubmit: {
      type: Boolean,
      default: false,
    },
    validators: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateMaxStackedOrders(val: string): void {
      this.$emit(events.updateMaxStackedOrders, Number(val));
    },
    updateStackingWindow(val: string): void {
      this.$emit(events.updateStackingWindow, Number(val));
    },
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    close(): void {
      this.$emit(events.close);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submit);
    },
  },
});
</script>

<style lang="scss" scoped>
.bottom-sheet {
  background-color: var(--color-surface-light);
  padding: var(--inset-large) 0;

  &__header {
    font-weight: 600;
    font-size: 32px;
    padding: var(--inset-small) var(--inset-large);
  }

  &__body {
    padding: var(--inset-small) var(--inset-large);
  }

  &__actions {
    padding: var(--inset-large);
  }
  .vg-text-field {
    flex: 1;
  }
}
</style>
