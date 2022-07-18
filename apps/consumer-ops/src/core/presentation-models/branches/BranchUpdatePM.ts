import { Area } from '../../models/Area';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Branch } from '../../models/Branch';
import { BranchForm } from '../../models/BranchForm';
import { BranchRepo } from '../../repositories/branches/BranchRepo';
import { City } from '../../models/City';
import { ContactPerson, ContactPersonForm } from '../../models/ContactPerson';
import { Country } from '../../models/Country';
import { EntityId } from '@survv/commons/core/types';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { GeoRepo } from '../../repositories/Geo/GeoRepo';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { QueryFilter } from '@survv/commons/core/models/Query';
import { TagType } from '../../models/TagType';
import { TagsSelectionPM } from '../online-ordering/TagsSelectionPM';
import { UnifiedTag } from '../../models/UnifiedTag';
import {
  VendorOnlineProfile,
  VendorPosIntegrationType,
} from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class BranchUpdatePM extends BasePM {
  private _branchRepo: BranchRepo;
  private _geoRepo: GeoRepo;
  private _notificationService: NotificationService;
  private _tagsSelectionPM: TagsSelectionPM;
  private _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  posIntegrationTypes: { label: string; value: string }[];

  vendorId: number;
  vendorOnlineProfile: VendorOnlineProfile;
  branchId: EntityId;
  branchDetails: Branch;
  form: BranchForm;
  contactPersonForm: ContactPersonForm;
  countries: Country[];
  cities: City[];
  areas: Area[];
  shouldOpenSelectionsList: boolean;
  shouldShowMapModal: boolean;
  shouldOpenContactPersonForm: boolean;
  mapConfig = {
    point: [31.231727600097656, 30.036814151299254] as GeojsonCoordinates,
  };

  constructor(options: BranchUpdatePMOptions) {
    super();

    this._branchRepo = options.branchRepo;
    this._geoRepo = options.geoRepo;
    this._vendorOnlineProfileRepo = options.vendorOnlineProfileRepo;
    this._notificationService = options.notificationService;
    this._tagsSelectionPM = options.tagsSelectionPM;
    this.vendorId = options.vendorId;
    this.branchId = options.branchId;
    this.branchDetails = new Branch();
    this.vendorOnlineProfile = new VendorOnlineProfile();
    this.form = new BranchForm();
    this.contactPersonForm = new ContactPersonForm();
    this.countries = [] as Country[];
    this.cities = [] as City[];
    this.areas = [] as Area[];
    this.shouldOpenSelectionsList = false;
    this.shouldShowMapModal = false;
    this.shouldOpenContactPersonForm = false;

    this.posIntegrationTypes = VendorPosIntegrationType.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
  }

  get countriesSelection(): FormSelectionOption<number>[] {
    return this.countries.map((country) => ({
      value: country.id,
      label: `${country.name.en} - ${country.name.ar}`,
    }));
  }

  get citiesSelection(): FormSelectionOption<number>[] {
    return this.cities.map((city) => ({
      value: city.id,
      label: `${city.name.en} - ${city.name.ar}`,
    }));
  }

  get areasSelection(): FormSelectionOption<number>[] {
    return this.areas.map((area) => ({
      value: area.id,
      label: `${area.name.en} - ${area.name.ar}`,
    }));
  }

  async _hydrate(): Promise<void> {
    try {
      this.vendorOnlineProfile = await this._vendorOnlineProfileRepo.getProfile(
        this.vendorId
      );
      await this._hydrateBranchDetails();
      await this._hydrateCountries();
      if (this.form.address.countryId) {
        await this.hydrateCities(this.form.address.countryId);
        if (this.form.address.cityId) {
          await this.hydrateAreas(this.form.address.cityId);
        }
      }
      this._assignFormHandlers();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateBranchDetails(): Promise<void> {
    this.branchDetails = await this._branchRepo.getBranchDetails(this.branchId);
    this.form = BranchForm.from(this.branchDetails);
  }

  private async _hydrateCountries(): Promise<void> {
    this.countries = await this._geoRepo.getCountries();
  }

  async hydrateCities(countryId: number): Promise<void> {
    const filter: QueryFilter = {
      countryId,
    };
    this.cities = await this._geoRepo.getCities(filter);
  }

  async hydrateAreas(cityId: number): Promise<void> {
    const filter: QueryFilter = {
      cityId,
    };
    this.areas = await this._geoRepo.getAreas(filter);
  }

  closeTagsSelection(): void {
    this.shouldOpenSelectionsList = false;
  }

  async openSelectionsList(): Promise<void> {
    try {
      this.shouldOpenSelectionsList = true;
      await this._tagsSelectionPM?.hydrateTags({
        types: [
          TagType.CUISINE,
          TagType.VENUE,
          TagType.PICKUP,
          TagType.HASH_TAG,
        ],
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get tagsSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    if (this.shouldOpenSelectionsList) {
      return this._tagsSelectionPM!.tagsSelectionsList;
    }
    return [];
  }

  addSelections(selections: UnifiedTag[]): void {
    this.form.tags = selections;
    this.closeTagsSelection();
  }

  removeTagSelection(tagIndex: number): void {
    this.form.tags.splice(tagIndex, 1);
  }

  async submit(): Promise<boolean> {
    try {
      return await this.form.submit();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  async reset(): Promise<void> {
    this.form.reset();
  }

  get canSubmit(): boolean {
    return this.form.submittable;
  }

  private _assignFormHandlers(): void {
    this.form
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._branchRepo.updateBranch(
            this.vendorId,
            this.branchId,
            this.form,
            this.branchDetails
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

  openMapModal(): void {
    this.mapConfig.point =
      this.form.address.coordinates.length === 0
        ? this.mapConfig.point
        : (this.form.address.coordinates as GeojsonCoordinates);
    this.shouldShowMapModal = true;
  }

  closeMapModal(): void {
    this.shouldShowMapModal = false;
  }

  submitMapModal(pickupPointCoordinates: GeojsonCoordinates): void {
    this.form.address.coordinates = pickupPointCoordinates;
    this.closeMapModal();
  }

  submitContactPersonForm(): void {
    this.form.contactPersons.push(
      new ContactPerson({
        fullName: this.contactPersonForm.name,
        mobileNo: this.contactPersonForm.mobileNumber,
        email: this.contactPersonForm.email,
        title: this.contactPersonForm.title,
      })
    );
    this.closeContactPersonForm();
  }

  removeContactPerson(index: number): void {
    this.form.contactPersons.splice(index, 1);
  }

  closeContactPersonForm(): void {
    this.shouldOpenContactPersonForm = false;
    this.contactPersonForm.reset();
  }

  openContactPersonForm(): void {
    this.contactPersonForm.reset();
    this.shouldOpenContactPersonForm = true;
  }
}

interface BranchUpdatePMOptions {
  vendorId: number;
  branchId: number;
  branchRepo: BranchRepo;
  geoRepo: GeoRepo;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  tagsSelectionPM: TagsSelectionPM;
  notificationService: NotificationService;
}
