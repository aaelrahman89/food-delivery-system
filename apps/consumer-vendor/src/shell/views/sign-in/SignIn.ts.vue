<template>
  <div class="sign-in-page-container" :style="backgroundStyle">
    <div id="signInPage" class="sign-in-page">
      <v-form
        id="signInForm"
        class="sign-in-page__form"
        @submit.prevent="signIn"
      >
        <div id="brandLogoImg" class="sign-in-page__form__logo-brand">
          <vg-svg :src="SVG_SURVV_LOGO_ICON" width="100" height="100%"></vg-svg>
        </div>
        <div id="brandLogoWelcomeMessage">
          {{ `${$t('WELCOME_TO')} ${message.state.BRAND_NAME} ` }}
        </div>
        <div id="signInFormEmailField">
          <vg-text-field
            :value="message.state.form.email"
            outlined
            required
            hide-details="auto"
            type="email"
            width="100%"
            max-width="100%"
            :label="$t('EMAIL')"
            :validator="message.validators().email"
            @input="validate('email', $event)"
          ></vg-text-field>
        </div>
        <div id="signInFormPasswordField">
          <vg-text-field
            :value="message.state.form.password"
            outlined
            required
            hide-details="auto"
            type="password"
            width="100%"
            max-width="100%"
            :label="$t('PASSWORD')"
            :validator="message.validators().password"
            @input="validate('password', $event)"
          ></vg-text-field>
        </div>
        <div class="reset-password-link">
          <router-link
            :to="{
              name: ROUTE_NAMES.SEND_RESET_PASSWORD_LINK,
            }"
            >{{ $t('FORGOT_PASSWORD') }}</router-link
          >
        </div>
        <div id="signInFormSignInButton">
          <vg-button
            :loading="signInButtonLoading"
            :disabled="signInButtonDisabled"
            expand
            large
            color="primary"
            type="submit"
          >
            {{ $t('LOGIN') }}
          </vg-button>
        </div>
        <div id="signInFormLocalizationChange">
          <a @click="switchLanguage"> {{ $t('CHANGE_LANGUAGE') }} </a>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMAGE_LOGIN_BG, SVG_SURVV_LOGO_ICON } from '@survv/assets';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import {
  SignInAction,
  SignInMessage,
} from '../../../core/blocs/sign-in/SignInMessage';
import { SignInBloc } from '../../../core/blocs/sign-in/SignInBloc';
import { SignInRepoImpl } from '../../repositories/sign-in/SignInRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'SignIn',
  components: {
    VgTextField,
    VgButton,
    VgSvg,
  },
  data() {
    return {
      SVG_SURVV_LOGO_ICON,
      bloc: new SignInBloc({
        signInRepo: new SignInRepoImpl(),
        userPreferenceRepo,
        notificationService,
        routerService: RouterServiceImpl.getInstance(),
      }),
      buttonLoading: false,
      message: new SignInMessage(),
      validators: {
        email: true,
        password: 'ERROR_MESSAGE',
      },
      backgroundStyle: {
        height: '100vh',
        backgroundImage: `url(${IMAGE_LOGIN_BG.url})`,
        backgroundSize: 'cover',
      },
      ROUTE_NAMES,
    };
  },
  computed: {
    logoUrl(): string {
      if (this.$rtl) {
        return this.message.state.logoRtl;
      }
      return this.message.state.logoLtr;
    },
    signInButtonLoading(): boolean {
      return this.message.buttonStatus === 'PROCESSING';
    },
    signInButtonDisabled(): boolean {
      return this.message.buttonStatus === 'DISABLED';
    },
  },
  async created(): Promise<void> {
    this.bloc.outbox().subscribe((message: SignInMessage) => {
      this.message = message;
    });
    this.bloc.inbox().next(
      new SignInAction({
        type: 'INITIALIZE',
        payload: {},
      })
    );
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    signIn() {
      this.bloc.inbox().next(
        new SignInAction({
          type: 'SIGN_IN',
          payload: {},
        })
      );
    },
    validate(key: string, value: string) {
      this.bloc.inbox().next(
        new SignInAction({
          type: 'VALIDATE',
          payload: {
            form: { [key]: value },
          },
        })
      );
    },
    switchLanguage() {
      this.bloc.inbox().next(
        new SignInAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
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
    background-color: var(--color-surface-light);
    &__logo-brand {
      max-width: 300px;
      margin-bottom: var(--inset-mid);
    }
    &__welcome-to-survv {
      color: var(--color-primary);
    }
    #brandLogoWelcomeMessage {
      margin-bottom: var(--inset-mid);
      color: var(--color-primary);
      font-size: var(--font-size-large);
      font-weight: 500;
    }
    #signInFormEmailField {
      width: 100%;
      margin-bottom: var(--inset-mid);
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
    .reset-password-link {
      width: 100%;
      color: var(--color-primary);
      text-align: end;
      margin-bottom: var(--inset-mid);
    }
  }
}
</style>
