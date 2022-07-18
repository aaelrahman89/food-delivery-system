import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import {
  VendorOpsProfileList,
  VendorOpsProfileListItem,
} from '../../models/VendorOnlineProfile';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification/notification';
import { filterOperators } from '@survv/commons/core/models/Query';

interface VendorOpsProfileListPMParams {
  vendorType: VendorType;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
}

export class VendorOpsProfileListPM extends BaseListingPM {
  _list?: VendorOpsProfileList;
  private readonly _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _notificationService: NotificationService;

  constructor(params: VendorOpsProfileListPMParams) {
    const { vendorType, vendorOnlineProfileRepo, notificationService } = params;
    super({
      filterMap: {
        vendorType: { operator: filterOperators.EQUAL, fieldName: 'type' },
        hasProfile: {
          operator: filterOperators.EQUAL,
          fieldName: 'profile.hasProfile',
        },
        vendorOpsName: { operator: filterOperators.REGEX, fieldName: 'label' },
      },
      hardFilter: {
        vendorType: vendorType.valueOf(),
        hasProfile: false,
      },
      defaultQuery: {
        sort: {
          label: 'asc',
        },
      },
    });

    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this._notificationService = notificationService;

    this._list = undefined;
  }

  async refresh(): Promise<void> {
    await this._hydrateProfileList();
  }

  get vendors(): BottomSheetListGroup<VendorOpsProfileListItem>[] | undefined {
    if (!this._list) {
      return undefined;
    }
    return [
      {
        items: this._list.items.map((item: VendorOpsProfileListItem) => {
          return {
            icon: item.logo,
            id: item.vendorId,
            label: item.name,
            value: item,
          };
        }),
      },
    ];
  }

  async _hydrate(): Promise<void> {
    await this._hydrateProfileList();
  }

  async reset(): Promise<void> {
    return this.onFilterUpdate();
  }

  async _hydrateProfileList(): Promise<void> {
    try {
      this._list = await this._vendorOnlineProfileRepo.listOpsProfiles(
        this._backendQuery
      );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }
}
