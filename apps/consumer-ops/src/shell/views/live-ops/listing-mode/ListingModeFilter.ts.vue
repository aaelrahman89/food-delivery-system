<template>
  <div>
    <vg-flex gap-size="mid" align-items="center">
      <div>
        <vg-text-field
          v-model="filter.customerOrderId"
          type="text"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_CUSTOMER_ORDER_ID"
          hide-details
          clearable
          outlined
          max-width="303px"
          width="303px"
        ></vg-text-field>
      </div>
      <div>
        <vg-text-field
          v-model="filter.customerMobileNo"
          type="text"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_CUSTOMER_MOBILE_NUMBER"
          hide-details
          clearable
          outlined
          max-width="303px"
          width="303px"
        ></vg-text-field>
      </div>
      <div>
        <vg-select
          :selection.sync="filter.types"
          :options="orderTypesList"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_SERVICE"
          outlined
          hide-details
          clearable
          multiple
          max-width="303px"
          width="303px"
        >
        </vg-select>
      </div>
      <div>
        <vg-select
          :selection.sync="filter.statuses"
          :options="orderStatusList"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_STATUS"
          outlined
          hide-details
          clearable
          multiple
          max-width="303px"
          width="303px"
        >
        </vg-select>
      </div>
      <div>
        <vg-select
          :selection.sync="filter.branchIds"
          :options="branchesList"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_BRANCH"
          outlined
          hide-details
          clearable
          multiple
          max-width="303px"
          width="303px"
          :translatable="false"
        >
        </vg-select>
      </div>
      <div>
        <vg-select
          :selection.sync="filter.hubIds"
          :options="hubsList"
          label="LIVE_OPS_ORDERS_LISTING_FILTER_HUB"
          outlined
          hide-details
          clearable
          multiple
          max-width="303px"
          width="303px"
          :translatable="false"
        >
        </vg-select>
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="filter.from"
          outlined
          :label="$t('LIVE_OPS_ORDERS_LISTING_FILTER_CREATION_DATE_FROM')"
          prepend-inner-icon="fa-calendar"
          hide-details
          clearable
          max-width="303px"
          width="303px"
        />
      </div>
      <div>
        <vg-datetime-picker-local
          v-model="filter.to"
          outlined
          :label="$t('LIVE_OPS_ORDERS_LISTING_FILTER_CREATION_DATE_TO')"
          prepend-inner-icon="fa-calendar"
          hide-details
          clearable
          max-width="303px"
          width="303px"
        />
      </div>
    </vg-flex>
    <div
      class="
        vg-margin-block-start--large
        vg-padding-block-start--large
        button-container
      "
    >
      <div class="vg-margin-inline-end--mid">
        <vg-button type="submit" @click="applyFilter">
          {{ $t('LIVE_OPS_ORDERS_LISTING_FILTER_APPLY') }}
        </vg-button>
      </div>
      <div>
        <vg-button type="reset" outlined @click="resetFilter">
          {{ $t('LIVE_OPS_ORDERS_LISTING_FILTER_RESET') }}
        </vg-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VgDatetimePickerLocal from '@survv/commons/components-deprecated/pickers/VgDatetimePickerLocal.vue';
import Vue from 'vue';
import { Branch } from '../../../../core/models/Branch';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { Hub } from '../../../../core/models/Hub';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { OrderStatus } from '../../../../core/models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { PropValidator } from 'vue/types/options';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateFilter: 'update:filter',
};

export default Vue.extend({
  name: 'ListingModeFilter',
  components: {
    VgFlex,
    VgButton,
    VgSelect,
    VgDatetimePickerLocal,
    VgTextField,
  },
  props: {
    queryFilter: {
      type: Object,
      default(): unknown {
        return {};
      },
    } as PropValidator<ListingQuery['filter']>,
    branchesList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<Branch>[]>,
    hubsList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<Hub>[]>,
    orderTypesList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<OrderType>[]>,
    orderStatusList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<OrderStatus>[]>,
  },
  data() {
    return {
      filter: {} as ListingQuery['filter'],
    };
  },
  created(): void {
    this.filter = { ...this.queryFilter };
  },
  methods: {
    applyFilter(): void {
      this.$emit(events.updateFilter, this.filter);
    },
    resetFilter(): void {
      this.filter = {};
      this.$emit(events.updateFilter);
    },
  },
});
</script>

<style scoped lang="scss">
.button-container {
  display: flex;
  justify-content: flex-end;
  border-top: 1px #787878 dashed;
}
</style>
