<template>
  <div>
    <vg-data-table
      must-sort
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.promotions[0].name }}</td>
          <td>{{ item.name }}</td>
          <td>{{ $t(item.status) }}</td>
          <td>
            <vg-clickable
              v-if="
                isVendorsCriteriaClickable(
                  item.promotions[0].branchesCriteria.criteria
                )
              "
              :label="$t(item.promotions[0].branchesCriteria.criteria)"
              :on-click="
                () => {
                  setVendorsCriteriaBottomSheet(item.id);
                }
              "
            ></vg-clickable>
            <template v-else>
              {{ $t(item.promotions[0].branchesCriteria.criteria) }}
            </template>
          </td>
          <td>
            <vg-clickable
              v-if="
                isBranchesClickable(
                  item.promotions[0].branchesCriteria.criteria
                )
              "
              :label="$t('CAMPAIGNS_LIST_TABLE_BRANCHES')"
              :on-click="
                () => {
                  setBranchesBottomSheet(item.id);
                }
              "
            ></vg-clickable>
            <template v-else>
              {{ $t('CAMPAIGNS_LIST_TABLE_ALL_BRANCHES') }}
            </template>
          </td>
          <td>{{ $t(item.promotions[0].customersCriteria) }}</td>
          <td>{{ $t(item.promotions[0].promoCodeUsage) }}</td>
          <td>{{ item.startDate.toDatetimeString() }}</td>
          <td>{{ item.endDate.toDatetimeString() }}</td>
          <td>
            {{
              formatCalculation(
                item.currentActivationsCount,
                item.targetActivationsCount
              )
            }}
          </td>
          <td>
            {{
              formatCalculation(
                item.customerPromoCodeUsageCount,
                item.promoCodeTotalUsageCount
              )
            }}
          </td>
          <td>
            {{
              formatCalculation(
                item.customerCancellationCount,
                item.promoCodeTotalUsageCount
              )
            }}
          </td>
          <td>{{ formatBudget(item.spentBudget, item.budget) }}</td>
          <td>{{ item.createdBy.email }}</td>
          <td>{{ $t(item.service) }}</td>
          <td @click.stop>
            <vg-action-menu
              :actions="generateActionMenuActions(item)"
            ></vg-action-menu>
          </td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMenuItem } from '@survv/commons/core/models/ActionMenu';
import { Campaign, CampaignStatus } from '../../../../core/models/Campaign';
import { EntityId } from '@survv/commons/core/types';
import { Money } from '@survv/commons/core/models/money';
import { PromotionBranchesCriteria } from '../../../../core/models/Promotion';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgClickable } from '@survv/commons/components/VgClickable';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

const events = {
  enableCampaign: 'enable:campaign',
  disableCampaign: 'disable:campaign',
  setVendorsCriteriaBottomSheet: 'set:vendors-criteria-bottom-sheet',
  setBranchesBottomSheet: 'set:branches-bottom-sheet',
};

export default Vue.extend({
  name: 'CampaignsListTable',
  components: { VgDataTable, VgActionMenu, VgClickable },
  data() {
    return {
      columns: [
        {
          value: 'promotions.name',
          text: this.$t('CAMPAIGNS_LIST_TABLE_PROMOTION_NAME'),
        },
        {
          value: 'name',
          text: this.$t('CAMPAIGNS_LIST_TABLE_CAMPAIGN_NAME'),
        },
        {
          value: 'status',
          text: this.$t('CAMPAIGNS_LIST_TABLE_STATUS'),
        },
        {
          value: 'vendorEligibility',
          text: this.$t('CAMPAIGNS_LIST_TABLE_VENDOR_ELIGIBILITY'),
        },
        {
          value: 'branches',
          text: this.$t('CAMPAIGNS_LIST_TABLE_BRANCHES'),
          sortable: false,
        },
        {
          value: 'audience',
          text: this.$t('CAMPAIGNS_LIST_TABLE_AUDIENCE'),
        },
        {
          value: 'usageType',
          text: this.$t('CAMPAIGNS_LIST_TABLE_USAGE_TYPE'),
        },
        {
          value: 'startDate',
          text: this.$t('CAMPAIGNS_LIST_TABLE_START_DATE'),
        },
        {
          value: 'endDate',
          text: this.$t('CAMPAIGNS_LIST_TABLE_END_DATE'),
        },
        {
          value: 'numberOfActivations',
          text: this.$t('CAMPAIGNS_LIST_TABLE_NUMBER_OF_ACTIVATIONS'),
        },
        {
          value: 'utilizationRate',
          text: this.$t('CAMPAIGNS_LIST_TABLE_UTILIZATION_RATE'),
        },
        {
          value: 'cancellationRate',
          text: this.$t('CAMPAIGNS_LIST_TABLE_CANCELLATION_RATE'),
        },
        {
          value: 'spentBudget',
          text: this.$t('CAMPAIGNS_LIST_TABLE_SPENT_BUDGET'),
        },
        {
          value: 'createdBy',
          text: this.$t('CAMPAIGNS_LIST_TABLE_CREATED_BY'),
        },
        {
          value: 'services',
          text: this.$t('CAMPAIGNS_LIST_TABLE_SERVICES'),
        },
        {
          value: 'actions',
          text: '',
          sortable: false,
          align: 'reverse',
        },
      ],
    };
  },
  methods: {
    formatCalculation(current: number, target: number): string {
      const percentage = ((current / target) * 100).toFixed(1);
      return `${current} of ${target} (${percentage}%)`;
    },
    formatBudget(spent: Money, total: Money): string {
      const percentage = ((spent.valueOf() / total.valueOf()) * 100).toFixed(1);
      return `${spent.valueOf()} of ${total.valueOf()} ${this.$t(
        total.currency.toString()
      )} (${percentage}%)`;
    },
    generateActionMenuActions(campaign: Campaign): ActionMenuItem[] {
      return [
        {
          name: this.$t('CAMPAIGNS_LIST_TABLE_ENABLE'),
          onClick: (): void => {
            this.$emit(events.enableCampaign, campaign.id);
          },
          disabled: !CampaignStatus.INACTIVE.equals(campaign.status),
        },
        {
          name: this.$t('CAMPAIGNS_LIST_TABLE_DISABLE'),
          onClick: (): void => {
            this.$emit(events.disableCampaign, campaign.id);
          },
          disabled: !CampaignStatus.ACTIVE.equals(campaign.status),
        },
      ];
    },
    isVendorsCriteriaClickable(criteria: PromotionBranchesCriteria): boolean {
      return (
        criteria.equals(PromotionBranchesCriteria.BRANCHES_IN_AREAS) ||
        criteria.equals(PromotionBranchesCriteria.BRANCHES_WITH_TAGS)
      );
    },
    isBranchesClickable(criteria: PromotionBranchesCriteria): boolean {
      return criteria.notEqual(PromotionBranchesCriteria.ALL_VENDORS);
    },
    setVendorsCriteriaBottomSheet(campaignId: EntityId): void {
      this.$emit(events.setVendorsCriteriaBottomSheet, campaignId);
    },
    setBranchesBottomSheet(campaignId: EntityId): void {
      this.$emit(events.setBranchesBottomSheet, campaignId);
    },
  },
});
</script>

<style scoped lang="scss">
td {
  white-space: nowrap;
}
</style>
