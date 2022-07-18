<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <div class="branch-details">
      <vg-panel>
        <template #default>
          <div class="branch-details__header">
            <div class="vg-text--ellipsis">
              {{ branchName }}
            </div>
            <vg-action-menu
              :actions="generateActions()"
              color="primary"
              outlined
            ></vg-action-menu>
          </div>
          <div class="branch-details__panel">
            <div class="branch-details__panel__body">
              <div class="branch-details__panel__body__pairs">
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_WORKING_HOURS')"
                  :value="pm.branchDetails.orderingHours.toString()"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="
                    $t('ONLINE_ORDERING_BRANCHES_DETAILS_MINIMUM_ORDER_VALUE')
                  "
                  :value="pm.branchDetails.minimumOrderValue"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_STATUS')"
                  :value="
                    pm.branchDetails.active
                      ? $t('ONLINE_ORDERING_BRANCHES_DETAILS_STATUS_ENABLED')
                      : $t('ONLINE_ORDERING_BRANCHES_DETAILS_STATUS_DISABLED')
                  "
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_ACCESS_CODE')"
                  :value="pm.branchCode"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_CITY')"
                  :value="$t(pm.branchDetails.city.name)"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_AREA')"
                  :value="$t(pm.branchDetails.area.name)"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_STREET')"
                  :value="pm.branchDetails.address.street"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_BUILDING')"
                  :value="pm.branchDetails.address.building"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_STACKING')"
                  :value="
                    pm.branchDetails.stacking
                      ? $t('ONLINE_ORDERING_BRANCHES_DETAILS_STACKING_ENABLED')
                      : $t('ONLINE_ORDERING_BRANCHES_DETAILS_STACKING_DISABLED')
                  "
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="
                    $t('ONLINE_ORDERING_BRANCHES_DETAILS_MAX_STACKED_ORDERS')
                  "
                  :value="pm.branchDetails.maxStackedOrders"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="
                    $t('ONLINE_ORDERING_BRANCHES_DETAILS_STACKING_WINDOW')
                  "
                  :value="pm.branchDetails.stackingWindowInMinutes"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('ONLINE_ORDERING_BRANCHES_DETAILS_DELIVERY_FEES')"
                  :value="`${pm.branchDetails.deliveryFees.toString()} ${$t(
                    pm.branchDetails.deliveryFees.currency.toString()
                  )}`"
                  :max-width="'max-content'"
                ></vg-pair>
                <vg-pair
                  :label="$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION_TYPE')"
                  :value="pm.branchDetails.posIntegrationType"
                  :max-width="'max-content'"
                ></vg-pair>
              </div>
              <div>
                <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_DETAILS_TAGS')">
                  <vg-flex gap-size="small" align-items="center">
                    <vg-chip
                      v-for="tag in pm.branchDetails.hashTags"
                      :key="tag.id"
                      :img="tag.icon"
                    >
                      {{ $t(tag.name) }}
                    </vg-chip>
                    <vg-chip
                      v-for="tag in pm.branchDetails.tags"
                      :key="tag.id"
                      :img="tag.icon"
                    >
                      {{ $t(tag.name) }}
                    </vg-chip>
                  </vg-flex>
                </vg-panel>
              </div>
            </div>
            <div class="branch-details__panel__map">
              <zones-map
                :geojson="geoJSON(pm.branchDetails.address.coordinates)"
                :max-height="'225px'"
                :min-height="'225px'"
                :interactive="false"
              ></zones-map>
            </div>
          </div>
        </template>
      </vg-panel>

      <vg-panel
        :title="$t('ONLINE_ORDERING_BRANCHES_DETAILS_CONTACTS_TABLE_HEADER')"
      >
        <div>
          <div class="branch-details__contacts">
            <contact-person-simple-table
              :items="pm.branchDetails.contactPersons"
              :total-items-count="pm.branchDetails.contactPersons.length"
              hide-footer
              hide-actions
            ></contact-person-simple-table>
          </div>
        </div>
      </vg-panel>
    </div>
    <stacking-config-form-bottom-sheet
      :form="pm.stackingForm"
      :open="pm.shouldShowStackingForm"
      @submit="pm.submitStackingForm()"
      @discard="pm.closeStackingForm()"
      @backdrop="pm.closeStackingForm()"
    ></stacking-config-form-bottom-sheet>
  </vg-content>
</template>

<script lang="ts">
import ContactPersonSimpleTable from '../ContactPersonSimpleTable.vue';
import StackingConfigFormBottomSheet from '../stacking/StackingFormBottomSheet.ts.vue';
import VgPair from '../../../../components/VgPair.ts.vue';
import Vue from 'vue';
import ZonesMap from '../../../../components/ZonesMap.vue';
import { BranchDetailsPM } from '../../../../../core/presentation-models/branches/BranchDetailsPM';
import { BranchRepoImpl } from '../../../../repositories/restaurants/branches/BranchRepoImpl';
import {
  GeoJSONPoint,
  GeojsonFeatureCollection,
} from '@survv/commons/core/models/GeoJSON';
import { GeoRepoImpl } from '../../../../repositories/geo/GeoRepoImpl';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../../core/routes/routeNames';
import { VendorOnlineProfileRepoImpl } from '../../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'BranchDetails',
  components: {
    VgContent,
    VgPanel,
    VgChip,
    VgFlex,
    VgPair,
    VgActionMenu,
    ZonesMap,
    ContactPersonSimpleTable,
    StackingConfigFormBottomSheet,
  },
  data() {
    return {
      pm: new BranchDetailsPM({
        vendorId: parseInt(this.$route.params.vendorId, 10),
        branchId: parseInt(this.$route.params.branchId, 10),
        geoRepo: new GeoRepoImpl(),
        branchRepo: new BranchRepoImpl(),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        notificationService,
      }),
    };
  },
  computed: {
    branchName(): string {
      return this.pm.branchDetails?.displayName.en &&
        this.pm.branchDetails?.displayName.ar
        ? `${this.pm.branchDetails.displayName.en} - ${this.pm.branchDetails.displayName.ar}`
        : `${this.pm.branchDetails?.label}`;
    },
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          routeParams: { ...this.$route.params },
          text: `NAV_VENDOR_ONLINE_PROFILE_${this.$route.params.vendorType}`.toUpperCase(),
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          routeParams: { ...this.$route.params },
          text: 'NAV_VENDOR_ONLINE_PROFILE_LIST',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: this.$t(
            this.pm.vendorOnlineProfile?.name.en &&
              this.pm.vendorOnlineProfile?.name.ar
              ? this.pm.vendorOnlineProfile?.name
              : this.pm.vendorOnlineProfile?.label
          ),
        },
        {
          routeName:
            ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.$t('ONLINE_ORDERING_BRANCHES_DETAILS'),
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    generateActions() {
      return [
        {
          name: this.$t('ONLINE_ORDERING_BRANCHES_DETAILS_CONTACTS_UPDATE'),
          onClick: async (): Promise<void> => {
            await this.$router.push({
              name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_UPDATE,
              params: {
                ...this.$route.params,
              },
            });
          },
        },
        {
          name: this.$t(
            'ONLINE_ORDERING_BRANCHES_DETAILS_CONTACTS_RENEW_ACCESS_CODE'
          ),
          onClick: async (): Promise<void> => {
            await this.pm.resetBranchCode();
          },
        },
        {
          name: this.$t(
            'ONLINE_ORDERING_BRANCHES_DETAILS_CONTACTS_SET_BRANCH_STACKING'
          ),
          onClick: (): void => {
            this.pm.openStackingForm();
          },
        },
        {
          name: this.$t(
            'ONLINE_ORDERING_BRANCHES_DETAILS_CONTACTS_DISABLE_BRANCH_STACKING'
          ),
          onClick: async (): Promise<void> => {
            await this.pm.disableStacking();
          },
        },
      ];
    },
    geoJSON(coordinates: GeojsonCoordinates): GeojsonFeatureCollection {
      return {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: new GeoJSONPoint(
              coordinates.length
                ? coordinates
                : [31.425962448120117, 30.003780534938077]
            ),
            properties: {
              dataType: 'CUSTOMER_LOCATION',
            },
          },
        ],
      };
    },
  },
});
</script>

<style scoped lang="scss">
.branch-details {
  display: flex;
  flex-direction: column;
  gap: var(--inset-large);

  &__panel {
    display: flex;
    flex-direction: row;
    gap: var(--inset-large);

    &__body {
      display: flex;
      flex-direction: column;
      gap: var(--inset-large);
      width: max-content;
      &__pairs {
        display: flex;
        flex-direction: row;
        gap: var(--inset-large);
        flex-wrap: wrap;
      }
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: var(--inset-large);
  }
}
</style>
