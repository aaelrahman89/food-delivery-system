<template>
  <vg-content :pm="pm" :title="$t('REFERRAL_REPORT')">
    <referral-report-table
      v-if="!pm.loading"
      :items="pm.list.items"
      :items-count="pm.list.totalItemsCount"
      :remaining-quota="pm.list.items[0].quota.toString()"
      :skip="pm.query.skip"
      :limit="pm.query.limit"
      :sort="pm.query.sort"
      :loading="pm.loading"
      @update:pagination="pm.onPaginationUpdate($event)"
      @update:sort="pm.onSortUpdate($event)"
    ></referral-report-table>
  </vg-content>
</template>

<script lang="ts">
import ReferralReportTable from './ReferralReportTable.ts.vue';
import Vue from 'vue';
import { ReferralRepoImpl } from '../../../repositories/referral/ReferralRepoImpl';
import { ReferralReportPM } from '../../../../core/presentation-models/referral/ReferralReportPM';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'ReferralReport',
  components: { VgContent, ReferralReportTable },
  data() {
    return {
      pm: new ReferralReportPM({
        notificationService,
        referralRepo: new ReferralRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
  },
});
</script>

<style lang="scss"></style>
