import { BasePM } from '@survv/commons/core/base/BasePM';
import { TagStatus } from '../../models/TagStatus';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { required } from '@survv/commons/core/validations/form-validators/formValidators';

export class TagCreationPM extends BasePM {
  constructor({ vendorType, tagType, tagsRepo, notificationService }) {
    super();
    this._tagType = tagType;
    this._vendorType = vendorType;
    this._tagsRepo = tagsRepo;

    this.form = {
      icon: undefined,
      name: {
        en: undefined,
        ar: undefined,
      },
      status: TagStatus.values.VISIBLE,
    };
    this._notificationService = notificationService;

    this.tagStatusOptions = Object.keys(TagStatus.values).map((key) => {
      const tagStatus = new TagStatus(key);

      return {
        value: tagStatus.value,
        label: tagStatus.toString(),
      };
    });
  }

  async submit() {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        return this._notificationService.notify(badOperation());
      }
      try {
        await this._tagsRepo.createTag({
          vendorType: this._vendorType,
          type: this._tagType,
          name: this.form.name,
          icon: this.form.icon,
          status: this.form.status,
        });

        this._notificationService.notify(successfulOperation());

        return true;
      } catch (errModel) {
        this._notificationService.notify(createNotification(errModel));
        return false;
      }
    });
  }

  reset() {
    this.form = {
      icon: undefined,
      name: {
        en: undefined,
        ar: undefined,
      },
      status: TagStatus.values.VISIBLE,
    };
  }

  get canSubmit() {
    return this.isValid() && !this.loading;
  }

  onIconLoadingFailure(errModel) {
    this._notificationService.notify(createNotification(errModel));
  }

  validators() {
    return {
      'icon': () => {
        return required(this.form.icon);
      },
      'name.en': () => {
        return required(this.form.name.en);
      },
      'name.ar': () => {
        return required(this.form.name.ar);
      },
      'status': () => {
        return required(this.form.status);
      },
    };
  }
}
