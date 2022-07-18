<template>
  <vg-content :pm="pm" :title="$t('REFERRAL_SETUP')">
    <vg-flex justify-content="space-between">
      <vg-button outlined primary @click="navigateToReferralSetup">
        {{ $t('EDIT_REFERRAL_SETUP') }}
      </vg-button>
      <vg-pair
        :label="$t('REFERRAL_LAST_UPDATED')"
        :value="pm.referralSetup.lastUpdatedDate.toDatetimeString()"
        dense
      ></vg-pair>
    </vg-flex>
    <vg-panel :title="$t('REFERRAL_ENGLISH_APP_TEXT_CONFIGURATIONS')" dark>
      <vg-flex gap-size="small">
        <pair-card
          :label="$t('REFERER_BANNER_MESSAGE')"
          :value="pm.referralSetup.referrerBannerText.en"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFEREE_WITH_DEEP_BANNER_MESSAGE')"
          :value="pm.referralSetup.refereeTextWithDeepLink.en"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFEREE_WITHOUT_DEEP_BANNER_MESSAGE')"
          :value="pm.referralSetup.refereeTextWithoutDeepLink.en"
          max-width="350px"
        ></pair-card>
        <div>
          <vg-pair
            :label="$t('REFERRAL_TITLE')"
            :value="pm.referralSetup.title.en"
            max-width="350px"
            dense
          ></vg-pair>
        </div>
        <pair-card
          :label="$t('REFERER_DESCRIPTION')"
          :value="pm.referralSetup.description.en"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFERER_SHARING_MESSAGE')"
          :value="pm.referralSetup.sharingMessageText.en"
          max-width="350px"
        ></pair-card>
      </vg-flex>
    </vg-panel>
    <vg-panel :title="$t('REFERRAL_ARABIC_APP_TEXT_CONFIGURATIONS')" dark>
      <vg-flex justify-content="flex-start" gap-size="small">
        <pair-card
          :label="$t('REFERER_BANNER_MESSAGE')"
          :value="pm.referralSetup.referrerBannerText.ar"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFEREE_WITH_DEEP_BANNER_MESSAGE')"
          :value="pm.referralSetup.refereeTextWithDeepLink.ar"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFEREE_WITHOUT_DEEP_BANNER_MESSAGE')"
          :value="pm.referralSetup.refereeTextWithoutDeepLink.ar"
          max-width="350px"
        ></pair-card>
        <div>
          <vg-pair
            :label="$t('REFERRAL_TITLE')"
            :value="pm.referralSetup.title.ar"
            max-width="350px"
            dense
          ></vg-pair>
        </div>
        <pair-card
          :label="$t('REFERER_DESCRIPTION')"
          :value="pm.referralSetup.description.ar"
          max-width="350px"
        ></pair-card>
        <pair-card
          :label="$t('REFERER_SHARING_MESSAGE')"
          :value="pm.referralSetup.sharingMessageText.ar"
          max-width="350px"
        ></pair-card>
      </vg-flex>
    </vg-panel>
    <vg-panel :title="$t('REFERRAL_CONFIGURATIONS')" dark>
      <vg-flex justify-content="flex-start" gap-size="small">
        <vg-pair
          :label="$t('REFERER_AMOUNT')"
          :value="pm.referralSetup.referrerAmount"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          :label="$t('REFEREE_DISCOUNT_TYPE')"
          :value="$t(pm.referralSetup.refereeDiscountType)"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          v-if="pm.shouldShowFixedValueFields"
          :label="$t('REFEREE_FIXED_VALUE')"
          :value="pm.referralSetup.refereeFixedValue"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          v-if="pm.shouldShowPercentageFields"
          :label="$t('REFEREE_PERCENTAGE')"
          :value="pm.referralSetup.refereePercentage + '%'"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          v-if="pm.shouldShowPercentageFields"
          :label="$t('REFEREE_CAP')"
          :value="pm.referralSetup.refereeCap"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          :label="$t('REFERER_MAX_AMOUNT')"
          :value="pm.referralSetup.referrerMaxAmount"
          max-width="350px"
          dense
        ></vg-pair>
        <vg-pair
          :label="$t('REFEREE_MIN_SPENDING')"
          :value="pm.referralSetup.refereeMinSpending"
          max-width="350px"
          dense
        ></vg-pair>
        <div>
          <vg-button outlined primary @click="pm.showServicesList()">
            {{ $t('SHOW_REFERRAL_SERVICES') }}
          </vg-button>
        </div>
      </vg-flex>
    </vg-panel>
    <vg-bottom-sheet-list
      :open="pm.shouldOpenServicesListBottomSheet"
      :item-groups="pm.servicesList"
      @backdrop="pm.hideServicesListBottomSheet()"
    >
      <template #header>{{ $t('REFERRAL_ELIGIBLE_SERVICES') }}</template>
      <template #item="{ item }">
        <vg-flex align-items="stretch" gap-size="mid" no-wrap>
          <div class="vg-text--bold">
            {{ item.label }}
          </div>
        </vg-flex>
      </template>
    </vg-bottom-sheet-list>
  </vg-content>
</template>

<script lang="ts">
import PairCard from './PairCard.ts.vue';
import Vue from 'vue';
import { ReferralRepoImpl } from '../../../repositories/referral/ReferralRepoImpl';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';

import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { ReferralSetupPM } from '../../../../core/presentation-models/referral/ReferralSetupPM';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'ReferralList',
  components: {
    VgPanel,
    VgContent,
    VgFlex,
    VgButton,
    VgPair,
    PairCard,
    VgBottomSheetList,
  },
  props: {},
  data() {
    return {
      pm: new ReferralSetupPM({
        notificationService,
        referralRepo: new ReferralRepoImpl(),
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
  },
  methods: {
    async navigateToReferralSetup(): Promise<void> {
      await this.$router.push({ name: ROUTE_NAMES.REFERRAL_SETUP });
    },
  },
});
</script>
<style scoped lang="scss">
.panel-container {
  margin: var(--inset-small) 0px;
}
</style>
