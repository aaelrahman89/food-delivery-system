<template>
  <div class="email-resend-page-container" :style="backgroundStyle">
    <div class="email-resend-page">
      <v-form
        class="email-resend-page__form"
        @submit.prevent="resendResetPassword"
      >
        <div id="brandLogoImg" class="email-resend-page__form__logo-brand">
          <vg-svg :src="SVG_SURVV_LOGO_ICON" width="100" height="100%"></vg-svg>
        </div>
        <div class="email-resend-page__form__header">
          <h4>{{ $t('RESET_PASSWORD_HEADER') }}</h4>
        </div>
        <div class="email-resend-page__form__sub-header">
          <h5>
            {{ $t('PASSWORD_SENT_SUB_HEADER') }}
            <span class="email-resend-page__form__sub-header__email">{{
              this.$route.params.userEmail
            }}</span>
          </h5>
        </div>
        <div v-if="timeLeft > 0" class="email-resend-page__form__resend-link">
          <h5>
            {{
              `${$t('EMAIL_RESEND_MESSAGE_INACTIVE')} (${formattedTimeLeft}) `
            }}
          </h5>
        </div>
        <div v-else class="email-resend-page__form__resend-link">
          <h5>
            {{ $t('EMAIL_RESEND_MESSAGE_ACTIVE') }}
            <span
              class="email-resend-page__form__resend-link__hyper"
              @click="resendResetPassword"
              >{{ $t('RESEND_LINK') }}</span
            >
          </h5>
        </div>

        <div class="email-resend-page__form__back-to-reset-password-button">
          <vg-button
            outlined
            expand
            large
            color="primary"
            :to="{
              name: ROUTE_NAMES.SEND_RESET_PASSWORD_LINK,
            }"
          >
            {{ $t('GO_BACK') }}
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
import { ResetPasswordRepoImpl } from '../../repositories/reset-password/ResetPasswordRepoImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import {
  SendPasswordResetAction,
  SendPasswordResetMessage,
} from '../../../core/blocs/reset-password/SendPasswordResetMessage';
import { SendPasswordResetBloc } from '../../../core/blocs/reset-password/SendPasswordResetBloc';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';

export default Vue.extend({
  name: 'EmailResend',
  components: {
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
      timePassed: 0,
      intervalId: 0,
    };
  },
  computed: {
    logoUrl(): string {
      if (this.$rtl) {
        return this.message.state.logoRtl;
      }
      return this.message.state.logoLtr;
    },
    timeLeft(): number {
      const timerAmount = 30;
      if (this.timePassed === timerAmount) {
        clearInterval(this.intervalId);
      }
      return timerAmount - this.timePassed;
    },
    formattedTimeLeft(): string {
      const { timeLeft } = this;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const displayMinutes = minutes;
      const displaySeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

      return `${displayMinutes}:${displaySeconds}`;
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
  mounted() {
    this.startTimer();
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    resendResetPassword() {
      this.bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'RESEND_RESET_PASSWORD',
          payload: { form: { email: this.$route.params.userEmail } },
        })
      );
      this.timeLeft = 30;
      this.timePassed = 0;
      this.startTimer();
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
    startTimer(): void {
      this.intervalId = window.setInterval(() => {
        this.timePassed += 1;
      }, 1000);
    },
  },
});
</script>

<style lang="scss" scoped>
.email-resend-page {
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
      text-align: center;
      margin-bottom: var(--inset-small);
      color: rgba(0, 0, 0, 0.66);
      font-weight: 400;
      &__email {
        color: var(--color-primary);
      }
    }
    &__resend-link {
      margin: var(--inset-x-large);
      color: rgba(0, 0, 0, 0.33);
      &__hyper {
        color: var(--color-primary);
        cursor: pointer;
      }
    }
    &__back-to-reset-password-button {
      width: 100%;
      margin-bottom: var(--inset-small);
    }
    &__signInFormLocalizationChange {
      text-decoration: underline;
      font-size: var(--font-size-small);
    }
  }
}
</style>
