<template>
  <form @submit.prevent @reset.prevent="applyFilter">
    <div>
      <vg-panel
        :title="$t('orders.list.filters.title')"
        collapsible
        :collapsed="isCollapsed"
      >
        <div class="filter__fields">
          <div>
            <vg-text-field
              v-model.trim="internalFilter.customerOrderId"
              type="text"
              outlined
              :label="$t('orders.list.filters.orderId')"
              hide-details
              clearable
            />
          </div>
          <div>
            <vg-select
              :selection.sync="internalFilter.statuses"
              :options="statusList"
              label="orders.list.filters.status"
              multiple
              outlined
              hide-details
              clearable
            >
            </vg-select>
          </div>
          <div>
            <vg-select
              :selection.sync="internalFilter.scheduled"
              :options="scheduledList"
              label="orders.list.filters.scheduledTo"
              multiple
              outlined
              hide-details
              clearable
            >
            </vg-select>
          </div>
          <div>
            <vg-text-field
              v-model.number="internalFilter.totalFrom"
              type="text"
              outlined
              :label="$t('orders.list.filters.totalFrom')"
              hide-details
              clearable
            />
          </div>
          <div>
            <vg-text-field
              v-model.number="internalFilter.totalTo"
              type="text"
              outlined
              :label="$t('orders.list.filters.totalTo')"
              hide-details
              clearable
            />
          </div>
          <div>
            <vg-datetime-picker-local
              v-model="internalFilter.creationDateFrom"
              :label="$t('orders.list.filters.from')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
              outlined
              clear-icon="fa-times"
              data-test="from-filter"
            />
          </div>
          <div>
            <vg-datetime-picker-local
              v-model="internalFilter.creationDateTo"
              :label="$t('orders.list.filters.to')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
              outlined
              clear-icon="fa-times"
              data-test="to-filter"
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
    </div>
  </form>
</template>

<script>
import VgDatetimePickerLocal from '@survv/commons/components-deprecated/pickers/VgDatetimePickerLocal.vue';
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { isEmpty } from '@survv/commons/core/utils/checks';

const events = {
  updateFilter: 'update:filter',
};
export default Vue.extend({
  name: 'OrdersListFilter',
  components: {
    VgDatetimePickerLocal,
    VgButton,
    VgSelect,
    VgTextField,
    VgPanel,
  },
  props: {
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
    filter: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      internalFilter: { ...this.filter },
      isDirty: false,
    };
  },
  computed: {
    isCollapsed() {
      return isEmpty(this.filter) && !this.isDirty;
    },
  },
  methods: {
    applyFilter() {
      this.isDirty = true;
      this.$emit(events.updateFilter, { ...this.internalFilter });
    },
    resetFilter() {
      this.isDirty = true;
      this.internalFilter = {};
      this.$emit(events.updateFilter, { ...this.internalFilter });
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
