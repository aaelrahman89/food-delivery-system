import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import {
  FormValidationResult,
  FormValidator,
} from '@survv/commons/core/validations/form-validators';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { SignInRepo } from '../../repositories/SignInRepo';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { errors } from '../../errors';

export class SignInPM extends BasePM {
  private readonly _signInRepo: SignInRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;
  form: SignInForm;
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  BRAND_NAME: string;

  constructor(options: SignInPMOptions) {
    super();

    const { signInRepo, userPreferenceRepo, notificationService } = options;
    this._signInRepo = signInRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._notificationService = notificationService;

    this.form = { email: '', password: '' };
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
    this.BRAND_NAME = '';
  }

  async _hydrate(): Promise<void> {
    ({
      logoLtr: this.logoLtr,
      logoRtl: this.logoRtl,
      favicon: this.favicon,
      BRAND_NAME: this.BRAND_NAME,
    } = await this._userPreferenceRepo.getAppCustomizations());
  }

  async signIn(): Promise<void> {
    try {
      const token = await this._signInRepo.signIn(this.form);
      await authTokenRepo.saveToken(token, ['business-ops', 'consumer-ops']);
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async switchLanguage(): Promise<void> {
    try {
      await this._userPreferenceRepo.switchLanguage();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get canSubmit(): boolean {
    return this.isValid() && !this.loading;
  }

  validators(): SignInFormValidators {
    return {
      email: (): FormValidationResult => {
        if (!this.form?.email) {
          return errors.missingEmailError;
        }
        if (!/\S+@\S+\.\S+/.test(this.form?.email)) {
          return errors.invalidEmailFormatError;
        }
        return true;
      },
      password: (): FormValidationResult => {
        if (!this.form?.password) {
          return errors.missingPasswordError;
        }
        return true;
      },
    };
  }
}

interface SignInPMOptions {
  signInRepo: SignInRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
}

interface SignInForm {
  email: string;
  password: string;
}

interface SignInFormValidators extends Validators {
  email: FormValidator;
  password: FormValidator;
}
