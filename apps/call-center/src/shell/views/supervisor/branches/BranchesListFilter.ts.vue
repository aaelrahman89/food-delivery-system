<template>
  <vg-panel
    :title="$t('SUPERVISOR_BRANCHES_LIST_FILTERS')"
    :collapsible="collapsible"
    :collapsed="collapsed"
  >
    <div class="filter__fields">
      <div>
        <vg-text-field
          v-model="internalFilter.branchLabel"
          type="text"
          :label="$t('SUPERVISOR_BRANCHES_LIST_FILTERS_NAME')"
          prepend-inner-icon="fa-search"
          hide-details
          clearable
          outlined
        />
      </div>
      <div>
        <vg-select
          :selection.sync="internalFilter.statuses"
          :options="statusList"
          :label="$t('SUPERVISOR_BRANCHES_LIST_FILTERS_STATUS')"
          outlined
          hide-details
          clearable
          multiple
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
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

export default Vue.extend({
  name: 'BranchesListFilter',
  components: {
    VgPanel,
    VgButton,
    VgSelect,
    VgTextField,
  },
  props: {
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
