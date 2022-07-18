import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { ContactPerson, ContactPersonForm } from '../../models/ContactPerson';
import { DeliveryFleet } from '../../models/DeliveryFleet';
import { DispatchingModel } from '../../models/DispatchingModel';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '@survv/commons/core/forms/selection';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { OrderingSystem } from '../../models/OrderingSystem';
import { TagType } from '../../models/TagType';
import { TagsSelectionPM } from './TagsSelectionPM';
import { UnifiedTag } from '../../models/UnifiedTag';
import {
  VendorOnlineProfile,
  VendorOnlineProfileForm,
  VendorPosIntegrationType,
} from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class VendorOnlineProfileUpdatePM extends BasePM {
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _notificationService: NotificationService;
  private readonly _states: VendorOnlineProfileUpdatePMStates;
  private _state: VendorOnlineProfileUpdatePMState;
  private readonly _vendorId: EntityId;
  private _shouldShowContactPersonForm = false;
  vendorOnlineProfile: VendorOnlineProfile;
  form: VendorOnlineProfileForm;
  contactPersonForm: ContactPersonForm;
  isOpenedAffectedTaxedCataloguesDialog = false;
  untaxedCatalogues = 0;
  mappedOrderingSystems: FormSelectionOption<EnumClass>[];
  posIntegrationTypes: { label: string; value: string }[];
  mappedDispatchingModels: { label: string; value: string }[];
  mappedDeliveryFleets: { label: string; value: string }[];
  constructor({
    vendorOnlineProfileRepo,
    notificationService,
    vendorId,
    children,
  }: VendorOnlineProfileUpdatePMOptions) {
    super();
    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this._notificationService = notificationService;

    this.form = new VendorOnlineProfileForm();
    this.contactPersonForm = new ContactPersonForm();

    this.mappedOrderingSystems = mapEnumsToSelections(OrderingSystem.lookup());
    this.mappedDispatchingModels = DispatchingModel.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this.posIntegrationTypes = VendorPosIntegrationType.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this.mappedDeliveryFleets = DeliveryFleet.lookup()
      .filter((item) => item.valueOf() !== 'NONE')
      .map((item) => ({
        label: item.toString(),
        value: item.valueOf(),
      }));
    this.vendorOnlineProfile = new VendorOnlineProfile();
    this._vendorId = vendorId;

    this._states = {
      update: { tagsSelection: undefined },
      tagsSelection: {
        tagsSelection: children.tagsSelectionPM,
      },
    };
    this._state = this._states.update;
    this._assignContactPersonFormHandlers();
  }

  async _hydrate(): Promise<void> {
    this.vendorOnlineProfile = await this._vendorOnlineProfileRepo.getProfile(
      this._vendorId
    );

    this.form = VendorOnlineProfileForm.fromVendorOnlineProfile(
      this.vendorOnlineProfile
    );
    this._assignFormHandlers();
  }

  async submit(): Promise<boolean> {
    try {
      return await this.form.submit();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  onLogoLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }

  onGalleryImageLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }

  async openTagSelection(): Promise<void> {
    try {
      this._state = this._states.tagsSelection;
      await this._state.tagsSelection!.hydrateTags({
        types: [TagType.CUISINE, TagType.VENUE, TagType.HASH_TAG],
      });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  closeTagsSelection(): void {
    this._state = this._states.update;
  }

  get tagsSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    if (this.shouldShowSelectionsList) {
      return this._state.tagsSelection!.tagsSelectionsList;
    }
    return [];
  }

  get shouldShowSelectionsList(): boolean {
    return this._states.tagsSelection === this._state;
  }

  get canSubmit(): boolean {
    return this.form.submittable;
  }

  openAddContactPersonForm(): void {
    this.contactPersonForm.reset();
    this._shouldShowContactPersonForm = true;
  }

  closeAddContactPersonForm(): void {
    this._shouldShowContactPersonForm = false;
  }

  get shouldShowContactPersonBottomSheet(): boolean {
    return this._shouldShowContactPersonForm;
  }

  async showAffectedUntaxedCataloguesDialog(): Promise<number> {
    try {
      await this._longProcess(async () => {
        this.untaxedCatalogues = (
          await this._vendorOnlineProfileRepo.checkUntaxedCatalogues(
            this._vendorId,
            this.form.taxStatus
          )
        ).length;

        if (this.untaxedCatalogues) {
          this.isOpenedAffectedTaxedCataloguesDialog = true;
        }
      });
      return this.untaxedCatalogues;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
    return 0;
  }

  onOrderingSystemChanged(val: string): void {
    this.form.orderingSystem = new OrderingSystem(val).valueOf();
    this.form.deliverBy = new DeliveryFleet('NONE').valueOf();
    this.form.estimatedDeliveryTimeInMinutes = 0;
    this.form.dispatchingModel = new DispatchingModel('NONE').valueOf();

    this.form.fakeVendor = OrderingSystem.FAKE_VENDOR.equals(
      this.form.orderingSystem
    );
  }

  get shouldShowDeliverBy(): boolean {
    return (
      OrderingSystem.BRANCHES_DASHBOARD.equals(this.form.orderingSystem) ||
      OrderingSystem.CALL_CENTER_DASHBOARD.equals(this.form.orderingSystem)
    );
  }

  get shouldShowEstimatedDeliveryTime(): boolean {
    return DeliveryFleet.VENDOR_FLEET.equals(this.form.deliverBy);
  }

  get shouldShowDispatchingModel(): boolean {
    return OrderingSystem.FAKE_VENDOR.equals(this.form.orderingSystem);
  }

  get hasVendorUsers(): number {
    return this.form.contactPeople.length;
  }

  async deleteContact(contactIndex: number): Promise<void> {
    try {
      await this._vendorOnlineProfileRepo.deleteVendorUser(
        this.form.contactPeople[contactIndex].id
      );
      this.form.contactPeople.splice(contactIndex, 1);
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  hideAffectedUntaxedCataloguesDialog(): void {
    this.isOpenedAffectedTaxedCataloguesDialog = false;
  }

  private _assignFormHandlers(): void {
    this.form
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._vendorOnlineProfileRepo.updateProfile(
            this._vendorId,
            this.form
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

  private _assignContactPersonFormHandlers(): void {
    let contactPerson = new ContactPerson();
    this.contactPersonForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          contactPerson = await this._vendorOnlineProfileRepo.addVendorUser(
            this._vendorId,
            this.contactPersonForm,
            this.vendorOnlineProfile.orderingSystem.equals(
              OrderingSystem.CALL_CENTER_DASHBOARD
            )
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
        this.form.contactPeople.push(contactPerson);
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }
}

interface VendorOnlineProfileUpdatePMOptions {
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
  vendorId: EntityId;
  children: VendorOnlineProfileUpdatePMChildren;
}

interface VendorOnlineProfileUpdatePMChildren {
  tagsSelectionPM: TagsSelectionPM;
}

interface VendorOnlineProfileUpdatePMState {
  tagsSelection: TagsSelectionPM | undefined;
}

interface VendorOnlineProfileUpdatePMStates {
  update: VendorOnlineProfileUpdatePMState;
  tagsSelection: VendorOnlineProfileUpdatePMState;
}
