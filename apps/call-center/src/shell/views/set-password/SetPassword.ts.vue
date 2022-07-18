<template>
  <div class="set-password-page" :style="backgroundStyle">
    <v-form class="set-password-page__form" @submit.prevent="setPassword">
      <div id="brandLogoImg" class="set-password-page__form__logo-brand">
        <vg-svg :src="SVG_SURVV_LOGO_ICON" width="100" height="100%"></vg-svg>
      </div>
      <div class="set-password-page__form__welcome-to-survv">
        <h3>
          {{ `${$t('WELCOME_TO')} ${message.state.BRAND_NAME}` }}
        </h3>
      </div>
      <div class="set-password-page__form__set-password">
        <h4>{{ $t('SET_PASSWORD_MESSAGE') }}</h4>
      </div>
      <div class="setPasswordFormPasswordField">
        <vg-text-field
          :value="message.state.form.password"
          outlined
          required
          type="password"
          width="100%"
          max-width="100%"
          :label="$t('PASSWORD')"
          :validator="message.validators().password"
          @input="validate('password', $event)"
        ></vg-text-field>
      </div>
      <div class="setPasswordFormPasswordField">
        <vg-text-field
          :value="message.state.form.confirmationPassword"
          outlined
          required
          type="password"
          width="100%"
          max-width="100%"
          :label="$t('CONFIRM_PASSWORD')"
          :validator="message.validators().confirmationPassword"
          @input="validate('confirmationPassword', $event)"
        ></vg-text-field>
      </div>
      <div id="setPasswordFormSignInButton">
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
      <div id="setPasswordFormLocalizationChange">
        <a @click="switchLanguage"> {{ $t('CHANGE_LANGUAGE') }} </a>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';

import { IMAGE_LOGIN_BG, SVG_SURVV_LOGO_ICON } from '@survv/assets';
import {
  SetPasswordAction,
  SetPasswordMessage,
} from '../../../core/blocs/set-password/SetPasswordMessage';
import { SetPasswordBloc } from '../../../core/blocs/set-password/SetPasswordBloc';
import { SetPasswordRepoImpl } from '../../repositories/set-password/SetPasswordRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'SetPassword',
  components: {
    VgTextField,
    VgButton,
    VgSvg,
  },
  data() {
    return {
      SVG_SURVV_LOGO_ICON,

      bloc: new SetPasswordBloc({
        activationToken: String(this.$route.query.activationToken),
        setPasswordRepo: new SetPasswordRepoImpl(),
        userPreferenceRepo,
        notificationService,
        routerService: RouterServiceImpl.getInstance(),
      }),
      buttonLoading: false,
      message: new SetPasswordMessage(),
      validators: {
        email: true,
        password: 'ERROR_MESSAGE',
      },
      backgroundStyle: {
        height: '100vh',
        backgroundImage: `url(${IMAGE_LOGIN_BG.url})`,
        backgroundSize: 'cover',
      },
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
    this.bloc.outbox().subscribe((message: SetPasswordMessage) => {
      this.message = message;
    });
    this.bloc.inbox().next(
      new SetPasswordAction({
        type: 'INITIALIZE',
        payload: {},
      })
    );
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    async setPassword() {
      this.bloc.inbox().next(
        new SetPasswordAction({
          type: 'SET_PASSWORD',
          payload: {},
        })
      );
    },
    validate(key: string, value: string) {
      this.bloc.inbox().next(
        new SetPasswordAction({
          type: 'VALIDATE',
          payload: {
            form: { [key]: value },
          },
        })
      );
    },
    switchLanguage() {
      this.bloc.inbox().next(
        new SetPasswordAction({
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
.set-password-page {
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
      font-weight: 500;
    }
    &__set-password {
      color: rgba(0, 0, 0, 0.66);
      margin: var(--inset-mid) 0px;
      font-weight: 500;
    }

    .setPasswordFormPasswordField {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    #setPasswordFormSignInButton {
      width: 100%;
      margin-bottom: var(--inset-x-large);
    }
    #setPasswordFormLocalizationChange {
      text-decoration: underline;
      font-size: var(--font-size-small);
    }
  }
}
</style>
