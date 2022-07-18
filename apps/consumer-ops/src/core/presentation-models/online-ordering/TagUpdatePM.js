import { BasePM } from '@survv/commons/core/base/BasePM';
import { TagStatus } from '../../models/TagStatus';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { required } from '@survv/commons/core/validations/form-validators';

export class TagUpdatePM extends BasePM {
  constructor({ tagsRepo, notificationService }) {
    super();
    this._tagId = undefined;
    this._tagsRepo = tagsRepo;
    this._tag = undefined;
    this.form = {
      name: {
        en: undefined,
        ar: undefined,
      },
      status: undefined,
      icon: undefined,
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

  async _hydrate() {
    try {
      this._tag = await this._tagsRepo.fetchTag(this._tagId);
      this._hydrateForm();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  _hydrateForm() {
    this.form.name = { en: this._tag.name.en, ar: this._tag.name.ar };
    this.form.status = this._tag.status.value;
    this.form.icon = this._tag.icon;
  }

  validators() {
    return {
      'status': () => {
        return required(this.form.status);
      },
      'icon': () => {
        return required(this.form.icon);
      },
      'name.en': () => {
        return required(this.form.name.en);
      },
      'name.ar': () => {
        return required(this.form.name.ar);
      },
    };
  }

  async submit() {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        return this._notificationService.notify(badOperation());
      }

      try {
        await this._tagsRepo.editTag({
          id: this._tagId,
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

  get canSubmit() {
    return this.isValid() && !this.loading && this.isFormUpdated();
  }

  isFormUpdated() {
    return !deepEqual(this.form, {
      name: { en: this._tag.name.en, ar: this._tag.name.ar },
      status: this._tag.status.value,
      icon: this._tag.icon,
    });
  }

  async reset(tagId) {
    this._tagId = tagId;
    await this._hydrate();
  }

  onIconLoadingFailure(errModel) {
    this._notificationService.notify(createNotification(errModel));
  }
}
