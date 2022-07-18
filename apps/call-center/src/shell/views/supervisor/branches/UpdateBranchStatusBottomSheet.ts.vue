<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <div class="update-branch-status">
      <div class="update-branch-status__header">
        <h1>
          {{
            $t('SUPERVISOR_BRANCHES_LIST_UPDATE_BRANCH_STATUS_FORM_TITLE', {
              label: branchLabel,
            })
          }}
        </h1>
      </div>
      <vg-panel>
        <div class="update-branch-status__body">
          <v-radio-group v-model="form.status" class="radio-group-full-width">
            <vg-grid gap-size="small">
              <vg-panel
                v-for="(status, index) in branchStatusList"
                :key="`${index}${status.valueOf()}`"
              >
                <v-radio
                  color="error"
                  :label="status.label"
                  :value="status.valueOf()"
                />
              </vg-panel>
            </vg-grid>
          </v-radio-group>
        </div>
      </vg-panel>
      <div class="update-branch-status__footer">
        <div>
          <vg-button expand outlined @click="discard">
            {{ $t('DISCARD') }}
          </vg-button>
        </div>
        <div>
          <vg-button expand :disabled="!form.status" @click="submit">
            {{ $t('CONFIRM') }}
          </vg-button>
        </div>
      </div>
    </div>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'UpdateBranchStatusBottomSheet',
  components: {
    VgPanel,
    VgOverlay,
    VgButton,
    VgGrid,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '700px',
    },
    form: {
      type: Object,
      required: true,
    },
    branchLabel: {
      type: String,
      required: true,
    },
    branchStatusList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    backdrop(): void {
      this.form.status = {};
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.form.status = {};
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submitted, this.form.status.value);
    },
  },
});
</script>

<style scoped lang="scss">
.update-branch-status {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);
  padding: var(--inset-mid);

  &__header {
    margin-bottom: var(--inset-mid);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--inset-large);

    &__row {
      display: flex;
      flex-direction: row;
      gap: var(--inset-large);

      &__field {
        flex-grow: 1;
      }
    }
  }

  &__footer {
    margin-top: var(--inset-mid);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: var(--inset-large);
  }
}
</style>
