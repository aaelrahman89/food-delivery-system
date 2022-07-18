<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-grid class="catalogue">
      <vg-grid
        class="catalogue__details vg-border"
        :class="{ disabled: pm.disableCatalogueProfile }"
      >
        <div class="catalogue__details__header">
          <vg-bilingual-string
            class="catalogue__details__header__title"
            tag="h1"
            :value="pm.catalogue.displayName"
          ></vg-bilingual-string>
          <vg-flex gap-size="small" justify-content="flex-end">
            <div v-if="pm.shouldShowSetAsReady">
              <vg-button outlined large @click="pm.setCatalogueAsReady()">
                {{ $t('CATALOGUE_SET_AS_READY') }}
              </vg-button>
            </div>
            <div v-if="pm.shouldShowPublish">
              <vg-button outlined large @click="pm.publishCatalogue()">
                {{ $t('CATALOGUE_PUBLISH') }}
              </vg-button>
            </div>
            <div v-if="pm.shouldShowUnPublish">
              <vg-button outlined large @click="pm.unPublishCatalogue()">
                {{ $t('CATALOGUE_UNPUBLISH') }}
              </vg-button>
            </div>
            <div>
              <vg-button outlined :to="catalogueUpdateRoute" large>
                {{ $t('CATALOGUE_UPDATE_INFO') }}
              </vg-button>
            </div>
            <div>
              <vg-button outlined large @click="pm.openBranchesSelections()">
                {{ $t('CATALOGUE_UPDATE_BRANCHES') }}
              </vg-button>
            </div>
          </vg-flex>
        </div>
        <div class="catalogue__details__attributes">
          <vg-flex gap-size="small">
            <vg-pair
              dense
              :label="$t('CATALOGUE_ORDERING_HOURS')"
              :value="$t(pm.catalogue.orderingHours)"
            ></vg-pair>
            <vg-pair
              dense
              :label="$t('CATALOGUE_STATUS')"
              :value="$t(pm.catalogue.status)"
            ></vg-pair>
          </vg-flex>
        </div>
        <div class="catalogue__details__description">
          <vg-panel collapsible :title="$t('CATALOGUE_DESCRIPTION')">
            {{ $t(pm.catalogue.description) }}
          </vg-panel>
        </div>
        <div class="catalogue__details__published-branches">
          <vg-panel collapsible :title="$t('CATALOGUE_PUBLISHED_BRANCHES')">
            <vg-flex gap-size="small">
              <vg-chip
                v-for="branch in pm.catalogue.publishedBranches"
                :key="branch.id"
              >
                {{ $t(branch.displayName) }}
              </vg-chip>
            </vg-flex>
          </vg-panel>
        </div>
      </vg-grid>
      <vg-grid class="catalogue__sections vg-border">
        <catalogue-sections-edit-mode
          v-if="pm.isEditMode"
          :view-mode-route="viewModeRoute"
          :catalogue-sections.sync="pm.updatedCatalogueSections"
          :selected-catalogue-section.sync="pm.updatedSelectedCatalogueSection"
          :disable-save-layout-changes="pm.disableSaveLayoutChanges"
          @discard-catalogue-sections-update="
            pm.discardCatalogueSectionsUpdate()
          "
          @select:catalogue-section="pm.selectCatalogueSection($event)"
          @set-popular:item="pm.setItemAsPopular($event)"
          @unset-popular:item="pm.unSetItemAsPopular($event)"
          @archive:item="pm.archiveItem($event)"
          @open-catalogue-section-creation="pm.openCatalogueSectionCreation()"
          @open-catalogue-section-update="pm.openCatalogueSectionUpdate()"
          @add-items="goToAddCatalogueItem"
          @save-layout-changes="saveLayoutChanges"
        >
        </catalogue-sections-edit-mode>
        <catalogue-sections-view-mode
          v-else
          :edit-mode-route="editModeRoute"
          :catalogue-sections="pm.catalogue.catalogueSections"
          :selected-catalogue-section="pm.selectedCatalogueSection"
          @update-catalogue-sections="pm.updateCatalogueSections()"
          @select:catalogue-section="pm.selectCatalogueSection($event)"
        >
        </catalogue-sections-view-mode>

        <catalogue-section-form-bottom-sheet
          :open="pm.isCatalogueSectionFormOpened"
          :catalogue-section-form="pm.catalogueSectionForm"
          :tax-tiers-options="taxTiersOptions"
          :can-apply-tax-tier="pm.canApplyTaxTier()"
          @backdrop="pm.discardCatalogueSectionForm()"
          @discard="pm.discardCatalogueSectionForm()"
          @submitted="pm.onCatalogueSectionFormSubmission()"
        ></catalogue-section-form-bottom-sheet>

        <vg-bottom-sheet-list
          :open="pm.shouldOpenBranchesSelections"
          :item-groups="pm.branches"
          selectable
          :selections="pm.formBranches"
          @backdrop="pm.closeBranchesSelections()"
          @update:selections="pm.addBranches($event)"
        >
          <template #header>
            {{ $t('BRANCH_UPDATE_HEADER') }}
          </template>
          <template #submit="{ selections }">
            {{ $t('BRANCH_SELECTION_SAVE', { quantity: selections.length }) }}
          </template>
        </vg-bottom-sheet-list>
      </vg-grid>
    </vg-grid>
  </vg-content>
