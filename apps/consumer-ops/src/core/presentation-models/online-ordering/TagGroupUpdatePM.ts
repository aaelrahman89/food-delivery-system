import ObjectUtils from '../../etc/ObjectUtils';
import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Notification,
  NotificationType,
} from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { SingleTagGroup } from '../../models/TagGroup';
import { TagGroupStatus } from '../../models/TagGroupStatus';
import { TagGroupsRepo } from '../../repositories/TagGroupsRepo';
import { UnifiedTag } from '../../models/UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification';
import { mapEnumsToSelections } from '@survv/commons/core/forms/selection';

interface TagGroupUpdatePMOptions {
  tagGroupsRepo: TagGroupsRepo;
  notificationService: NotificationService;
}

interface TagFormValidators extends Validators {
  'name.en': FormValidator;
  'name.ar': FormValidator;
  'status': FormValidator;
  'icon': FormValidator;
}

export class TagGroupUpdatePM extends BasePM {
  private _tagGroupsRepo: TagGroupsRepo;
  private _tagGroupId: number | undefined;
  private _notificationService: NotificationService;
  private _tagGroup: SingleTagGroup | undefined;
  tagGroupOptions: { [key: string]: UnifiedTag[] };
  form: {
    name: {
      en: string | undefined;
      ar: string | undefined;
    };
    status: TagGroupStatus | undefined;
    tags: UnifiedTag[] | [];
    icon: string | { type: string; base64String: string } | undefined;
  };

  readonly tagGroupStatusOptions = mapEnumsToSelections(
    TagGroupStatus.lookup()
  );

  constructor({ tagGroupsRepo, notificationService }: TagGroupUpdatePMOptions) {
    super();

    this._tagGroupId = undefined;
    this._tagGroupsRepo = tagGroupsRepo;
    this._notificationService = notificationService;
    this._tagGroup = undefined;
    this.form = {
      name: {
        en: undefined,
        ar: undefined,
      },
      status: undefined,
      tags: [],
      icon: undefined,
    };
    this.tagGroupOptions = {};
  }

  async _hydrate(): Promise<void> {
    try {
      this._tagGroup = await this._tagGroupsRepo.fetchTagGroup(
        this._tagGroupId!
      );
      this._hydrateForm();
      await this._hydrateTagSelectionGroups();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  private async _hydrateTagSelectionGroups(): Promise<void> {
    const list = await this._tagGroupsRepo.getUnifiedTags();
    const tagGroupOptions: { [key: string]: UnifiedTag[] } = {};
    list.items.forEach((tag) => {
      if (!tagGroupOptions[tag.type.toString()]) {
        tagGroupOptions[tag.type.toString()] = [tag];
      } else {
        tagGroupOptions[tag.type.toString()].push(tag);
      }
    });

    this.tagGroupOptions = tagGroupOptions;
  }

  private _hydrateForm(): void {
    this.form.name.en = this._tagGroup?.name.en;
    this.form.name.ar = this._tagGroup?.name.ar;
    this.form.status = this._tagGroup?.status;
    this.form.tags = this._tagGroup?.tags ?? [];
    this.form.icon = this._tagGroup?.icon;
  }

  private _isUpdated(): boolean {
    return !ObjectUtils.deepEqual(this.form, {
      name: {
        en: this._tagGroup?.name.en,
        ar: this._tagGroup?.name.ar,
      },
      status: this._tagGroup?.status,
      tags: this._tagGroup?.tags,
      icon: this._tagGroup?.icon,
    });
  }

  async submit(): Promise<boolean> {
    return this._longProcess(async () => {
      try {
        if (!this.isValid()) {
          this._notificationService.notify(Notification.badOperation());
          return false;
        }

        await this._tagGroupsRepo.editTagGroup({
          id: this._tagGroup?.id ?? 0,
          name: new MultilingualString({
            en: this.form.name.en,
            ar: this.form.name.ar,
          }),
          status: this.form.status as NonNullable<TagGroupStatus>,
          vendorType: new VendorType(this._tagGroup?.vendorType.value ?? ''),
          tags: this.form.tags,
          creationDate: this._tagGroup?.creationDate ?? new Datetime(0),
          icon: this.form.icon!,
        });
        this._notificationService.notify(Notification.successfulOperation());
        return true;
      } catch (error) {
        this._notificationService.notify(new Notification(error));
        return false;
      }
    });
  }

  async reset(id: EntityId): Promise<void> {
    this._tagGroupId = id;

    await this._longProcess(async () => {
      await this._hydrate();
    });
  }

  get canSubmit(): boolean {
    return this.isValid() && !this.loading && this._isUpdated();
  }

  onIconLoadingFailure(errModel: {
    message: string;
    code: string;
    args?: Record<string, string | number>;
  }): void {
    this._notificationService.notify(
      new Notification({
        type: NotificationType.ERROR,
        code: errModel.code,
      })
    );
  }

  validators(): TagFormValidators {
    return {
      'name.en': (): string | true => {
        return required(this.form?.name.en);
      },
      'name.ar': (): string | true => {
        return required(this.form?.name.ar);
      },
      'status': (): string | true => {
        return required(this.form?.status);
      },
      'icon': (): string | true => {
        return required(this.form?.icon);
      },
    };
  }
}
