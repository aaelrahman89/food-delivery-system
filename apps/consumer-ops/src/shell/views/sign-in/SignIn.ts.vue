<template>
  <div id="signInPage" class="sign-in-page">
    <v-form id="signInForm" class="sign-in-page__form" @submit.prevent="signIn">
      <div id="brandLogoImg" class="sign-in-page__form__logo-brand">
        <img :src="logoUrl" alt="logo" height="100px" />
      </div>
      <div id="brandLogoWelcomeMessage">
        <span>
          {{ `${$t('WELCOME_TO')} ` }}
          <strong class="sign-in-page__form__welcome-to-survv">{{
            pm.BRAND_NAME
          }}</strong>
        </span>
      </div>
      <div id="signInFormEmailField">
        <vg-text-field
          v-model.trim="pm.form.email"
          outlined
          required
          type="email"
          width="100%"
          max-width="100%"
          :label="$t('EMAIL')"
          :validator="pm.validators().email"
        ></vg-text-field>
      </div>
      <div id="signInFormPasswordField">
        <vg-text-field
          v-model.trim="pm.form.password"
          outlined
          required
          type="password"
          width="100%"
          max-width="100%"
          :label="$t('PASSWORD')"
          :validator="pm.validators().password"
        ></vg-text-field>
      </div>
      <div id="signInFormSignInButton">
        <vg-button
          :loading="buttonLoading"
          :disabled="!pm.canSubmit"
          expand
          large
          color="primary"
          type="submit"
          @click="signIn"
        >
          {{ $t('SIGN_IN') }}
        </vg-button>
      </div>
      <div id="signInFormLocalizationChange">
        <a @click="switchLanguage"> {{ $t('CHANGE_LANGUAGE') }} </a>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { RawLocation } from 'vue-router';
import { SignInPM } from '../../../core/presentation-models/sign-in/SignInPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { signInRepoImpl } from '../../repositories/sign-in/SignInRepoImpl';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'SignIn',
  components: {
    VgTextField,
    VgButton,
  },
  data() {
    return {
      pm: new SignInPM({
        signInRepo: signInRepoImpl,
        userPreferenceRepo,
        notificationService,
      }),
      buttonLoading: false,
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
  },
  methods: {
    async signIn() {
      if (this.pm.canSubmit) {
        this.buttonLoading = true;
        await this.pm.signIn();
        this.buttonLoading = false;
        if (this.$route.query.redirect)
          await this.$router.replace({
            path: this.$route.query.redirect,
          } as RawLocation);
        else await this.$router.replace({ name: ROUTE_NAMES.HOME });
      }
    },
    async switchLanguage() {
      await this.pm.switchLanguage();
      window.location.reload();
    },
  },
});
</script>

<style lang="scss" scoped>
.sign-in-page {
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
    #signInFormEmailField {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    #signInFormPasswordField {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    #signInFormSignInButton {
      width: 100%;
      margin-bottom: var(--inset-x-large);
    }
    #signInFormLocalizationChange {
      text-decoration: underline;
      font-size: var(--font-size-small);
    }
  }
}
</style>
