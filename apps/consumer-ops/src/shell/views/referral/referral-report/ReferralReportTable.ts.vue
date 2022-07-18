<template>
  <vg-data-table
    :items="items"
    :total-items-count="itemsCount"
    :skip="skip"
    :limit="limit"
    :sort="sort"
    :loading="loading"
    :columns="columns"
    fixed-header
    v-on="$listeners"
  >
    <template #item="{ item }">
      <tr>
        <td>{{ item.referrerName }}</td>
        <td>{{ item.referrerMobileNumber }}</td>
        <td>{{ item.referrerCode }}</td>
        <td>
          <vg-clickable
            :label="item.refereeOrdersCount"
            :route="getRefereeOrdersReportRoute(item.id)"
          />
        </td>
        <td>
          <vg-clickable
            :label="item.refereeSuccessfulOrdersCount"
            :route="getRefereeSuccessfulOrdersReportRoute(item.id)"
          />
        </td>
        <td>{{ item.cashBack }}</td>
        <td>{{ `${item.remainingQuota}%` }}</td>
        <td>{{ isReferredValue(item.isReferred) }}</td>
        <td>
          <vg-clickable
            v-if="item.isReferred"
            :label="item.referredByName"
            :route="getRefereeOrdersReportRoute(item.referredByCodeId)"
          />
          <div v-else>{{ $t('REFERRAL_REPORT_TABLE_NOT_REFERRED') }}</div>
        </td>
        <td>{{ item.registrationDate.toDatetimeString() }}</td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { EntityId } from '@survv/commons/core/types';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgClickable } from '@survv/commons/components/VgClickable';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'ReferralReportTable',
  components: { VgDataTable, VgClickable },
  props: {
    items: {
      type: Array,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    itemsCount: {
      type: Number,
      default: 0,
    },
    skip: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
    sort: {
      type: Object,
      default: undefined,
    },
    remainingQuota: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      columns: [
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REFERRER_NAME'),
          value: 'referrerName',
          sortable: true,
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_MOBILE_NUMBER'),
          value: 'referrerMobileNo',
          sortable: 'true',
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REFERRER_CODE'),
          value: 'name',
          sortable: true,
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REFEREES_ORDER_COUNT'),
          value: 'refereeOrderCount',
          sortable: true,
        },
        {
          text: this.$t(
            'REFERRAL_REPORT_TABLE_SUCCESSFUL_REFEREES_ORDER_COUNT'
          ),
          value: 'refereeSuccessfulOrderCount',
          sortable: 'true',
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_CASH_BACK'),
          value: 'totalCashBack',
          sortable: 'true',
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REMAINING_QUOTA', {
            remainingQuota: this.remainingQuota,
          }),
          value: 'remainingCashBack',
          sortable: true,
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_IS_REFERRED'),
          value: 'referred',
          sortable: true,
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REFERRED_BY'),
          value: 'referredByName',
          sortable: true,
        },
        {
          text: this.$t('REFERRAL_REPORT_TABLE_REGISTRATION_DATE'),
          value: 'registrationDate',
          sortable: true,
        },
      ],
    };
  },
  methods: {
    getRefereeOrdersReportRoute(
      referrerCodeId: EntityId
    ): Record<string, unknown> {
      return {
        name: ROUTE_NAMES.REFEREE_ORDERS_REPORT,
        params: { referrerCodeId },
      };
    },
    getRefereeSuccessfulOrdersReportRoute(
      referrerCodeId: EntityId
    ): Record<string, unknown> {
      return {
        name: ROUTE_NAMES.REFEREE_SUCCESSFUL_ORDERS_REPORT,
        params: { referrerCodeId },
      };
    },
    isReferredValue(isReferred: boolean): string {
      return isReferred ? this.$t('YES') : this.$t('NO');
    },
  },
});
</script>

<style lang="scss" scoped>
::v-deep table {
  thead {
    tr {
      th:nth-child(1) {
        position: sticky !important;
        position: -webkit-sticky !important;
        left: 0;
        z-index: 9999;
        box-shadow: 2px 0 2px 0 var(--color-border-light);
      }
    }
  }

  tbody {
    tr {
      td:nth-child(1) {
        position: sticky !important;
        position: -webkit-sticky !important;
        left: 0;
        z-index: 9998;
        background: var(--color-on-primary);
        border-bottom-color: #b0b0b0 !important;
        box-shadow: 2px 0 2px 0 var(--color-border-light);
      }
    }
  }
}
</style>