</template>

<script lang="ts">
import CatalogueSectionFormBottomSheet from './CatalogueSectionForm.ts.vue';
import CatalogueSectionsEditMode from './CatalogueSectionsEditMode.ts.vue';
import CatalogueSectionsViewMode from './CatalogueSectionsViewMode.ts.vue';
import Vue from 'vue';
import { BranchProfilesRepoImpl } from '../../../repositories/online-ordering/BranchProfilesRepoImpl';
import { CatalogueItemsRepoImpl } from '../../../repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguePM } from '../../../../core/presentation-models/online-ordering/CataloguePM';
import { CatalogueSectionForm } from '../../../../core/models/CatalogueSection';
import { CataloguesRepoImpl } from '../../../repositories/online-ordering/CataloguesRepoImpl';
import { Location } from 'vue-router';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { TaxTiersRepoImpl } from '../../../repositories/tax-tiers/TaxTiersRepoImpl';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VgBilingualString } from '@survv/commons/components/VgBilingualString';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgButton } from '@survv/commons/components/VgButton/index';
import { VgChip } from '@survv/commons/components/VgChip/index';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex/index';
import { VgGrid } from '@survv/commons/components/VgGrid/index';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

const routeHashes = {
  editMode: '#edit-mode',
};

export default Vue.extend({
  name: 'Catalogue',
  components: {
    VgContent,
    VgBilingualString,
    VgButton,
    VgPair,
    VgChip,
    VgPanel,
    VgGrid,
    VgFlex,
    VgBottomSheetList,
    CatalogueSectionsEditMode,
    CatalogueSectionsViewMode,
    CatalogueSectionFormBottomSheet,
  },
  data() {
    return {
      pm: new CataloguePM({
        notificationService,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        vendorId: Number(this.$route.params.vendorId),
        catalogueId: Number(this.$route.params.catalogueId),
        isEditMode: this.$route.hash === routeHashes.editMode,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
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
          text: this.$t(this.pm.vendorProfile.name),
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUES',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          routeParams: { ...this.$route.params },
          text: this.pm.catalogue.displayName,
        },
      ];
    },
    catalogueUpdateRoute(): Location {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_UPDATE,
        params: { ...this.$route.params },
      };
    },
    viewModeRoute(): Location {
      return {
        name: this.$route.name!,
        params: this.$route.params,
        hash: '',
      };
    },
    editModeRoute(): Location {
      return {
        name: this.$route.name!,
        params: this.$route.params,
        hash: routeHashes.editMode,
      };
    },
    taxTiersOptions(): { label: string; value: number }[] {
      const taxTiersOptions = this.pm.taxTiers.items.map((taxTier) => {
        return {
          label: `${this.$t(taxTier.displayName)} (${taxTier.percentage}%)`,
          value: taxTier.id,
        };
      });
      return taxTiersOptions;
    },
  },
  created(): Promise<void> {
    return this.pm.init();
  },
  methods: {
    async goToAddCatalogueItem(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_CREATION,
        params: { ...this.$route.params },
      });
    },
    async saveLayoutChanges(): Promise<void> {
      if (await this.pm.saveLayoutChanges())
        await this.$router.push(this.viewModeRoute);
    },
  },
});
</script>

<style scoped lang="scss">
.catalogue {
  &__details {
    padding: var(--inset-mid);
    &__header {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      &__title {
        font-weight: 500;
        font-size: var(--font-size-large);
      }
    }
  }
  &__sections {
    padding: var(--inset-mid);
  }
}
</style>
