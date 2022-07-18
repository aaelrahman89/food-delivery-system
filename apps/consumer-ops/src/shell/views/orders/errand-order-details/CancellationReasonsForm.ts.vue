<template>
  <vg-overlay
    :open="open"
    type="bottom-sheet"
    :max-width="maxWidth"
    @backdrop="backdrop"
  >
    <v-form @submit.prevent="submit()">
      <div class="order-cancellation-reasons-form">
        <div class="order-cancellation-reasons-form__header">
          <h1>{{ $t('Choose Cancellation Reason') }}</h1>
        </div>
        <vg-text-field
          v-model="searchToken"
          type="text"
          outlined
          max-width="100%"
          :label="'Search reasons'"
          @input="search"
        ></vg-text-field>
        <v-radio-group
          v-model="form.cancellationReasonId"
          class="radio-group-full-width"
        >
          <vg-grid gap-size="small">
            <vg-panel
              v-for="(reasons, type) in cancellationReasons"
              :key="type"
              :collapsible="true"
              :title="$t(type.toString())"
              dark
              collapsed
            >
              <v-radio
                v-for="(reason, index) in reasons"
                :key="`${type}${index}${reason.label}`"
                color="error"
                :label="reason.label"
                :value="reason.id"
              ></v-radio>
            </vg-panel>
          </vg-grid>
        </v-radio-group>
      </div>
    </v-form>
    <template v-slot:footer>
      <div class="order-cancellation-reasons-form__footer">
        <vg-flex justify-content="space-between">
          <v-switch
            v-model="form.requestRefund"
            :label="$t('CANCEL_ORDER_FORM_REFUND_REQUEST')"
            color="error"
            class="order-cancel-reasons-form__footer__switch"
          />
          <div>
            <vg-button dark @click="submit">
              {{ $t('ONLINE_ORDER_DETAILS_CANCEL') }}
            </vg-button>
          </div>
        </vg-flex>
      </div>
    </template>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { CancelErrandOrderPM } from '../../../../core/presentation-models/orders/CancelErrandOrderPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
  search: 'search',
};

export default Vue.extend({
  name: 'CancellationReasonsForm',
  components: {
    VgPanel,
    VgOverlay,
    VgTextField,
    VgGrid,
    VgFlex,
    VgButton,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: undefined,
    },
    form: {
      type: Object,
      required: true,
    },
    cancellationReasons: {
      type: Object,
      required: true,
    },
    pm: {
      type: CancelErrandOrderPM,
      required: true,
    },
  },
  data() {
    return {
      searchToken: '',
    };
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submitted);
    },
    search(): void {
      this.$emit(events.search, this.searchToken);
    },
  },
});
</script>
<style>
.v-input--selection-controls .v-input__control {
  width: 100% !important;
}
.radio-group-full-width {
  padding-top: 0;
  margin-top: 0;
}
</style>

<style scoped lang="scss">
.order-cancellation-reasons-form {
  background-color: var(--color-surface-light);
  padding: var(--inset-mid);
  &__header {
    margin-bottom: var(--inset-mid);
  }
  &__footer {
    max-width: inherit;
    width: 600px;
    background-color: var(--color-surface-dark);
    height: 100px;
    max-height: 10vh;
    padding: 30px;
    border: 1px solid var(--color-border-light);
    &__button {
      width: 91%;
    }
    &__switch {
      margin-top: var(--inset-small);
    }
  }
  &__button {
    background-color: #ffffff !important;
    &__slot {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
