<template>
  <div id="signInPage" class="sign-in-page">
    <v-form id="signInForm" class="sign-in-page__form" @submit.prevent="signIn">
      <div id="brandLogoImg" class="sign-in-page__form__logo-brand">
        <img :src="logoUrl" alt="logo" height="100px" />
      </div>
      <div id="signInFormEmailField">
        <vg-text-field
          v-model.trim="pm.branchCode"
          outlined
          required
          type="email"
          width="100%"
          max-width="100%"
          :label="$t('BRANCH_CODE')"
          :validator="pm.validators().branchCode"
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
import SignInPM from '../../../../core/presentation-models/sign-in/SignInPM';
import Vue from 'vue';
import { SignInRepoImpl } from '../../../repositories/auth/SignInRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { createNotification } from '../../../../core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { routeNames } from '../../../../core/routes/routeNames';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'SignIn',
  components: {
    VgButton,
    VgTextField,
  },
  data() {
    return {
      pm: new SignInPM({
        notificationService,
        signInRepo: new SignInRepoImpl(),
        userPreferenceRepo,
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
      try {
        this.buttonLoading = true;
        await this.pm.signIn();
        this.buttonLoading = false;
        if (this.$route.query.redirect)
          await this.$router.replace({
            path: this.$route.query.redirect,
          });
        else await this.$router.replace({ name: routeNames.HOME });
      } catch (err) {
        notificationService.notify(createNotification(err));
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
