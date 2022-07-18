import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { BranchProfileListItem } from '../../models/Branch';
import { BranchProfilesRepo } from '../../repositories/BranchProfilesRepo';
import { CatalogueForm } from '../../models/Catalogue';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators/formValidators';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfile } from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';

export class CatalogueFormPM extends BasePM {
  private readonly _vendorId: EntityId;
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _branchProfilesRepo: BranchProfilesRepo;
  private _openBranchesSelections: boolean;
  _branches: BranchProfileListItem[];
  form: CatalogueForm;
  vendorOnlineProfile: VendorOnlineProfile | undefined;

  constructor(options: CatalogueFormPMOptions) {
    super();
    this._vendorId = options.vendorId;
    this._vendorOnlineProfileRepo = options.vendorOnlineProfileRepo;
    this._branchProfilesRepo = options.branchProfilesRepo;
    this.vendorOnlineProfile = undefined;
    this._openBranchesSelections = false;
    this._branches = [];

    this.form = {
      displayName: { en: '', ar: '' },
      description: { en: '', ar: '' },
      orderingHours: { from: new Time('22:00:00'), to: new Time('22:00:00') },
      branches: [],
    };
  }

  async _hydrate(): Promise<void> {
    this.vendorOnlineProfile = await this._vendorOnlineProfileRepo.getProfile(
      this._vendorId
    );
    this._branches = await this._branchProfilesRepo.listCompletedProfiles(
      this._vendorId
    );
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

  openBranchesSelections(): void {
    this._openBranchesSelections = true;
  }

  closeBranchesSelections(): void {
    this._openBranchesSelections = false;
  }

  get shouldOpenBranchesSelections(): boolean {
    return this._openBranchesSelections;
  }

  addBranches(branches: BranchProfileListItem[]): void {
    this.form.branches = branches;
    this.closeBranchesSelections();
  }

  removeSelectedBranch(branch: BranchProfileListItem): void {
    this.form.branches = this.form.branches.filter(
      (selection) => selection.id !== branch.id
    );
  }

  disableDisplayNameEn(): boolean {
    return !this.vendorOnlineProfile!.languageSupport.en;
  }

  disableDisplayNameAr(): boolean {
    return !this.vendorOnlineProfile!.languageSupport.ar;
  }

  disableDescriptionEn(): boolean {
    return !this.vendorOnlineProfile!.languageSupport.en;
  }

  disableDescriptionAr(): boolean {
    return !this.vendorOnlineProfile!.languageSupport.ar;
  }

  validators(): CatalogueFormPMValidators {
    return {
      'displayName.en': (): string | true => {
        if (this.disableDisplayNameEn()) return true;
        return required(this.form.displayName.en);
      },
      'displayName.ar': (): string | true => {
        if (this.disableDisplayNameAr()) return true;
        return required(this.form.displayName.ar);
      },
    };
  }
}

interface CatalogueFormPMOptions {
  vendorId: EntityId;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  branchProfilesRepo: BranchProfilesRepo;
}

interface CatalogueFormPMValidators extends Validators {
  'displayName.en': FormValidator;
  'displayName.ar': FormValidator;
}
