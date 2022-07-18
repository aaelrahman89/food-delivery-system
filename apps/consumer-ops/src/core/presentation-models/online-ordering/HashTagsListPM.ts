import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { HashTag, HashTagListItemOptions } from '../../models/HashTag';
import { HashTagCreationPM } from './HashTagCreationPM';
import { HashTagUpdatePM } from './HashTagUpdatePM';
import { HashTagsRepo } from '../../repositories/online-ordering/HashTagsRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQueryDeprecated,
  filterOperators,
} from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification';

interface HashTagsListPMOptions {
  hashTagsRepo: HashTagsRepo;
  query?: ListingQueryDeprecated;
  vendorType: VendorType;
  notificationService: NotificationService;
  children?:
    | { hashTagCreationPM: HashTagCreationPM; hashTagUpdatePM: HashTagUpdatePM }
    | undefined;
}

interface HashTagsListPMState {
  hashTagFormPM?: HashTagCreationPM | HashTagUpdatePM;
}

export class HashTagsListPM extends BaseListingPM {
  private readonly _hashTagsRepo: HashTagsRepo;
  private readonly _notificationService: NotificationService;
  private readonly _states: {
    list: HashTagsListPMState;
    creation: HashTagsListPMState;
    update: { hashTagFormPM?: HashTagUpdatePM };
  };

  private _state: HashTagsListPMState;

  children?: Record<string, HashTagCreationPM | HashTagUpdatePM>;
  list?: ItemsList<HashTag>;

  constructor(options: HashTagsListPMOptions) {
    const { hashTagsRepo, query, vendorType, notificationService, children } =
      options;
    super({
      defaultQuery: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      query,
      hardFilter: {
        vendorType: vendorType.valueOf(),
      },
      filterMap: {
        vendorType: {
          fieldName: 'vendorType',
          operator: filterOperators.EQUAL,
        },
      },
    });
    this._hashTagsRepo = hashTagsRepo;
    this.list = { totalItemsCount: 0, items: [] };
    this.children = children;
    this._notificationService = notificationService;
    this._states = {
      list: {
        hashTagFormPM: undefined,
      },
      creation: {
        hashTagFormPM: children?.hashTagCreationPM,
      },
      update: {
        hashTagFormPM: children?.hashTagUpdatePM,
      },
    };
    this._state = this._states.list;
  }

  get shouldOpenHashTagForm(): boolean {
    return [this._states.creation, this._states.update].includes(this._state);
  }

  get hashTagFormPM(): HashTagCreationPM | HashTagUpdatePM | undefined {
    return this._state.hashTagFormPM;
  }

  openHashTagCreation(): Promise<void> {
    this._state = this._states.creation;
    return this.hashTagFormPM!.reset();
  }

  openHashTagUpdate(hashTag: HashTagListItemOptions): void {
    this._states.update.hashTagFormPM!.initForm(hashTag);
    this._state = this._states.update;
  }

  closeHashTagForm(): void {
    this._state = this._states.list;
  }

  onHashTagFormSubmit(): Promise<void> {
    const refreshPromise = this.refresh();
    this.closeHashTagForm();
    return refreshPromise;
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateHashTagsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateHashTagsList(): Promise<void> {
    this.list = await this._hashTagsRepo.listHashTags(this._backendQuery);
  }

  async refresh(): Promise<void> {
    try {
      await this._hydrateHashTagsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }
}
