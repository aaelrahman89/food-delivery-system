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
      <div class="item-availability-bottom-sheet__header">
        <h1>{{ title }}</h1>
      </div>
      <v-radio-group
        v-model="b2cBranchStatus"
        class="radio-group-full-width"
        @change="updateBranchStatus"
      >
        <vg-grid gap-size="small">
          <vg-panel
            v-for="(status, index) in branchStatusList"
            :key="`${index}${status.valueOf()}`"
          >
            <v-radio
              color="error"
              :label="$t(status)"
              :value="status.valueOf()"
            ></v-radio>
          </vg-panel>
        </vg-grid>
      </v-radio-group>
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
            @click="confirmBranchStatusSelection"
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
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  backdrop: 'backdrop',
  submitForm: 'submit:form',
  updateB2CBranchStatus: 'update:b2c-branch-status',
};

export default Vue.extend({
  name: 'BranchBusyBottomSheet',
  components: {
    VgOverlay,
    VgFlex,
    VgButton,
    VgPanel,
    VgGrid,
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
    branchStatusList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      b2cBranchStatus: new BranchB2CStatus(''),
    };
  },
  computed: {
    shouldDisableConfirm(): boolean {
      return this.b2cBranchStatus.valueOf() === '';
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
      this.b2cBranchStatus = new BranchB2CStatus('');
    },
    discardSelections(): void {
      this.$emit(events.backdrop);
      this.b2cBranchStatus = new BranchB2CStatus('');
    },
    confirmBranchStatusSelection(): void {
      this.$emit(events.submitForm);
      this.b2cBranchStatus = new BranchB2CStatus('');
    },
    updateBranchStatus(): void {
      this.$emit(events.updateB2CBranchStatus, this.b2cBranchStatus);
    },
  },
});
</script>

<style scoped lang="scss">
.v-input--selection-controls .v-input__control {
  width: 100% !important;
}
.item-availability-bottom-sheet {
  border-radius: 4px 0;
  background-color: var(--color-surface-light);
  padding: var(--inset-mid);

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
