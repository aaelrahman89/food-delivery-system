<template>
  <vg-content :pm="pm" :title="$t('REFERRAL_SETUP')" class="content-area">
    <vg-panel :title="$t('REFERRAL_ENGLISH_APP_TEXT_CONFIGURATIONS')" dark>
      <div class="configuration-wrapper">
        <vg-text-field
          v-model="pm.referralForm.title.en"
          class="input-background"
          :validator="pm.referralForm.validators.titleEn"
          required
          outlined
          label="REFERRAL_TITLE"
          type="text"
          max-width="100%"
        ></vg-text-field>
        <vg-textarea
          v-model="pm.referralForm.description.en"
          class="input-background"
          :validator="pm.referralForm.validators.descriptionEn"
          required
          label="REFERER_DESCRIPTION"
          type="text"
          outlined
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.sharingMessageText.en"
          class="input-background"
          :validator="pm.referralForm.validators.sharingMessageTextEn"
          required
          label="REFERER_SHARING_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_200')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.referrerBannerText.en"
          class="input-background"
          :validator="pm.referralForm.validators.referrerBannerTextEn"
          required
          label="REFERER_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.refereeTextWithDeepLink.en"
          class="input-background"
          :validator="pm.referralForm.validators.refereeTextWithDeepLinkEn"
          required
          label="REFEREE_WITH_DEEP_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.refereeTextWithoutDeepLink.en"
          class="input-background"
          :validator="pm.referralForm.validators.refereeTextWithoutDeepLinkEn"
          required
          label="REFEREE_WITHOUT_DEEP_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
      </div>
    </vg-panel>
    <vg-panel :title="$t('REFERRAL_ARABIC_APP_TEXT_CONFIGURATIONS')" dark>
      <div class="configuration-wrapper">
        <vg-text-field
          v-model="pm.referralForm.title.ar"
          class="input-background"
          :validator="pm.referralForm.validators.titleAr"
          required
          outlined
          label="REFERRAL_TITLE"
          type="text"
          max-width="100%"
        ></vg-text-field>
        <vg-textarea
          v-model="pm.referralForm.description.ar"
          class="input-background"
          :validator="pm.referralForm.validators.descriptionAr"
          required
          label="REFERER_DESCRIPTION"
          type="text"
          outlined
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.sharingMessageText.ar"
          class="input-background"
          :validator="pm.referralForm.validators.sharingMessageTextAr"
          required
          label="REFERER_SHARING_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_200')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.referrerBannerText.ar"
          class="input-background"
          :validator="pm.referralForm.validators.referrerBannerTextAr"
          required
          label="REFERER_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.refereeTextWithDeepLink.ar"
          class="input-background"
          :validator="pm.referralForm.validators.refereeTextWithDeepLinkAr"
          required
          label="REFEREE_WITH_DEEP_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
        <vg-textarea
          v-model="pm.referralForm.refereeTextWithoutDeepLink.ar"
          class="input-background"
          :validator="pm.referralForm.validators.refereeTextWithoutDeepLinkAr"
          required
          label="REFEREE_WITHOUT_DEEP_BANNER_MESSAGE"
          type="text"
          outlined
          :hint="$t('MAX_CHAR_COUNT_58')"
          persistent-hint
        ></vg-textarea>
      </div>
    </vg-panel>
    <vg-panel :title="$t('REFERRAL_CONFIGURATIONS')" dark>
      <div class="configuration-wrapper">
        <vg-text-field
          v-model="pm.referralForm.referrerAmount"
          class="input-background"
          :validator="pm.referralForm.validators.referrerAmount"
          required
          label="REFERER_AMOUNT"
          type="number"
          outlined
          max-width="100%"
        ></vg-text-field>
        <vg-select
          :selection.sync="pm.referralForm.refereeDiscountType"
          :options="pm.referralDiscountTypes"
          :validator="pm.referralForm.validators.refereeDiscountType"
          class="input-background"
          label="REFEREE_DISCOUNT_TYPE"
          max-width="100%"
          outlined
          clearable
        >
        </vg-select>
        <vg-text-field
          v-if="pm.shouldShowPercentageFields"
          v-model.number="pm.referralForm.refereePercentage"
          class="input-background"
          :validator="pm.referralForm.validators.refereePercentage"
          required
          label="REFEREE_PERCENTAGE"
          type="number"
          outlined
          max-width="100%"
          aria-valuemax="100"
        ></vg-text-field>
        <vg-text-field
          v-if="pm.shouldShowPercentageFields"
          v-model="pm.referralForm.refereeCap"
          class="input-background"
          :validator="pm.referralForm.validators.refereeCap"
          required
          label="REFEREE_CAP"
          type="number"
          outlined
          max-width="100%"
        ></vg-text-field>
        <vg-text-field
          v-if="pm.shouldShowFixedValueFields"
          v-model.number="pm.referralForm.refereeFixedValue"
          class="input-background"
          :validator="pm.referralForm.validators.refereeFixedValue"
          required
          label="REFEREE_FIXED_VALUE"
          type="number"
          outlined
          max-width="100%"
        ></vg-text-field>
        <custom-select
          class="input-background"
          :label="$t('REFERRAL_SELECT_SERVICES')"
          :items="pm.services"
          :validator="pm.referralForm.validators.services"
          :selections.sync="pm.referralForm.services"
          outlined
        ></custom-select>
        <vg-text-field
          v-model="pm.referralForm.referrerMaxAmount"
          class="input-background"
          :validator="pm.referralForm.validators.referrerMaxAmount"
          label="REFERER_MAX_AMOUNT"
          type="string"
          outlined
          max-width="100%"
        ></vg-text-field>
        <vg-text-field
          v-model="pm.referralForm.refereeMinSpending"
          class="input-background"
          label="REFEREE_MIN_SPENDING"
          type="number"
          outlined
          max-width="100%"
        ></vg-text-field>
      </div>
    </vg-panel>
    <div class="required-text">
      <p>{{ $t('REFERRAL_SECTION_FIELD_REQUIRED') }}</p>
    </div>
    <vg-floating-container>
      <div class="form-actions">
        <div class="form-actions__discard">
          <vg-button outlined large @click="discard">
            {{ $t('DISCARD_CHANGES') }}
          </vg-button>
        </div>
        <div class="form-actions__save">
          <vg-button
            large
            :disabled="!pm.submittable"
            width="220px"
            @click="submit"
          >
            {{ $t('SAVE_CHANGES') }}
          </vg-button>
        </div>
      </div>
    </vg-floating-container>
  </vg-content>
