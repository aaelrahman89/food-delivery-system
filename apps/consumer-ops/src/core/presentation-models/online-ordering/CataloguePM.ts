import { BasePM } from '@survv/commons/core/base/BasePM';
import {
  BottomSheetListGroup,
  ItemsList,
} from '@survv/commons/core/models/ItemsList';
import { BranchProfileListItem } from '../../models/Branch';
import { BranchProfilesRepo } from '../../repositories/BranchProfilesRepo';
import { Catalogue, CatalogueSection } from '../../models/Catalogue';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { CatalogueSectionForm } from '../../models/CatalogueSection';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TaxTier } from '../../models/TaxTier';
import { TaxTiersRepo } from '../../repositories/TaxTiersRepo';
import {
  VendorOnlineProfile,
  VendorTaxStatusType,
} from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification/notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class CataloguePM extends BasePM {
  private _notificationService: NotificationService;
  private _cataloguesRepo: CataloguesRepo;
  private _catalogueItemsRepo: CatalogueItemsRepo;
  private readonly _taxTiersRepo: TaxTiersRepo;
  private readonly _vendorId: EntityId;
  private readonly _catalogueId: EntityId;
  private _vendorProfileRepo: VendorOnlineProfileRepo;
  private _branchProfilesRepo: BranchProfilesRepo;
  private readonly _states: CataloguePMStates;
  private _state: CataloguePMState;
  private readonly _statusStates: CatalogueStatusStates;
  private _statusState: CatalogueStatusState;
  private _openBranchesSelections: boolean;
  taxTiers: ItemsList<TaxTier>;
  updatedCatalogueSections: CatalogueSection[];
  updatedSelectedCatalogueSection: CatalogueSection;
  selectedCatalogueSection: CatalogueSection;
  catalogue = new Catalogue();
  vendorProfile = new VendorOnlineProfile();
  _branches: BranchProfileListItem[];
  formBranches: BranchProfileListItem[];

  constructor(options: CataloguePMOptions) {
    super();
    const {
      cataloguesRepo,
      catalogueItemsRepo,
      vendorProfileRepo,
      branchProfilesRepo,
      notificationService,
      vendorId,
      catalogueId,
      isEditMode,
      children,
    } = options;
    this._notificationService = notificationService;
    this._cataloguesRepo = cataloguesRepo;
    this._catalogueItemsRepo = catalogueItemsRepo;
    this._catalogueId = catalogueId;
    this._vendorId = vendorId;
    this._vendorProfileRepo = vendorProfileRepo;
    this._branchProfilesRepo = branchProfilesRepo;
    this._taxTiersRepo = options.taxTiersRepo;
    this.taxTiers = {
      totalItemsCount: 0,
      items: [],
    };
    this._states = {
      viewCatalogueProfile: {
        shouldCatalogueSectionFormBeOpened: false,
        disableCatalogueProfile: false,
        catalogueSectionForm: undefined,
        isCatalogueSectionsInEditMode: false,
        reset: (): void => {
          return undefined;
        },
      },
      catalogueSectionCreation: {
        shouldCatalogueSectionFormBeOpened: true,
        disableCatalogueProfile: true,
        catalogueSectionForm: children.catalogueSectionForm,
        isCatalogueSectionsInEditMode: true,
        reset: (): void => {
          this._selectLastCatalogueSection();
        },
      },
      catalogueSectionUpdate: {
        shouldCatalogueSectionFormBeOpened: true,
        disableCatalogueProfile: true,
        catalogueSectionForm: children.catalogueSectionForm,
        isCatalogueSectionsInEditMode: true,
        reset: (): void => {
          this.selectCatalogueSection(
            this.catalogue.catalogueSections.filter(
              (section) => section.id === this.selectedCatalogueSection.id
            )[0]
          );
        },
      },
      editingCatalogueSections: {
        shouldCatalogueSectionFormBeOpened: false,
        disableCatalogueProfile: true,
        catalogueSectionForm: undefined,
        isCatalogueSectionsInEditMode: true,
        reset: (): void => {
          return undefined;
        },
      },
    };
    this._statusStates = {
      DRAFT: {
        shouldShowPublish: false,
        shouldShowSetAsReady: true,
        shouldShowUnPublish: false,
      },
      READY: {
        shouldShowPublish: true,
        shouldShowSetAsReady: false,
        shouldShowUnPublish: false,
      },
      PUBLISHED: {
        shouldShowPublish: false,
        shouldShowSetAsReady: false,
        shouldShowUnPublish: true,
      },
    };
    this._state = isEditMode
      ? this._states.editingCatalogueSections
      : this._states.viewCatalogueProfile;
    this._statusState = this._statusStates.DRAFT;
    this._openBranchesSelections = false;
    this.selectedCatalogueSection = new CatalogueSection();
    this.updatedSelectedCatalogueSection = new CatalogueSection();
    this.updatedCatalogueSections = [];
    this._branches = [];
    this.formBranches = [];
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateVendorProfile();
      await this._hydrateCatalogue();
      this._selectFirstCatalogueSection();
      this.updatedCatalogueSections = [...this.catalogue.catalogueSections];
      await this._hydrateTaxTiers();
      await this._hydrateBranches();
      this._hydrateFormBranches();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateTaxTiers(): Promise<void> {
    try {
      this.taxTiers = await this._taxTiersRepo.listTiers();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateVendorProfile(): Promise<void> {
    this.vendorProfile = await this._vendorProfileRepo.getProfile(
      this._vendorId
    );
  }

  private async _hydrateCatalogue(): Promise<void> {
    try {
      this.catalogue = await this._cataloguesRepo.getCatalogue(
        this._catalogueId
      );
      this.updatedCatalogueSections = [...this.catalogue.catalogueSections];
      this._statusState = this._statusStates[this.catalogue.status.valueOf()];
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateBranches(): Promise<void> {
    this._branches = await this._branchProfilesRepo.listCompletedProfiles(
      this._vendorId
    );
  }

  private _hydrateFormBranches(): void {
    this.formBranches = [
      ...this._branches.filter((branch) =>
        this.catalogue?.publishedBranches.some(
          (publishedBranch) => publishedBranch.id === branch.id
        )
      ),
    ];
  }

  async refresh(): Promise<void> {
    await this._hydrateCatalogue();
    this._hydrateFormBranches();
    this._refreshSelectedCatalogueSection();
  }

  private _refreshSelectedCatalogueSection(): void {
    if (this.catalogue.catalogueSections.length > 0) {
      this.selectCatalogueSection(
        this.catalogue.catalogueSections.filter(
          (section) => section.id === this.selectedCatalogueSection.id
        )[0]
      );
    }
  }

  get disableCatalogueProfile(): boolean {
    return this._state.disableCatalogueProfile;
  }

  get isCatalogueSectionFormOpened(): boolean {
    return this._state.shouldCatalogueSectionFormBeOpened;
  }

  get shouldOpenBranchesSelections(): boolean {
    return this._openBranchesSelections;
  }

  get branches(): BottomSheetListGroup<BranchProfileListItem>[] {
    return [
      {
        items: this._branches.map((branch) => ({
          id: branch.id,
          label: branch.displayName,
          value: branch,
        })),
      },
    ];
  }

  async addBranches(branches: BranchProfileListItem[]): Promise<void> {
    try {
      await this._cataloguesRepo.updateBranches(this._catalogueId, branches);
      this._notificationService.notify(successfulOperation());
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
    this.closeBranchesSelections();
    await this.refresh();
  }

  openBranchesSelections(): void {
    this._openBranchesSelections = true;
  }

  closeBranchesSelections(): void {
    this._openBranchesSelections = false;
  }

  updateCatalogueSections(): void {
    this._state = this._states.editingCatalogueSections;
  }

  discardCatalogueSectionsUpdate(): void {
    this.resetLayout();
    this._state = this._states.viewCatalogueProfile;
  }

  openCatalogueSectionCreation(): void {
    this._state = this._states.catalogueSectionCreation;
    this._state.catalogueSectionForm = new CatalogueSectionForm({
      languageSupport: this.vendorProfile.languageSupport,
    });
    this._state.catalogueSectionForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._cataloguesRepo.createSection(
            this._catalogueId,
            this._state.catalogueSectionForm!
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  canApplyTaxTier(): boolean {
    return !VendorTaxStatusType.NOT_APPLICABLE.equals(
      this.vendorProfile.taxStatus.valueOf()
    );
  }

  openCatalogueSectionUpdate(): void {
    this._state = this._states.catalogueSectionUpdate;
    this._state.catalogueSectionForm = new CatalogueSectionForm({
      languageSupport: this.vendorProfile.languageSupport,
      formInputs: {
        displayName: {
          ...this.selectedCatalogueSection.displayName,
        },
        taxTierId: this.selectedCatalogueSection.taxTier.id,
        vendorTaxStatus: this.vendorProfile.taxStatus.valueOf(),
      },
    });
    this._state.catalogueSectionForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._cataloguesRepo.updateSection(
            this._catalogueId,
            this.selectedCatalogueSection.id,
            this._state.catalogueSectionForm!
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  discardCatalogueSectionForm(): void {
    this._state = this._states.editingCatalogueSections;
  }

  async setItemAsPopular(id: EntityId): Promise<void> {
    try {
      await this._catalogueItemsRepo.setPopular(id);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async unSetItemAsPopular(id: EntityId): Promise<void> {
    try {
      await this._catalogueItemsRepo.unSetPopular(id);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async archiveItem(id: EntityId): Promise<void> {
    try {
      await this._catalogueItemsRepo.archiveItem(this._catalogueId, id);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get isEditMode(): boolean {
    return this._state !== this._states.viewCatalogueProfile;
  }

  async onCatalogueSectionFormSubmission(): Promise<void> {
    await this.refresh();
    this._state.reset();
    this._state = this._states.editingCatalogueSections;
  }

  selectCatalogueSection(section: CatalogueSection): void {
    this.selectedCatalogueSection = section;
    this.updatedSelectedCatalogueSection = new CatalogueSection({
      ...this.selectedCatalogueSection,
    });
  }

  get catalogueSectionForm(): CatalogueSectionForm | undefined {
    return this._state.catalogueSectionForm;
  }

  get disableSaveLayoutChanges(): boolean {
    return !this._layoutChanged;
  }

  resetLayout(): void {
    this.updatedCatalogueSections = [...this.catalogue.catalogueSections];
    this.updatedSelectedCatalogueSection = new CatalogueSection({
      ...this.selectedCatalogueSection,
    });
  }

  async saveLayoutChanges(): Promise<boolean> {
    try {
      if (this._layoutChanged) {
        if (this._catalogueSectionsOrderChanged)
          await this._saveCatalogueSectionsOrderChanges();

        if (this._catalogueSectionItemsOrderChanged)
          await this._saveCatalogueSectionItemsOrderChanges();

        await this.refresh();

        this._state = this._states.viewCatalogueProfile;
        return true;
      }

      return false;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  private async _saveCatalogueSectionsOrderChanges(): Promise<void> {
    await this._cataloguesRepo.arrangeSections(
      this._catalogueId,
      this.updatedCatalogueSections
    );
  }

  private async _saveCatalogueSectionItemsOrderChanges(): Promise<void> {
    await this._cataloguesRepo.arrangeSectionItems(
      this._catalogueId,
      this.selectedCatalogueSection.id,
      this.updatedSelectedCatalogueSection.items
    );
  }

  private _selectFirstCatalogueSection(): void {
    if (this.catalogue.catalogueSections.length > 0)
      this.selectCatalogueSection(this.catalogue.catalogueSections[0]);
  }

  private _selectLastCatalogueSection(): void {
    this.selectCatalogueSection(
      this.catalogue.catalogueSections[
        this.catalogue.catalogueSections.length - 1
      ]
    );
  }

  private get _catalogueSectionsOrderChanged(): boolean {
    return !this.updatedCatalogueSections.every(
      (catalogueSection, index): boolean =>
        catalogueSection.id === this.catalogue.catalogueSections[index].id
    );
  }

  private get _layoutChanged(): boolean {
    return (
      this._catalogueSectionsOrderChanged ||
      this._catalogueSectionItemsOrderChanged
    );
  }

  private get _catalogueSectionItemsOrderChanged(): boolean {
    return !this.selectedCatalogueSection?.items.every(
      (item, index) =>
        item.id === this.updatedSelectedCatalogueSection.items[index].id
    );
  }

  async setCatalogueAsReady(): Promise<void> {
    try {
      await this._cataloguesRepo.setCatalogueAsReady(this._catalogueId);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async publishCatalogue(): Promise<void> {
    try {
      await this._cataloguesRepo.publishCatalogue(this._catalogueId);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async unPublishCatalogue(): Promise<void> {
    try {
      await this._cataloguesRepo.unPublishCatalogue(this._catalogueId);
      this._notificationService.notify(successfulOperation());
      await this.refresh();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get shouldShowSetAsReady(): boolean {
    return this._statusState.shouldShowSetAsReady;
  }

  get shouldShowPublish(): boolean {
    return this._statusState.shouldShowPublish;
  }

  get shouldShowUnPublish(): boolean {
    return this._statusState.shouldShowUnPublish;
  }
}

interface CataloguePMOptions {
  cataloguesRepo: CataloguesRepo;
  catalogueItemsRepo: CatalogueItemsRepo;
  vendorProfileRepo: VendorOnlineProfileRepo;
  branchProfilesRepo: BranchProfilesRepo;
  taxTiersRepo: TaxTiersRepo;
  notificationService: NotificationService;
  vendorId: EntityId;
  catalogueId: EntityId;
  isEditMode: boolean;
  children: CataloguePMChildren;
}

interface CataloguePMChildren {
  catalogueSectionForm: CatalogueSectionForm;
}

interface CataloguePMStates {
  viewCatalogueProfile: CataloguePMState;
  editingCatalogueSections: CataloguePMState;
  catalogueSectionCreation: CataloguePMState;
  catalogueSectionUpdate: CataloguePMState;
}

type CatalogueStatusStates = Record<string, CatalogueStatusState>;

interface CatalogueStatusState {
  shouldShowSetAsReady: boolean;
  shouldShowPublish: boolean;
  shouldShowUnPublish: boolean;
}

interface CataloguePMState {
  disableCatalogueProfile: boolean;
  shouldCatalogueSectionFormBeOpened: boolean;
  catalogueSectionForm: CatalogueSectionForm | undefined;
  isCatalogueSectionsInEditMode: boolean;
  reset(): void;
}
