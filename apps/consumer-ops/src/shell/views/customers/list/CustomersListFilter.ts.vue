<template>
  <vg-panel collapsible :title="$t('FILTERS')">
    <vg-flex
      gap-size="mid"
      justify-content="flex-start"
      flex-direction="column"
    >
      <div>
        <vg-flex
          class="customers-list-filter"
          gap-size="mid"
          align-items="center"
        >
          <div class="customers-list-filter__item">
            <vg-text-field
              v-model="filter.name"
              type="text"
              label="CUSTOMERS_LIST_FILTER_NAME"
              hide-details
              clearable
              outlined
            ></vg-text-field>
          </div>
          <div class="customers-list-filter__item">
            <vg-text-field
              v-model="filter.mobileNo"
              type="text"
              label="CUSTOMERS_LIST_FILTER_MOBILE_NUMBER"
              hide-details
              clearable
              outlined
            ></vg-text-field>
          </div>
          <div class="customers-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.creationDateFrom"
              outlined
              :label="$t('CUSTOMERS_LIST_FILTER_CREATION_DATE_FROM')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
            />
          </div>
          <div class="customers-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.creationDateTo"
              outlined
              :label="$t('CUSTOMERS_LIST_FILTER_CREATION_DATE_TO')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
            />
          </div>
        </vg-flex>
      </div>
      <div>
        <vg-flex gap-size="mid" justify-content="flex-end">
          <div>
            <vg-button type="reset" outlined @click="resetFilter">{{
              $t('CLEAR_FILTERS')
            }}</vg-button>
          </div>
          <div>
            <vg-button type="submit" @click="applyFilter">{{
              $t('APPLY_FILTERS')
            }}</vg-button>
          </div>
        </vg-flex>
      </div>
    </vg-flex>
  </vg-panel>
</template>

<script lang="ts">
import VgDatetimePickerLocal from '@survv/commons/components-deprecated/pickers/VgDatetimePickerLocal.vue';
import Vue from 'vue';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { PropValidator } from 'vue/types/options';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateFilter: 'update:filter',
};

export default Vue.extend({
  name: 'CustomersListFilter',
  components: {
    VgFlex,
    VgTextField,
    VgButton,
    VgPanel,
    VgDatetimePickerLocal,
  },
  props: {
    queryFilter: {
      type: Object,
      default(): unknown {
        return {};
      },
    } as PropValidator<ListingQuery['filter']>,
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
.customers-list-filter {
  &__item {
    min-width: 240px;
    max-width: 240px;
  }
}
</style>
