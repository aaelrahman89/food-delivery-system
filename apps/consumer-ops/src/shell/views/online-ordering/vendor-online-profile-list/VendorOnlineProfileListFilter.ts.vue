<template>
  <vg-panel
    collapsible
    :title="$t('VENDOR_ONLINE_PROFILE_LIST_FILTER_TITLE')"
    class=""
  >
    <vg-flex
      gap-size="mid"
      justify-content="flex-start"
      flex-direction="column"
    >
      <div>
        <vg-text-field
          v-model="internalFilter.label"
          :label="$t('VENDOR_ONLINE_PROFILE_LIST_FILTER_LABEL')"
          type="text"
          outlined
          hide-details
          clearable
        ></vg-text-field>
      </div>
      <div>
        <vg-panel
          :title="$t('VENDOR_ONLINE_PROFILE_LIST_FILTER_CATALOGUE_STATUS')"
        >
          <div class="vendor-online-profile-list-filter__card">
            <div
              v-for="(option, index) in catalogueStatusOptions"
              :key="index"
              class="vendor-online-profile-list-filter__card__option"
            >
              <vg-checkbox
                class="
                  vendor-online-profile-list-filter__card__option__checkbox
                "
                :value="isSelectedCatalogueStatus(option.value)"
                hide-details
                @input="updateStatusFilter(option.value)"
              ></vg-checkbox>
              <div class="vendor-online-profile-list-filter__card__value">
                {{ $t(option.label) }}
              </div>
            </div>
          </div>
        </vg-panel>
      </div>
      <div>
        <vg-panel
          :title="$t('VENDOR_ONLINE_PROFILE_LIST_FILTER_VENDOR_STATUS')"
        >
          <div class="vendor-online-profile-list-filter__card">
            <div class="vendor-online-profile-list-filter__card__option">
              <vg-checkbox
                class="
                  vendor-online-profile-list-filter__card__option__checkbox
                "
                :value="isSelectedVendorStatus(true)"
                hide-details
                @input="updateVendorFilter(true)"
              ></vg-checkbox>
              <div class="vendor-online-profile-list-filter__card__value">
                {{ $t('ENABLED') }}
              </div>
            </div>
            <div class="vendor-online-profile-list-filter__card__option">
              <vg-checkbox
                class="
                  vendor-online-profile-list-filter__card__option__checkbox
                "
                :value="isSelectedVendorStatus(false)"
                hide-details
                @input="updateVendorFilter(false)"
              ></vg-checkbox>
              <div class="vendor-online-profile-list-filter__card__value">
                {{ $t('DISABLED') }}
              </div>
            </div>
            <div class="vendor-online-profile-list-filter__card__option">
              <vg-checkbox
                class="
                  vendor-online-profile-list-filter__card__option__checkbox
                "
                :value="isPosIntegrated(false)"
                hide-details
                @input="updatePosIntegrationStatus($event)"
              ></vg-checkbox>
              <div class="vendor-online-profile-list-filter__card__value">
                POS Integrated
              </div>
            </div>
          </div>
        </vg-panel>
      </div>
      <vg-flex gap-size="mid" justify-content="flex-start">
        <div>
          <vg-button outlined @click="resetFilter">{{
            $t('VENDOR_ONLINE_PROFILE_LIST_FILTER_RESET')
          }}</vg-button>
        </div>
        <div>
          <vg-button @click="updateFilter">{{
            $t('VENDOR_ONLINE_PROFILE_LIST_FILTER_APPLY')
          }}</vg-button>
        </div>
      </vg-flex>
    </vg-flex>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { CatalogueStatus } from '../../../../core/models/Catalogue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  updateFilter: 'update:filter',
};

export default Vue.extend({
  name: 'VendorOnlineProfileListFilter',
  components: { VgFlex, VgPanel, VgTextField, VgCheckbox, VgButton },
  props: {
    filter: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
    catalogueStatusOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      internalFilter: this.filter,
    };
  },
  methods: {
    isSelectedCatalogueStatus(status: CatalogueStatus): boolean {
      return (
        this.internalFilter.catalogueStatus?.includes(status.valueOf()) ?? false
      );
    },
    isSelectedVendorStatus(status: boolean): boolean {
      return this.internalFilter.vendorStatus?.includes(status) ?? false;
    },
    isPosIntegrated(): boolean {
      return !!this.internalFilter.posIntegrated;
    },
    updatePosIntegrationStatus(status: boolean): void {
      if (!status) this.internalFilter.posIntegrated = undefined;
      else this.internalFilter.posIntegrated = status;
    },
    updateVendorFilter(status: boolean): void {
      if (this.isSelectedVendorStatus(status)) {
        this.internalFilter = {
          ...this.internalFilter,
          vendorStatus: this.internalFilter.vendorStatus.filter(
            (statusValue: boolean) => status != statusValue
          ),
        };
      } else {
        this.internalFilter = {
          ...this.internalFilter,
          vendorStatus: [...(this.internalFilter.vendorStatus ?? []), status],
        };
      }
    },
    updateStatusFilter(status: CatalogueStatus): void {
      if (this.isSelectedCatalogueStatus(status)) {
        this.internalFilter = {
          ...this.internalFilter,
          catalogueStatus: this.internalFilter.catalogueStatus.filter(
            (statusValue: string) => status.notEqual(statusValue)
          ),
        };
      } else {
        this.internalFilter = {
          ...this.internalFilter,
          catalogueStatus: [
            ...(this.internalFilter.catalogueStatus ?? []),
            status.valueOf(),
          ],
        };
      }
    },
    updateFilter(): void {
      this.$emit(events.updateFilter, this.internalFilter);
    },
    resetFilter(): void {
      this.internalFilter = {};
      this.$emit(events.updateFilter, this.internalFilter);
    },
  },
});
</script>

<style scoped lang="scss">
.vendor-online-profile-list-filter {
  &__card {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    &__option {
      display: flex;
      flex-flow: row wrap;
      align-items: baseline;
      padding-inline-end: var(--inset-large);

      &__checkbox {
        margin: 0;
      }
    }
  }
}
</style>
