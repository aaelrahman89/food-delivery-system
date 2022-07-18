<template>
  <vg-pairs-list :pairs="vendorSettings"></vg-pairs-list>
</template>

<script>
import { VendorOnlineProfile } from '../../../../core/models/VendorOnlineProfile';
import { VgPairsList } from '@survv/commons/components-deprecated/VgPairs';

export default {
  name: 'VendorOnlineProfileSettings',
  components: { VgPairsList },
  props: {
    vendor: {
      type: VendorOnlineProfile,
      default: undefined,
    },
  },
  computed: {
    vendorSettings() {
      const {
        legalInfo,
        label,
        active,
        orderingSystem,
        dispatchingModel,
        deliverBy,
        stacking,
        branchesCount,
        orderingHours,
        minimumOrderValue,
        taxStatus,
        averagePreparationTime,
        estimatedDeliveryTimeInMinutes,
        deliveryFees,
        posIntegrationType,
      } = this.vendor;
      return {
        VENDOR_ONLINE_PROFILE_COMPANY_NAME: `${legalInfo.companyName}`,
        VENDOR_ONLINE_PROFILE_COMPANY_ADDRESS: `${legalInfo.companyAddress}`,
        VENDOR_ONLINE_PROFILE_COMPANY_LABEL: `${label}`,
        VENDOR_ONLINE_PROFILE_VIEW_ORDERING_HOURS: `${orderingHours.toString()}`,
        VENDOR_ONLINE_PROFILE_VIEW_MINIMUM_ORDER_VALUE: `${minimumOrderValue.toString()} ${this.$t(
          minimumOrderValue.currency.toString()
        )}`,
        VENDOR_ONLINE_PROFILE_VIEW_TAX_STATUS: `${this.$t(
          taxStatus.toString()
        )}`,
        STATUS: `${active ? this.$t('ACTIVE') : this.$t('INACTIVE')}  `,
        VENDOR_ONLINE_PROFILE_VIEW_AVERAGE_PREPARATION_TIME:
          averagePreparationTime,
        VENDOR_ONLINE_PROFILE_ORDERING_SYSTEM: this.$t(
          orderingSystem.toString()
        ),
        VENDOR_ONLINE_PROFILE_DISPATCHING_MODEL: this.$t(
          dispatchingModel.toString()
        ),
        VENDOR_ONLINE_PROFILE_DELIVER_BY: this.$t(deliverBy.toString()),
        VENDOR_ONLINE_PROFILE_ESTIMATED_DELIVERY_TIME:
          estimatedDeliveryTimeInMinutes,
        VENDOR_ONLINE_PROFILE_DELIVERY_FEES: `${deliveryFees.toString()} ${this.$t(
          deliveryFees.currency.toString()
        )}`,
        VENDOR_ONLINE_PROFILE_BRANCHES_COUNT: branchesCount,
        VENDOR_ONLINE_PROFILE_STACKING: `${
          stacking ? this.$t('ENABLED') : this.$t('DISABLED')
        }  `,
        VENDOR_ONLINE_PROFILE_POS_INTEGRATION_TYPE: `${
          posIntegrationType == 'LINETEN' ? 'LINETEN' : 'NONE'
        }`,
      };
    },
  },
};
</script>

<style scoped></style>
