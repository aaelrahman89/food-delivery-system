import { BasePM } from '@survv/commons/core/base/BasePM';
import { createNotification } from '../../notification';
import { errors } from '../../errors';

class UserActivationPM extends BasePM {
  constructor({
    password,
    confirmPassword,
    activationToken = '',
    notificationService,
    userPreferenceRepo,
    usersRepo,
  } = {}) {
    super();
    this.loading = true;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.activationToken = activationToken;
    this._userPreferenceRepo = userPreferenceRepo;
    this._notificationService = notificationService;
    this._usersRepo = usersRepo;
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
    this.BRAND_NAME = '';
    this.activationTokenExists = false;
  }

  async _hydrate() {
    this.activationTokenExists = await this._usersRepo.activationTokenExists(
      this.activationToken
    );
    ({
      logoLtr: this.logoLtr,
      logoRtl: this.logoRtl,
      favicon: this.favicon,
      BRAND_NAME: this.BRAND_NAME,
    } = await this._userPreferenceRepo.getAppCustomizations());
  }

  validatePassword() {
    if (!this.password) {
      return errors.missingPasswordError;
    }
    return true;
  }

  validateConfirmPassword() {
    if (this.password != this.confirmPassword) {
      return errors.passwordMismatchError;
    }
    return true;
  }

  async switchLanguage() {
    try {
      await this._userPreferenceRepo.switchLanguage();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  canSubmit() {
    return (
      this.validatePassword() === true &&
      this.validateConfirmPassword() === true
    );
  }

  async activateOpsUser() {
    return this._longProcess(async () => {
      await this._usersRepo.activateUser(this.password, this.activationToken);
    });
  }
}

export default UserActivationPM;
