<template>
  <div>
    <vg-flex gap-size="mid" align-items="center">
      <div>
        <vg-select
          :selection="filter.cityId"
          :options="citiesList"
          label="LIVE_OPS_ORDERS_OVERVIEW_FILTER_CITY"
          outlined
          hide-details
          max-width="303px"
          width="303px"
          @update:selection="citySelected($event)"
        >
        </vg-select>
      </div>
      <div>
        <vg-select
          :selection="filter.areaId"
          :options="areasList"
          label="LIVE_OPS_ORDERS_OVERVIEW_FILTER_AREA"
          outlined
          hide-details
          max-width="303px"
          width="303px"
          @update:selection="areaSelected($event)"
        >
        </vg-select>
      </div>
      <div>
        <vg-select
          :selection.sync="filter.hubIds"
          :options="hubsList"
          label="LIVE_OPS_ORDERS_OVERVIEW_FILTER_HUB"
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
          :selection.sync="filter.types"
          :options="orderTypesList"
          label="LIVE_OPS_ORDERS_OVERVIEW_FILTER_SERVICE"
          outlined
          hide-details
          clearable
          multiple
          max-width="303px"
          width="303px"
        >
        </vg-select>
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
        <vg-button
          type="submit"
          :disabled="shouldDisableApplyButton"
          @click="applyFilter"
        >
          {{ $t('LIVE_OPS_ORDERS_OVERVIEW_FILTER_APPLY') }}
        </vg-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Area } from '../../../../core/models/Area';
import { City } from '../../../../core/models/City';
import { EntityId } from '@survv/commons/core/types';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { Hub } from '../../../../core/models/Hub';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { PropValidator } from 'vue/types/options';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  updateFilter: 'update:filter',
  citySelected: 'city:selected',
  areaSelected: 'area:selected',
};

export default Vue.extend({
  name: 'OverviewModeFilter',
  components: {
    VgFlex,
    VgButton,
    VgSelect,
  },
  props: {
    queryFilter: {
      type: Object,
      default(): unknown {
        return {};
      },
    } as PropValidator<ListingQuery['filter']>,
    citiesList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<City>[]>,
    areasList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<Area>[]>,
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
    filterValid: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      filter: {} as ListingQuery['filter'],
    };
  },
  computed: {
    shouldDisableApplyButton(): boolean {
      return (
        this.filter?.cityId == undefined || this.filter?.areaId == undefined
      );
    },
  },
  created(): void {
    this.filter = { ...this.queryFilter };
  },
  methods: {
    applyFilter(): void {
      this.$emit(events.updateFilter, this.filter);
    },
    citySelected(cityId: EntityId): void {
      this.filter = { cityId };
      this.$emit(events.citySelected, cityId);
    },
    areaSelected(areaId: EntityId): void {
      this.filter = { ...this.filter, areaId };
      this.$emit(events.areaSelected, areaId);
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
.monthly-billing-cycle-picker {
  max-width: 240px;
}
</style>
