import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Catalogue, CatalogueSection } from '../../models/Catalogue';
import { CatalogueItem, CatalogueItemForm } from '../../models/CatalogueItem';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import {
  LanguageSupport,
  VendorOnlineProfile,
} from '../../models/VendorOnlineProfile';
import { LocalError } from '@survv/commons/core/errors/errors';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Notification } from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TagType } from '../../models/TagType';
import { TagsSelectionPM } from './TagsSelectionPM';
import { UnifiedTag } from '../../models/UnifiedTag';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification';

export class CatalogueItemUpdatePM extends BasePM {
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _cataloguesRepo: CataloguesRepo;
  private readonly _catalogueItemsRepo: CatalogueItemsRepo;
  private readonly _notificationService: NotificationService;
  private readonly _states: CatalogueItemUpdatePMStates;
  private _state: CatalogueItemUpdatePMState;
  private _vendor: VendorOnlineProfile;
  private readonly _vendorId: EntityId;
  private _catalogue: Catalogue;
  private readonly _catalogueId: EntityId;
  private _item: CatalogueItem;
  private readonly _itemId: EntityId;
  private _children: CatalogueItemUpdatePMChildren;

  form: CatalogueItemForm;

  constructor({
    vendorOnlineProfileRepo,
    cataloguesRepo,
    catalogueItemsRepo,
    notificationService,
    vendorId,
    catalogueId,
    itemId,
    children,
  }: CatalogueItemUpdatePMOptions) {
    super();
    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this._cataloguesRepo = cataloguesRepo;
    this._catalogueItemsRepo = catalogueItemsRepo;
    this._notificationService = notificationService;
    this._vendor = new VendorOnlineProfile();
    this._vendorId = vendorId;
    this._catalogue = new Catalogue();
    this._catalogueId = catalogueId;
    this._item = new CatalogueItem();
    this._itemId = itemId;

    this.form = new CatalogueItemForm();

    this._states = {
      default: {
        shouldShowTagsSelection: false,
        shouldShowAllergiesSelection: false,
        shouldShowSectionsSelection: false,
      },
      tagsSelection: {
        shouldShowTagsSelection: true,
        shouldShowAllergiesSelection: false,
        shouldShowSectionsSelection: false,
      },
      allergiesSelection: {
        shouldShowTagsSelection: false,
        shouldShowAllergiesSelection: true,
        shouldShowSectionsSelection: false,
      },
      sectionsSelection: {
        shouldShowTagsSelection: false,
        shouldShowAllergiesSelection: false,
        shouldShowSectionsSelection: true,
      },
    };
    this._state = this._states.default;
    this._children = children;
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateVendor();
      await this._hydrateCatalogue();
      await this._hydrateItem();
      this.form = CatalogueItemForm.fromCatalogueItem(
        this._item,
        this._vendor.languageSupport
      );
      this._assignSubmitHandler();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateVendor(): Promise<void> {
    try {
      this._vendor = await this._vendorOnlineProfileRepo.getProfile(
        this._vendorId
      );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateCatalogue(): Promise<void> {
    try {
      this._catalogue = await this._cataloguesRepo.getCatalogue(
        this._catalogueId
      );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateItem(): Promise<void> {
    try {
      this._item = await this._catalogueItemsRepo.getItem(this._itemId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async submit(): Promise<boolean> {
    return this.form.submit();
  }

  onGalleryImageLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }

  async openTagsSelection(): Promise<void> {
    try {
      this._state = this._states.tagsSelection;
      await this._children.tagsSelectionPM.hydrateTags({
        types: [TagType.CUISINE, TagType.DIETARY, TagType.HASH_TAG],
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async openAllergiesSelection(): Promise<void> {
    try {
      this._state = this._states.allergiesSelection;
      await this._children.tagsSelectionPM.hydrateTags({
        types: [TagType.ALLERGY],
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async openSectionsSelection(): Promise<void> {
    this._state = this._states.sectionsSelection;
  }

  closeCurrentSelection(): void {
    this._state = this._states.default;
  }

  get tagsSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    return this._children.tagsSelectionPM.tagsSelectionsList;
  }

  get allergiesSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    return this._children.tagsSelectionPM.tagsSelectionsList;
  }

  get shouldShowTagsSelectionsList(): boolean {
    return this._state.shouldShowTagsSelection;
  }

  get shouldShowAllergiesSelectionsList(): boolean {
    return this._state.shouldShowAllergiesSelection;
  }

  get shouldShowSectionsSelectionsList(): boolean {
    return this._state.shouldShowSectionsSelection;
  }

  get vendorName(): MultilingualString {
    return this._vendor.name;
  }

  get catalogueDisplayName(): MultilingualString {
    return this._catalogue.displayName;
  }

  get itemDisplayName(): MultilingualString {
    return this._item.displayName;
  }

  get sectionsList(): BottomSheetListGroup<CatalogueSection>[] {
    return [
      {
        items: this._catalogue.catalogueSections.map((section) => ({
          id: section.id,
          label: section.displayName,
          value: section,
        })),
      },
    ];
  }

  get languageSupport(): LanguageSupport {
    return this._vendor.languageSupport;
  }

  private _assignSubmitHandler(): void {
    this.form
      .assignSubmitHandler(() => {
        return this._longProcess(async () => {
          await this._catalogueItemsRepo.updateItem(this.form, this._itemId);
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(Notification.successfulOperation());
      })
      .assignErrorHandler((err) => {
        this._notificationService.notify(createNotification(err));
      });
  }
}

interface CatalogueItemUpdatePMOptions {
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  cataloguesRepo: CataloguesRepo;
  catalogueItemsRepo: CatalogueItemsRepo;
  notificationService: NotificationService;
  vendorId: EntityId;
  catalogueId: EntityId;
  itemId: EntityId;
  children: CatalogueItemUpdatePMChildren;
}

interface CatalogueItemUpdatePMChildren {
  tagsSelectionPM: TagsSelectionPM;
}

interface CatalogueItemUpdatePMState {
  shouldShowTagsSelection: boolean;
  shouldShowAllergiesSelection: boolean;
  shouldShowSectionsSelection: boolean;
}

interface CatalogueItemUpdatePMStates {
  default: CatalogueItemUpdatePMState;
  tagsSelection: CatalogueItemUpdatePMState;
  allergiesSelection: CatalogueItemUpdatePMState;
  sectionsSelection: CatalogueItemUpdatePMState;
}
