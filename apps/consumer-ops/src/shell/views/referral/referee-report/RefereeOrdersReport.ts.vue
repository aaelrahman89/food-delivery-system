<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <div class="vg-margin-block-end--large">
      <vg-panel dark :title="$t('REFEREE_REPORT_REFERRER_SUMMARY')">
        <vg-flex gap-size="small">
          <vg-pair
            max-width="calc(25% - var(--inset-small))"
            :label="$t('REFEREE_REPORT_REFERRER_SUMMARY_CODE')"
            :value="pm.referrerSummary.code"
            dense
          />
          <vg-pair
            max-width="calc(25% - var(--inset-small))"
            :label="$t('REFEREE_REPORT_REFERRER_SUMMARY_REFEREES_WITH_ORDERS')"
            :value="pm.referrerSummary.refereesWithOrders"
            dense
          />
          <vg-pair
            max-width="calc(25% - var(--inset-small))"
            :label="$t('REFEREE_REPORT_REFERRER_SUMMARY_CASHBACK')"
            :value="`${pm.referrerSummary.cashback.toString()} ${$t(
              pm.referrerSummary.cashback.currency.toString()
            )}`"
            dense
          />
          <vg-pair
            max-width="calc(25% - var(--inset-small))"
            :label="
              $t('REFEREE_REPORT_REFERRER_SUMMARY_REMAINING_QUOTA', {
                quota: pm.referrerSummary.quota.toString(),
              })
            "
            :value="`${pm.referrerSummary.remainingQuota}%`"
            dense
          />
        </vg-flex>
      </vg-panel>
    </div>
    <div>
      <referee-report-table
        :sort="pm.query.sort"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
      >
      </referee-report-table>
    </div>
  </vg-content>
</template>

<script lang="ts">
import RefereeReportTable from './RefereeReportTable.ts.vue';
import Vue from 'vue';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { RefereeReportPM } from '../../../../core/presentation-models/referral/RefereeReportPM';
import { ReferralRepoImpl } from '../../../repositories/referral/ReferralRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'RefereeOrdersReport',
  components: {
    RefereeReportTable,
    VgContent,
    VgPanel,
    VgFlex,
    VgPair,
  },
  data() {
    return {
      pm: new RefereeReportPM({
        referrerCodeId: Number(this.$route.params.referrerCodeId),
        referralRepo: new ReferralRepoImpl(),
        notificationService,
        query: this.$parseJSONQuery(this.$route.query.q),
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.REFERRAL_REPORT,
          text: 'REFERRAL_REPORT',
        },
        {
          routeName: this.$route.name as string,
          text: this.pm.referrerSummary.referrerName,
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
});
</script>

<style scoped lang="scss"></style>
