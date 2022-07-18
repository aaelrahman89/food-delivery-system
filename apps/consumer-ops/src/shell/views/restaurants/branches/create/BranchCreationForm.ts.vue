<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_BRANCH_INFO')">
      <div class="branch-creation-form">
        <vg-panel>
          <div class="branch-creation-form__switch-component">
            <div class="branch-creation-form__switch-component__switch-label">
              {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_ENABLE_BRANCH_STATUS') }}
            </div>
            <vg-switch
              v-model="pm.form.active"
              :hide-details="true"
              class="branch-creation-form__switch-component__switch-trigger"
            ></vg-switch>
          </div>
        </vg-panel>
        <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_DISPLAY_NAME')">
          <div class="branch-creation-form__rows__row-items">
            <vg-text-field
              v-model="pm.form.displayName.en"
              :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_ENGLISH')"
              :validator="pm.form.validators['displayName.en']"
              type="text"
              required
              outlined
            ></vg-text-field>
            <vg-text-field
              v-model="pm.form.displayName.ar"
              :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_ARABIC')"
              :validator="pm.form.validators['displayName.ar']"
              type="text"
              required
              outlined
            ></vg-text-field>
            <vg-text-field
              v-model="pm.form.label"
              :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_LABEL')"
              :validator="pm.form.validators['label']"
              type="text"
              required
              outlined
            ></vg-text-field>
          </div>
        </vg-panel>

        <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_ATTRIBUTES')">
          <div class="branch-creation-form__rows">
            <div class="branch-creation-form__rows__row-items">
              <vg-time-picker
                v-model="pm.form.opensAt"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_OPENS_AT')"
                :validator="pm.form.validators['opensAt']"
                required
                outlined
              ></vg-time-picker>
              <vg-time-picker
                v-model="pm.form.closesAt"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_CLOSES_AT')"
                :validator="pm.form.validators['closesAt']"
                required
                outlined
              ></vg-time-picker>
              <vg-text-field
                v-model="pm.form.minimumOrderValue"
                :label="
                  $t('ONLINE_ORDERING_BRANCHES_CREATION_MINIMUM_ORDER_VALUE')
                "
                :validator="pm.form.validators['minimumOrderValue']"
                type="number"
                required
                outlined
              ></vg-text-field>
            </div>
            <div class="branch-creation-form__rows__row-items">
              <vg-text-field
                v-model="pm.form.deliveryFees"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_DELIVERY_FEES')"
                :validator="pm.form.validators['deliveryFees']"
                type="number"
                required
                outlined
              />
              <vg-text-field
                v-model="pm.form.averageBasketSize"
                :label="
                  $t('ONLINE_ORDERING_BRANCHES_CREATION_AVERAGE_BASKET_SIZE')
                "
                :validator="pm.form.validators['averageBasketSize']"
                type="number"
                required
                outlined
              ></vg-text-field>
            </div>
          </div>
        </vg-panel>
        <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_TAGS')">
          <vg-flex gap-size="small" align-items="center">
            <vg-chip
              v-for="tag in pm.form.tags"
              :key="tag.id"
              :img="tag.icon"
              @cancel="pm.removeTagSelection(index)"
            >
              {{ $t(tag.name) }}
            </vg-chip>
            <div>
              <vg-button
                class="add-button"
                outlined
                icon
                :loading="pm.loading"
                :disabled="pm.loading"
                @click="pm.openSelectionsList()"
              >
                <svg viewBox="0 0 448 448" class="add-button__icon">
                  <path
                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
                  />
                </svg>
              </vg-button>
            </div>
          </vg-flex>
        </vg-panel>

        <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_LOCATION')">
          <vg-grid gap-size="mid" columns="1fr 1fr 1fr">
            <vg-flex gap-size="large" flex-direction="column">
              <vg-select
                :selection.sync="pm.form.address.countryId"
                :options="pm.countriesSelection"
                :validator="pm.form.validators['address.countryId']"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_COUNTRY')"
                max-width="100%"
                outlined
                required
                @update:selection="pm.hydrateCities($event)"
              >
              </vg-select>
              <vg-select
                :selection.sync="pm.form.address.areaId"
                :options="pm.areasSelection"
                :validator="pm.form.validators['address.areaId']"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_AREA')"
                max-width="100%"
                outlined
                required
              >
              </vg-select>
              <vg-text-field
                v-model="pm.form.address.building"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_BUILDING')"
                max-width="100%"
                type="text"
                hide-details
                outlined
              ></vg-text-field>
            </vg-flex>
            <vg-flex gap-size="large" flex-direction="column">
              <vg-select
                :selection.sync="pm.form.address.cityId"
                :options="pm.citiesSelection"
                :validator="pm.form.validators['address.cityId']"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_CITY')"
                max-width="100%"
                outlined
                required
                @update:selection="pm.hydrateAreas($event)"
              >
              </vg-select>
              <vg-text-field
                v-model="pm.form.address.street"
                :label="$t('ONLINE_ORDERING_BRANCHES_CREATION_STREET')"
                max-width="100%"
                type="text"
                hide-details
                outlined
              ></vg-text-field>
            </vg-flex>
            <vg-flex gap-size="large" flex-direction="column">
              <zones-map
                :geojson="geoJSON(pm.form.address.coordinates)"
                :max-height="'225px'"
                :min-height="'225px'"
                :interactive="false"
              ></zones-map>
              <vg-button expand outlined @click="pm.openMapModal()">
                {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_ADD_LOCATION') }}
              </vg-button>
            </vg-flex>
          </vg-grid>
        </vg-panel>

        <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION')">
          <vg-flex flex-direction="row" gap-size="mid">
            <div>
              <vg-checkbox
                :disabled="
                  pm.vendorOnlineProfile.orderingSystem.value ==
                    'FAKE_VENDOR' || !pm.vendorOnlineProfile.posIntegrated
                "
                :value="pm.form.posIntegrated"
                label="POS Integrated"
                hide-details
                @input="updateVendorPosIntegrationStatus"
              ></vg-checkbox>
            </div>
            <div v-if="pm.form.posIntegrated">
              <vg-select
                :selection.sync="pm.form.posIntegrationType"
                :label="$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION_TYPE')"
                :options="pm.posIntegrationTypes"
                outlined
                hide-details
              >
              </vg-select>
            </div>
          </vg-flex>
        </vg-panel>

        <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_CREATION_CONTACTS')">
          <div
            v-if="pm.form.contactPersons.length === 0"
            class="branch-creation-form__contacts-empty"
          >
            <div class="branch-creation-form__contacts-empty__body">
              <div class="branch-creation-form__contacts-empty__title">
                {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_ADD_AT_LEAST_ONE') }}
              </div>
              <vg-button
                color="primary"
                outlined
                @click="pm.openContactPersonForm()"
              >
                {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_ADD_CONTACT') }}
              </vg-button>
            </div>
          </div>
          <div v-if="pm.form.contactPersons.length > 0">
            <div class="branch-creation-form__contacts">
              <contact-person-simple-table
                :items="pm.form.contactPersons"
                :total-items-count="pm.form.contactPersons.length"
                hide-footer
                @remove="pm.removeContactPerson($event)"
              ></contact-person-simple-table>
              <div class="branch-creation-form__contacts__footer">
                <vg-button
                  color="primary"
                  outlined
                  @click="pm.openContactPersonForm()"
                >
                  {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_ADD_CONTACT') }}
                </vg-button>
              </div>
            </div>
          </div>
        </vg-panel>

        <div class="branch-creation-form__footer">
          <vg-button color="primary" outlined @click="discardChanges()">
            {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_DISCARD_CHANGES') }}
          </vg-button>
          <vg-button
            color="primary"
            :disabled="!pm.form.isValid()"
            @click="submit"
          >
            {{ $t('ONLINE_ORDERING_BRANCHES_CREATION_SAVE_CHANGES') }}
          </vg-button>
        </div>
      </div>
    </vg-panel>

    <search-map-modal
      :starting-point-coordinates="pm.mapConfig.point"
      :open="pm.shouldShowMapModal"
      @submitted="pm.submitMapModal($event.pickupPointCoordinates)"
      @discard="pm.closeMapModal()"
      @backdrop="pm.closeMapModal()"
    ></search-map-modal>

    <vg-bottom-sheet-list
      :open="pm.shouldOpenSelectionsList"
      :item-groups="pm.tagsSelectionsList"
      selectable
      :selections="pm.form.tags"
      @backdrop="pm.closeTagsSelection()"
      @update:selections="pm.addSelections($event)"
    >
      <template #header>
        {{ $t('TAG_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{ $t('TAG_SELECTION_SAVE', { quantity: selections.length }) }}
      </template>
    </vg-bottom-sheet-list>
    <add-contact-person-bottom-sheet
      :open="pm.shouldOpenContactPersonForm"
      :form="pm.contactPersonForm"
      @submitted="pm.submitContactPersonForm()"
      @discard="pm.closeContactPersonForm()"
    ></add-contact-person-bottom-sheet>
  </vg-content>
</template>

<script lang="ts">
import AddContactPersonBottomSheet from '../AddContactPersonBottomSheet.ts.vue';
import ContactPersonSimpleTable from '../ContactPersonSimpleTable.vue';
import SearchMapModal from '../../../mapbox/SearchMapModal.vue';
import VgGrid from '../../../../components/VgGrid.ts.vue';
import VgSwitch from '../../../../components/VgSwitch.vue';
import Vue from 'vue';
import ZonesMap from '../../../../components/ZonesMap.vue';
import { BranchCreationPM } from '../../../../../core/presentation-models/branches/BranchCreationPM';
import { BranchRepoImpl } from '../../../../repositories/restaurants/branches/BranchRepoImpl';
import {
  GeoJSONPoint,
  GeojsonFeatureCollection,
} from '@survv/commons/core/models/GeoJSON';
import { GeoRepoImpl } from '../../../../repositories/geo/GeoRepoImpl';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../../core/routes/routeNames';
import { TagsSelectionPM } from '../../../../../core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTagsRepoImpl } from '../../../../repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileRepoImpl } from '../../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { VgTimePicker } from '@survv/commons/components/VgTimePicker';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'BranchCreationForm',
  components: {
    VgContent,
    VgButton,
    VgPanel,
    VgSwitch,
    VgTextField,
    VgTimePicker,
    VgChip,
    VgFlex,
    VgBottomSheetList,
    VgGrid,
    VgSelect,
    ZonesMap,
    SearchMapModal,
    AddContactPersonBottomSheet,
    ContactPersonSimpleTable,
    VgCheckbox,
  },
  data() {
    return {
      pm: new BranchCreationPM({
        vendorId: parseInt(this.$route.params.vendorId, 10),
        branchRepo: new BranchRepoImpl(),
        geoRepo: new GeoRepoImpl(),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        tagsSelectionPM: new TagsSelectionPM({
          vendorType: new VendorType('food'.toUpperCase()),
          notificationService,
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
        }),
        notificationService,
      }),
    };
  },
  computed: {
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
            ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_CREATION,
          routeParams: { ...this.$route.params },
          text: this.$t('ONLINE_ORDERING_BRANCHES_CREATION'),
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    async submit() {
      if (await this.pm.submit()) {
        await this.$router.push({
          name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          params: {
            ...this.$route.params,
          },
        });
      }
    },
    async discardChanges(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
        params: {
          ...this.$route.params,
        },
      });
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
    updateVendorPosIntegrationStatus(status: boolean): void {
      this.pm.form.posIntegrated = status;
      if (status) {
        this.pm.form.posIntegrationType = this.pm.posIntegrationTypes[0].value;
      } else {
        this.pm.form.posIntegrationType = 'NONE';
      }
    },
  },
});
</script>

<style scoped lang="scss">
.branch-creation-form {
  display: flex;
  gap: var(--inset-large);
  flex-direction: column;

  &__footer {
    display: flex;
    gap: var(--inset-large);
    flex-direction: row;
    justify-content: flex-end;
  }

  &__switch-component {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &__switch-trigger {
      margin-top: 0;
    }
  }

  &__checkbox-component {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 240px;

    &__checkbox-label {
      margin-top: var(--inset-mid);
    }
    &__checkbox-trigger {
      margin-top: var(--inset-mid);
    }
  }

  &__rows {
    display: flex;
    gap: var(--inset-x-large);
    flex-direction: column;

    &__row-items {
      display: flex;
      gap: var(--inset-large);
      flex-direction: row;

      &__item-border {
        background-color: var(--color-surface-light);
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        padding: 0 var(--inset-mid) 11px var(--inset-mid);
        height: max-content;
      }
    }
  }

  &__contacts {
    display: flex;
    gap: var(--inset-large);
    flex-direction: column;

    &__footer {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  &__contacts-empty {
    display: flex;
    gap: var(--inset-large);
    flex-direction: row;
    justify-content: center;

    &__body {
      display: flex;
      gap: var(--inset-large);
      flex-direction: column;
      width: 242px;
    }

    &__title {
      color: rgba(0, 0, 0, 56%);
      font-size: var(--inset-large);
    }
  }
}
.add-button__icon {
  width: 14px;
  height: 14px;
  fill: var(--color-primary);
}
</style>
