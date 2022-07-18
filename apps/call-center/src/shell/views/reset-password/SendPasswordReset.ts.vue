<template>
  <div class="reset-password-page-container" :style="backgroundStyle">
    <div class="reset-password-page">
      <v-form
        class="reset-password-page__form"
        @submit.prevent="sendPasswordResetLink()"
      >
        <div id="brandLogoImg" class="reset-password-page__form__logo-brand">
          <vg-svg :src="SVG_SURVV_LOGO_ICON" width="100" height="100%"></vg-svg>
        </div>
        <div class="reset-password-page__form__header">
          <h4>{{ $t('RESET_PASSWORD_HEADER') }}</h4>
        </div>
        <div class="reset-password-page__form__sub-header">
          <h5>{{ $t('RESET_PASSWORD_SUB_HEADER') }}</h5>
        </div>
        <div class="reset-password-page__form__email-field">
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
        <div class="reset-password-page__form__reset-password-button">
          <vg-button
            :loading="resetPasswordButtonLoading"
            :disabled="resetPasswordButtonDisabled"
            expand
            large
            color="primary"
            type="submit"
          >
            {{ $t('RESET_PASSWORD') }}
          </vg-button>
        </div>
        <div class="reset-password-page__form__back-to-login-button">
          <vg-button
            expand
            large
            color="primary"
            type="submit"
            outlined
            :to="{
              name: ROUTE_NAMES.LOGIN,
            }"
          >
            {{ $t('BACK_TO_LOGIN') }}
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
import {
  SendPasswordResetAction,
  SendPasswordResetMessage,
} from '../../../core/blocs/reset-password/SendPasswordResetMessage';
import { SendPasswordResetBloc } from '../../../core/blocs/reset-password/SendPasswordResetBloc';

import { ResetPasswordRepoImpl } from '../../repositories/reset-password/ResetPasswordRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'ResetPassword',
  components: {
    VgTextField,
    VgButton,
    VgSvg,
  },
  data() {
    return {
      SVG_SURVV_LOGO_ICON,
      bloc: new SendPasswordResetBloc({
        resetPasswordRepo: new ResetPasswordRepoImpl(),
        userPreferenceRepo,
        notificationService,
        routerService: RouterServiceImpl.getInstance(),
      }),
      buttonLoading: false,
      message: new SendPasswordResetMessage(),
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
    resetPasswordButtonLoading(): boolean {
      return this.message.buttonStatus === 'PROCESSING';
    },
    resetPasswordButtonDisabled(): boolean {
      return this.message.buttonStatus === 'DISABLED';
    },
  },
  async created(): Promise<void> {
    this.bloc.outbox().subscribe((message: SendPasswordResetMessage) => {
      this.message = message;
    });
    this.bloc.inbox().next(
      new SendPasswordResetAction({
        type: 'INITIALIZE',
        payload: {},
      })
    );
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    sendPasswordResetLink() {
      this.bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'SEND_RESET_PASSWORD',
          payload: {},
        })
      );
    },
    validate(key: string, value: string) {
      this.bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { [key]: value },
          },
        })
      );
    },
    switchLanguage() {
      this.bloc.inbox().next(
        new SendPasswordResetAction({
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
.reset-password-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  &__form {
    width: 500px;
    padding: 50px;
    box-shadow: 0 1px 10px 1px rgb(78 78 78 / 20%);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-surface-light);
    &__logo-brand {
      margin-bottom: var(--inset-large);
    }
    &__logo-brand {
      max-width: 300px;
      margin-bottom: var(--inset-mid);
    }
    &__header {
      margin-bottom: var(--inset-mid);
      color: rgba(0, 0, 0, 0.66);
      font-weight: 500;
    }
    &__sub-header {
      margin-bottom: var(--inset-small);
      color: rgba(0, 0, 0, 0.66);
      font-weight: 400;
    }
    &__email-field {
      width: 100%;
      margin: var(--inset-x-large);
    }
    &__reset-password-button {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    &__back-to-login-button {
      width: 100%;
      margin-bottom: var(--inset-x-large);
    }
    &__signInFormLocalizationChange {
      text-decoration: underline;
      font-size: var(--font-size-small);
    }
  }
}
</style>
