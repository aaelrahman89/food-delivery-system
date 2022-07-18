<template>
  <vg-panel
    :title="$t('ORDERS_LIST_FILTERS')"
    :collapsible="collapsible"
    :collapsed="collapsed"
  >
    <div class="filter__fields">
      <div>
        <v-autocomplete
          v-model.number="internalFilter.branchId"
          :label="$t('ORDERS_LIST_FILTERS_BRANCH')"
          hide-details
          clearable
          filled
          clear-icon="fa-times"
          color="vg-darkgrey"
          :items="branches"
          item-text="label"
          item-value="id"
          auto-select-first
          :loading="loading ? 'primary' : false"
          loader-height="5"
        />
      </div>
      <div>
        <v-text-field
          v-model="internalFilter.customerOrderId"
          type="text"
          :label="$t('ORDERS_LIST_FILTERS_CUSTOMER_ORDER_ID')"
          hide-details
          clearable
          filled
          clear-icon="fa-times"
          color="vg-darkgrey"
        />
      </div>
      <div>
        <v-text-field
          v-model="internalFilter.customerMobileNo"
          type="text"
          :label="$t('ORDERS_LIST_FILTERS_CUSTOMER_MOBILE_NO')"
          hide-details
          clearable
          filled
          clear-icon="fa-times"
          color="vg-darkgrey"
        />
      </div>
      <div>
        <v-autocomplete
          v-model="internalFilter.status"
          :label="$t('ORDERS_LIST_FILTERS_STATUS')"
          hide-details
          clearable
          filled
          clear-icon="fa-times"
          color="vg-darkgrey"
          :items="statusList"
          item-text="label"
          item-value="value"
          auto-select-first
        />
      </div>
      <div>
        <v-autocomplete
          v-model="internalFilter.scheduledTo"
          :label="$t('ORDERS_LIST_FILTERS_SCHEDULED_TO')"
          hide-details
          clearable
          filled
          multiple
          clear-icon="fa-times"
          color="vg-darkgrey"
          data-test="status-filter"
          :items="scheduledList"
        >
          <template #item="{ item }" style="border: 1px solid #000066">
            <v-chip style="width: 100%">{{ $t(item.label) }}</v-chip>
          </template>
          <template #selection="{ item }">{{ $t(item.label) }}</template>
        </v-autocomplete>
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="internalFilter.from"
          filled
          :label="$t('ORDERS_LIST_FILTERS_FROM')"
          prepend-inner-icon="fa-calendar"
          hide-details
          clearable
          clear-icon="fa-times"
          color="vg-darkgrey"
          data-test="from-filter"
        />
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="internalFilter.to"
          filled
          :label="$t('ORDERS_LIST_FILTERS_TO')"
          prepend-inner-icon="fa-calendar"
          hide-details
          clearable
          clear-icon="fa-times"
          color="vg-darkgrey"
          data-test="to-filter"
        />
      </div>
      <div>
        <v-select
          :value="internalFilter.type"
          :label="$t('ORDERS_LIST_FILTERS_TYPE')"
          hide-details
          filled
          color="vg-darkgrey"
          :items="orderTypes"
          item-text="label"
          item-value="value"
          @input="typeFilterChanged($event)"
        >
        </v-select>
      </div>
    </div>
    <div class="filter__footer">
      <div>
        <vg-button color="primary" outlined @click="resetFilter">
          {{ $t('RESET') }}
        </vg-button>
      </div>
      <div>
        <vg-button color="primary" @click="applyFilter">
          {{ $t('APPLY') }}
        </vg-button>
      </div>
    </div>
  </vg-panel>
</template>

<script>
import VgDatetimePickerLocal from '@survv/commons/components-deprecated/pickers/VgDatetimePickerLocal.vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default {
  name: 'OrdersListFilter',
  components: { VgDatetimePickerLocal, VgPanel, VgButton },
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
    scheduledList: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    orderTypes: {
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
    typeFilterChanged(value) {
      if (value === 'ERRANDS') this.internalFilter.type = ['C2C', 'ERRANDS'];
      else this.internalFilter.type = ['B2C'];
    },
  },
};
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
