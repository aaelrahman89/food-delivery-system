<template>
  <vg-panel collapsible :title="$t('FILTERS')">
    <vg-flex
      gap-size="mid"
      justify-content="flex-start"
      flex-direction="column"
    >
      <div>
        <vg-flex
          class="campaigns-list-filter"
          gap-size="mid"
          align-items="center"
        >
          <vg-text-field
            v-model="filter.name"
            class="campaigns-list-filter__item"
            type="text"
            label="CAMPAIGNS_LIST_FILTER_NAME"
            hide-details
            clearable
            outlined
          ></vg-text-field>
          <vg-select
            :selection.sync="filter.branchId"
            :options="branchesList"
            label="CAMPAIGNS_LIST_FILTER_BRANCH"
            outlined
            hide-details
            clearable
            :translatable="false"
            :loading="branchesLoading"
          >
          </vg-select>
          <vg-select
            :selection.sync="filter.area"
            :options="areasList"
            label="CAMPAIGNS_LIST_FILTER_AREA"
            outlined
            hide-details
            clearable
            multiple
            :loading="areasLoading"
          >
          </vg-select>
          <vg-select
            :selection.sync="filter.tag"
            :options="tagsList"
            label="CAMPAIGNS_LIST_FILTER_HASH_TAG"
            outlined
            hide-details
            clearable
            multiple
            :loading="hashtagsLoading"
          >
          </vg-select>
          <vg-select
            :selection.sync="filter.status"
            :options="statusList"
            label="CAMPAIGNS_LIST_FILTER_STATUS"
            outlined
            hide-details
            clearable
            multiple
          >
          </vg-select>
          <vg-text-field
            v-model="filter.promoCodeName"
            class="campaigns-list-filter__item"
            type="text"
            label="CAMPAIGNS_LIST_FILTER_PROMO_CODE_NAME"
            hide-details
            clearable
            outlined
          ></vg-text-field>
          <vg-text-field
            v-model="filter.createdBy"
            class="campaigns-list-filter__item"
            type="text"
            label="CAMPAIGNS_LIST_FILTER_CREATED_BY"
            hide-details
            clearable
            outlined
          ></vg-text-field>
          <vg-select
            :selection.sync="filter.usageType"
            :options="usageTypesList"
            label="CAMPAIGNS_LIST_FILTER_USAGE_TYPE"
            outlined
            hide-details
            clearable
            multiple
          >
          </vg-select>
          <vg-select
            :selection.sync="filter.service"
            :options="servicesList"
            label="CAMPAIGNS_LIST_FILTER_SERVICE"
            outlined
            hide-details
            clearable
            multiple
          >
          </vg-select>
        </vg-flex>
      </div>
      <div>
        <vg-flex
          class="campaigns-list-filter"
          gap-size="mid"
          align-items="center"
        >
          <div class="campaigns-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.startDateFrom"
              outlined
              :label="$t('CAMPAIGNS_LIST_FILTER_START_DATE_FROM')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
            />
          </div>
          <div class="campaigns-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.startDateTo"
              outlined
              :label="$t('CAMPAIGNS_LIST_FILTER_START_DATE_TO')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
            />
          </div>
          <div class="campaigns-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.endDateFrom"
              outlined
              :label="$t('CAMPAIGNS_LIST_FILTER_END_DATE_FROM')"
              prepend-inner-icon="fa-calendar"
              hide-details
              clearable
            />
          </div>
          <div class="campaigns-list-filter__item">
            <vg-datetime-picker-local
              v-model="filter.endDateTo"
              outlined
              :label="$t('CAMPAIGNS_LIST_FILTER_END_DATE_TO')"
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
              $t('CAMPAIGNS_LIST_FILTER_CLEAR_FILTERS')
            }}</vg-button>
          </div>
          <div>
            <vg-button type="submit" @click="applyFilter">{{
              $t('CAMPAIGNS_LIST_FILTER_APPLY_FILTERS')
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
import { Area } from '../../../../core/models/Area';
import { Branch } from '../../../../core/models/Branch';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HashTag } from '../../../../core/models/HashTag';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { PropValidator } from 'vue/types/options';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateFilter: 'update:filter',
};

export default Vue.extend({
  name: 'CampaignsListFilter',
  components: {
    VgFlex,
    VgDatetimePickerLocal,
    VgTextField,
    VgButton,
    VgPanel,
    VgSelect,
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
    areasList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<Area>[]>,
    tagsList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<HashTag>[]>,
    statusList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<string>[]>,
    servicesList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<string>[]>,
    usageTypesList: {
      type: Array,
      default(): [] {
        return [];
      },
    } as PropValidator<FormSelectionOption<string>[]>,
    branchesLoading: {
      type: Boolean,
      required: true,
    },
    areasLoading: {
      type: Boolean,
      required: true,
    },
    hashtagsLoading: {
      type: Boolean,
      required: true,
    },
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
.campaigns-list-filter {
  &__item {
    min-width: 240px;
    max-width: 240px;
  }
}
</style>
