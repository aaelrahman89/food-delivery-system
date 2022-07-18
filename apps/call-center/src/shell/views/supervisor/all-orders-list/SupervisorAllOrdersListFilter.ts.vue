<template>
  <vg-panel
    :title="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS')"
    :collapsible="collapsible"
    :collapsed="collapsed"
  >
    <div class="filter__fields">
      <div>
        <vg-text-field
          v-model="internalFilter.vendorOrderId"
          type="text"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_VENDOR_ORDER_ID')"
          hide-details
          clearable
          outlined
        />
      </div>
      <div>
        <vg-text-field
          v-model="internalFilter.customerOrderId"
          type="text"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_CUSTOMER_ORDER_ID')"
          hide-details
          clearable
          outlined
        />
      </div>
      <div>
        <vg-select
          :selection.sync="internalFilter.branchIds"
          :options="branches"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_BRANCH')"
          outlined
          hide-details
          clearable
          multiple
          :translatable="false"
        />
      </div>
      <div>
        <vg-select
          :selection.sync="internalFilter.statuses"
          :options="statusList"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_STATUS')"
          outlined
          hide-details
          clearable
          multiple
        />
      </div>
      <div>
        <vg-text-field
          v-model="internalFilter.agent"
          type="text"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_AGENT')"
          hide-details
          clearable
          outlined
        />
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="internalFilter.from"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_FROM')"
          append-icon="fa-calendar"
          hide-details
          clearable
          outlined
          clear-icon="fa-times"
        />
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="internalFilter.to"
          :label="$t('SUPERVISOR_ALL_ORDERS_LIST_FILTERS_TO')"
          append-icon="fa-calendar"
          hide-details
          clearable
          outlined
          clear-icon="fa-times"
        />
      </div>
    </div>
    <div class="filter__footer">
      <div>
        <vg-button color="primary" outlined @click="resetFilter">
          {{ $t('CLEAR_FILTERS') }}
        </vg-button>
      </div>
      <div>
        <vg-button color="primary" @click="applyFilter">
          {{ $t('APPLY_FILTERS') }}
        </vg-button>
      </div>
    </div>
  </vg-panel>
</template>

<script lang="ts">
import VgDatetimePickerLocal from '@survv/commons/components-deprecated/pickers/VgDatetimePickerLocal.vue';
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

export default Vue.extend({
  name: 'SupervisorAllOrdersListFilter',
  components: {
    VgDatetimePickerLocal,
    VgPanel,
    VgButton,
    VgSelect,
    VgTextField,
  },
  props: {
    branches: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    statusList: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    filter: {
      type: Object,
      default() {
        return {};
      },
    },
    collapsed: {
      type: Boolean,
      default() {
        return false;
      },
    },
    collapsible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      internalFilter: { ...this.filter },
    };
  },
  methods: {
    applyFilter() {
      this.$emit('update:filter', { ...this.internalFilter });
    },
    resetFilter() {
      this.internalFilter = {};
      this.$emit('update:filter', { ...this.internalFilter });
    },
  },
});
</script>

<style lang="scss" scoped>
.filter {
  &__fields {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--inset-mid);
    margin-bottom: var(--inset-mid);
  }
  &__footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: var(--inset-mid);
    padding-top: var(--inset-mid);
    border-top: 1px #787878 dashed;
  }
}
</style>
