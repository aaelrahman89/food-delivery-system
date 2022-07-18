<template>
  <vg-content :pm="pm" :title="$t('TAX_TIERS')" class="tiers-list-container">
    <div class="tiers-list-container__section">
      <vg-button color="primary" outlined @click="pm.openTaxTierCreationForm()">
        {{ $t('TAX_TIERS_CREATE_NEW') }}
      </vg-button>
    </div>
    <div class="tiers-list-container__section">
      <tax-tiers-table
        :sort="pm.query.sort"
        class="elevation-1"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
        @update:tier="pm.openTaxTierUpdateForm($event)"
      >
      </tax-tiers-table>
    </div>
    <div>
      <tax-tiers-creation-form
        :open="pm.shouldOpenTaxTierCreationForm"
        :pm="pm.creationPM"
        @discard="pm.closeTaxTierCreationForm()"
        @backdrop="pm.closeTaxTierCreationForm()"
        @submit="pm.onTaxTierCreationFormSubmit()"
      ></tax-tiers-creation-form>
    </div>
    <div>
      <tax-tiers-update-form
        :open="pm.shouldOpenTaxTierUpdateForm"
        :pm="pm.updatePM"
        @discard="pm.closeTaxTierUpdateForm()"
        @backdrop="pm.closeTaxTierUpdateForm()"
        @submit="pm.onTaxTierUpdateFormSubmit()"
      ></tax-tiers-update-form>
    </div>
  </vg-content>
</template>

<script lang="ts">
import TaxTiersCreationForm from '../create/TaxTiersCreationForm.ts.vue';
import TaxTiersTable from './TaxTiersTable.ts.vue';
import TaxTiersUpdateForm from '../update/TaxTiersUpdateForm.ts.vue';
import Vue from 'vue';
import { TaxTiersListPM } from '../../../../core/presentation-models/tax-tiers/TaxTiersListPM';
import { TaxTiersRepoImpl } from '../../../repositories/tax-tiers/TaxTiersRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'TaxTiersList',
  components: {
    TaxTiersCreationForm,
    TaxTiersUpdateForm,
    TaxTiersTable,
    VgContent,
    VgButton,
  },
  data() {
    return {
      pm: new TaxTiersListPM({
        taxTiersRepo: new TaxTiersRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
        notificationService,
      }),
    };
  },
  async created() {
    await this.pm.init();
  },
});
</script>

<style scoped lang="scss">
.tiers-list-container__section {
  margin: var(--inset-large) 0;
}
</style>
