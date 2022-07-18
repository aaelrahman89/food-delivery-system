import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { SignInRepo } from '../../repositories/SignInRepo';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { vendorRepoImpl } from '../../../shell/repositories/vendors/VendorRepoImpl';

class SignInPM extends BasePM {
  private readonly _signInRepo: SignInRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;

  branchCode = '';
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

    this.branchCode = '';
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
      await this._longProcess(async () => {
        const { token, vendorId } = await this._signInRepo.signIn(
          this.branchCode
        );
        await authTokenRepo.saveToken(token);
        await vendorRepoImpl.saveVendorId(vendorId);
      });
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

  validators(): Validators {
    return {
      branchCode: (): FormValidationResult => {
        if (required(this.branchCode) !== true) {
          return required(this.branchCode);
        }
        if (this.isValidBranchCode(this.branchCode) !== true) {
          return this.isValidBranchCode(this.branchCode);
        }
        return true;
      },
    };
  }

  isValidBranchCode(branchCode: string): string | true {
    const branchCodeRegex = /^\d{8}$/;
    return branchCodeRegex.test(branchCode) || 'FORM_INVALID_BRANCH_CODE';
  }
}

interface SignInPMOptions {
  signInRepo: SignInRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
}

export default SignInPM;
