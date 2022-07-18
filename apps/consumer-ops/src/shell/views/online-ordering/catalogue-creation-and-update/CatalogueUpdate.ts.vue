<template>
  <vg-content :breadcrumbs="breadcrumbs" :pm="pm">
    <div v-if="pm.initialized" class="catalogue-update">
      <catalogue-form :form-p-m="pm.formPM"></catalogue-form>
      <vg-flex gap-size="small" justify-content="flex-end">
        <div>
          <vg-button outlined @click="goToCatalogueDetails">
            {{ $t('DISCARD_CHANGES') }}
          </vg-button>
        </div>
        <div>
          <vg-button
            :disabled="!pm.canSubmit"
            :loading="pm.loading"
            @click="submit"
          >
            {{ $t('SAVE_CHANGES') }}
          </vg-button>
        </div>
      </vg-flex>
    </div>
  </vg-content>
</template>

<script lang="ts">
import CatalogueForm from './catalogue-form/CatalogueForm.ts.vue';
import Vue from 'vue';
import { BranchProfilesRepoImpl } from '../../../repositories/online-ordering/BranchProfilesRepoImpl';
import { CatalogueUpdatePM } from '../../../../core/presentation-models/online-ordering/CatalogueUpdatePM';
import { CataloguesRepoImpl } from '../../../repositories/online-ordering/CataloguesRepoImpl';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VendorOnlineProfileRepoImpl } from '../../../repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton/index';
import { VgContent } from '@survv/commons/components/VgContent/index';
import { VgFlex } from '@survv/commons/components/VgFlex/index';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CatalogueUpdate',
  components: {
    CatalogueForm,
    VgButton,
    VgFlex,
    VgContent,
  },
  data() {
    return {
      pm: new CatalogueUpdatePM({
        vendorId: Number(this.$route.params.vendorId),
        catalogueId: Number(this.$route.params.catalogueId),
        cataloguesRepo: new CataloguesRepoImpl(),
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
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
          text: this.pm.vendorProfileDisplayName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
          routeParams: { ...this.$route.params },
          text: 'NAV_CATALOGUES',
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
          text: this.pm.catalogueDisplayName,
        },
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_UPDATE,
          text: 'UPDATE',
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    async submit(): Promise<void> {
      if (await this.pm.submit()) {
        await this.goToCatalogueDetails();
      }
    },
    async goToCatalogueDetails(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
        params: { ...this.$route.params },
      });
    },
  },
});
</script>

<style scoped>
.catalogue-update {
  padding: var(--inset-mid);
  display: grid;
  row-gap: var(--inset-mid);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
}
</style>
