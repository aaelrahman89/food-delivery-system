import { BasePM } from '@survv/commons/core/base/BasePM';
import { TagGroupStatus } from '../../models/TagGroupStatus';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { required } from '@survv/commons/core/validations/form-validators';

export class TagGroupCreationPM extends BasePM {
  constructor({ tagGroupsRepo, vendorType, notificationService }) {
    super();
    this._tagGroupsRepo = tagGroupsRepo;
    this._vendorType = vendorType;
    this.form = {
      name: {
        en: undefined,
        ar: undefined,
      },
      status: undefined,
      tags: [],
      icon: undefined,
    };
    this._notificationService = notificationService;

    this.tagGroupOptions = {};
  }

  async _hydrate() {
    await this._hydrateTagSelectionGroups();
  }

  async _hydrateTagSelectionGroups() {
    const list = await this._tagGroupsRepo.getUnifiedTags();
    const tagGroupOptions = {};
    list.items.forEach((tag) => {
      if (!tagGroupOptions[tag.type.toString()]) {
        tagGroupOptions[tag.type.toString()] = [tag];
      } else {
        tagGroupOptions[tag.type.toString()].push(tag);
      }
    });

    this.tagGroupOptions = tagGroupOptions;
  }

  async submit() {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        return this._notificationService.notify(badOperation());
      }
      try {
        await this._tagGroupsRepo.createTagGroup({
          name: this.form.name,
          vendorType: this._vendorType,
          status: this.form.status,
          tags: this.form.tags,
          icon: this.form.icon,
        });
        this._notificationService.notify(successfulOperation());
        return true;
      } catch (errModel) {
        this._notificationService.notify(createNotification(errModel));
        return false;
      }
    });
  }

  async reset() {
    this.form = {
      icon: undefined,
      name: {
        en: undefined,
        ar: undefined,
      },
      status: TagGroupStatus.VISIBLE.valueOf(),
      tags: [],
    };

    await this._longProcess(async () => {
      await this._hydrateTagSelectionGroups();
    });
  }

  get canSubmit() {
    return this.isValid() && !this.loading;
  }

  onIconLoadingFailure(errModel) {
    this._notificationService.notify(createNotification(errModel));
  }

  validators() {
    return {
      'name.en': () => {
        return required(this.form.name.en);
      },
      'name.ar': () => {
        return required(this.form.name.ar);
      },
      'status': () => {
        return required(this.form.status);
      },
      'icon': () => {
        return required(this.form.icon);
      },
    };
  }
}
