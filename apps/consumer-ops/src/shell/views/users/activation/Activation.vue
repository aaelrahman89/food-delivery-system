<template>
  <div id="activationPage" class="activation-page">
    <v-form id="activationForm" class="activation-page__form">
      <div id="brandLogoImg" class="activation-page__form__logo-brand">
        <img :src="logoUrl" alt="logo" height="100px" />
      </div>
      <div id="brandLogoWelcomeMessage">
        <span>
          {{ `${$t('WELCOME_TO')} ` }}
          <strong class="activation-page__form__welcome-to-survv">{{
            pm.BRAND_NAME
          }}</strong>
        </span>
      </div>
      <div id="activationFormPasswordField">
        <vg-text-field
          v-model.trim="pm.password"
          outlined
          required
          type="password"
          width="100%"
          max-width="100%"
          :label="$t('ACTIVATE_USER_PASSWORD')"
          :validator="validatePassword"
        ></vg-text-field>
      </div>
      <div id="activationFormConfirmPasswordField">
        <vg-text-field
          v-model.trim="pm.confirmPassword"
          outlined
          required
          type="password"
          width="100%"
          max-width="100%"
          :label="$t('ACTIVATE_USER_CONFIRM_PASSWORD')"
          :validator="validatePasswordMatch"
        ></vg-text-field>
      </div>
      <div id="activationFormActivateButton">
        <vg-button
          :loading="pm.loading && pm.initialized"
          :disabled="!pm.canSubmit"
          expand
          large
          color="primary"
          @click="activateAccount"
        >
          {{ $t('ACTIVATE_USER_ACTIVATE') }}
        </vg-button>
      </div>
      <div id="activationFormLocalizationChange">
        <a @click="switchLanguage"> {{ $t('CHANGE_LANGUAGE') }} </a>
      </div>
    </v-form>
  </div>
</template>

<script>
import UserActivationPM from '../../../../core/presentation-models/users/UserActivationPM';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { UsersRepoImpl } from '../../../repositories/users/UsersRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default {
  name: 'Activation',
  components: {
    VgTextField,
    VgButton,
  },
  data() {
    return {
      pm: new UserActivationPM({
        activationToken: this.$route.query.activationToken,
        userPreferenceRepo,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      }),
    };
  },
  computed: {
    logoUrl() {
      if (this.$rtl) {
        return this.pm.logoRtl;
      }
      return this.pm.logoLtr;
    },
  },
  async created() {
    await this.pm.init();
    if (!this.pm.activationTokenExists) {
      await this.$router.replace({ name: ROUTE_NAMES.LOGIN });
    }
  },
  methods: {
    validatePassword() {
      return this.$t(this.pm.validatePassword());
    },
    validatePasswordMatch() {
      return this.$t(this.pm.validateConfirmPassword());
    },
    async switchLanguage() {
      await this.pm.switchLanguage();
      window.location.reload();
    },
    async activateAccount() {
      try {
        await this.pm.activateOpsUser();
        await this.$router.replace({ name: ROUTE_NAMES.LOGIN });
      } catch (err) {
        this.notify('error', err.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.activation-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  &__form {
    width: 408px;
    padding: 50px;
    box-shadow: 0 1px 10px 1px rgb(78 78 78 / 20%);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__logo-brand {
      margin-bottom: var(--inset-large);
    }
    &__logo-brand img {
      max-width: 300px;
    }
    &__welcome-to-survv {
      color: var(--color-primary);
    }
    #brandLogoWelcomeMessage {
      margin-bottom: var(--inset-mid);
      color: var(--theme-primary);
      font-size: var(--font-size-x-large);
    }
    #activationFormPasswordField {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    #activationFormConfirmPasswordField {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    #activationFormActivateButton {
      width: 100%;
      margin-bottom: var(--inset-x-large);
    }
    #activationFormLocalizationChange {
      text-decoration: underline;
      font-size: var(--font-size-small);
    }
  }
}
</style>