</template>

<script lang="ts">
import CustomSelect from './CustomSelect.ts.vue';
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { ReferralRepoImpl } from '../../../repositories/referral/ReferralRepoImpl';
import { SetReferralSetupPM } from '../../../../core/presentation-models/referral/SetReferralSetupPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFloatingContainer } from '@survv/commons/components/VgFloatingContainer';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { VgTextarea } from '@survv/commons/components/VgTextarea';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'ReferralSetup',
  components: {
    VgContent,
    VgPanel,
    VgTextField,
    VgTextarea,
    VgButton,
    VgSelect,
    VgFloatingContainer,
    CustomSelect,
  },
  props: {},
  data() {
    return {
      pm: new SetReferralSetupPM({
        notificationService,
        referralRepo: new ReferralRepoImpl(),
      }),
    };
  },
  async created(): Promise<void> {
    await this.pm.init();
  },

  methods: {
    async submit(): Promise<void> {
      const submitted = await this.pm.submit();
      if (submitted) {
        await this.$router.push({ name: ROUTE_NAMES.REFERRAL_LIST });
      }
    },
    async discard(): Promise<void> {
      await this.$router.push({ name: ROUTE_NAMES.REFERRAL_LIST });
    },
  },
});
</script>
<style lang="scss" scoped>
.content-area ::v-deep .vg-content__body {
  margin-bottom: 50px;
}

.input-background ::v-deep .v-input__slot {
  background-color: white !important;
}

.panel-container {
  margin: var(--inset-small) 0px;
}
.configuration-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  grid-column-gap: var(--inset-small);
  grid-row-gap: var(--inset-small);
  max-width: 90%;
}
.form-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 var(--inset-large);
}

.form-actions__save {
  margin-inline-start: var(--inset-mid);
}

.required-text {
  line-height: 20px;
  font-size: var(--font-size-mid);
}

.order-details-action-buttons-container {
  &__button {
    width: 220px;
  }
}
</style>
