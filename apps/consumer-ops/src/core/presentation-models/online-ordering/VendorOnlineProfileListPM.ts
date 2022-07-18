import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { CatalogueStatus } from '../../models/Catalogue';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '@survv/commons/core/forms/selection';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Query, filterOperators } from '@survv/commons/core/models/Query';
import {
  VendorOnlineProfileList,
  VendorOpsProfileListItem,
} from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { VendorOpsProfileListPM } from './VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification/notification';

export class VendorOnlineProfileListPM extends BaseListingPM {
  list?: VendorOnlineProfileList;
  readonly catalogueStatusOptions: FormSelectionOption<CatalogueStatus>[];
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _notificationService: NotificationService;

  private readonly _states: {
    list: VendorOnlineProfileListStates;
    listOpsVendors: VendorOnlineProfileListStates;
  };

  private _state: VendorOnlineProfileListStates;

  children?: VendorOnlineProfileListPMChildren;

  constructor(params: VendorOnlineProfileListPMParams) {
    const {
      vendorType,
      query,
      vendorOnlineProfileRepo,
      notificationService,
      children,
    } = params;
    super({
      query,
      filterMap: {
        vendorType: { operator: filterOperators.EQUAL, fieldName: 'type' },
        vendorStatus: {
          fieldName: 'active',
          operator: filterOperators.IN,
        },
        posIntegrated: {
          fieldName: 'posIntegrated',
          operator: filterOperators.EQUAL,
        },
        label: {
          operator: filterOperators.REGEX,
          fieldName: 'label',
        },
        // all filters starting with "catalogue" string will treated as a catalogueFilter
        // the string will be removed and the first character will be lowerCased
        // e.g "catalogueStatus" will be transformed to "status"
        catalogueStatus: {
          operator: filterOperators.IN,
          fieldName: 'catalogueStatus',
        },
      },
      hardFilter: {
        vendorType: vendorType.valueOf(),
      },
    });

    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this._notificationService = notificationService;

    this.list = undefined;
    this._states = {
      list: {
        vendorOpsProfileListPM: undefined,
      },
      listOpsVendors: {
        vendorOpsProfileListPM: children?.vendorOpsProfileListPM,
      },
    };

    this._state = this._states.list;
    this.catalogueStatusOptions = mapEnumsToSelections(
      CatalogueStatus.lookup()
    );
  }

  async _hydrate(): Promise<void> {
    await this._hydrateProfileList();
  }

  async _hydrateProfileList(): Promise<void> {
    try {
      this.list = await this._vendorOnlineProfileRepo.listProfiles(
        this._backendQuery
      );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrateProfileList();
  }

  async openOpsVendors(): Promise<void> {
    this._state = this._states.listOpsVendors;
    return this._state.vendorOpsProfileListPM!.reset();
  }

  closeOpsVendors(): void {
    this._state = this._states.list;
  }

  get shouldShowOpsVendors(): boolean {
    return [this._states.listOpsVendors].includes(this._state);
  }

  get opsVendors():
    | BottomSheetListGroup<VendorOpsProfileListItem>[]
    | undefined {
    return this._state.vendorOpsProfileListPM?.vendors;
  }

  async searchOpsVendors(label: string): Promise<void> {
    await this._state.vendorOpsProfileListPM?.onFilterUpdate({
      vendorOpsName: label,
    });
  }
}
interface VendorOnlineProfileListPMChildren {
  vendorOpsProfileListPM?: VendorOpsProfileListPM;
}

interface VendorOnlineProfileListPMParams {
  vendorType: VendorType;
  query?: Query;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
  children?: VendorOnlineProfileListPMChildren;
}

interface VendorOnlineProfileListStates {
  vendorOpsProfileListPM?: VendorOpsProfileListPM;
}
