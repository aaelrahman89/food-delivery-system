import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { createNotification } from '../../notification';
import { filterOperators } from '@survv/commons/core/models/Query';

export class TagsListPM extends BaseListingPM {
  constructor({
    tagsRepo,
    tagType,
    vendorType,
    query,
    notificationService,
    children = {},
  }) {
    super({
      filterMap: {
        tagType: { fieldName: 'type', operator: filterOperators.EQUAL },
        vendorType: {
          fieldName: 'vendorType',
          operator: filterOperators.EQUAL,
        },
      },
      hardFilter: { tagType, vendorType: vendorType.valueOf() },
      defaultQuery: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      query,
    });
    this._tagsRepo = tagsRepo;
    this.list = { totalItemsCount: 0, items: [] };
    this._notificationService = notificationService;
    this._states = {
      list: {
        tagFormPM: undefined,
      },
      creation: {
        tagFormPM: children.tagCreationPM,
      },
      update: {
        tagFormPM: children.tagUpdatePM,
      },
    };

    this._state = this._states.list;
  }

  get shouldOpenTagForm() {
    return [this._states.creation, this._states.update].includes(this._state);
  }

  get tagFormPM() {
    return this._state.tagFormPM;
  }

  openTagCreation() {
    this._state = this._states.creation;
    this.tagFormPM.reset();
  }

  openTagUpdate(tag) {
    this._state = this._states.update;
    this.tagFormPM.reset(tag.id);
  }

  closeTagForm() {
    this._state = this._states.list;
  }

  async onTagFormSubmit() {
    await this.refresh();
    this.closeTagForm();
  }

  async _hydrate() {
    try {
      await this._hydrateTagsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateTagsList() {
    this.list = await this._tagsRepo.listTags(this._backendQuery);
  }

  async refresh() {
    try {
      await this._hydrateTagsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }
}
