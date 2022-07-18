import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { createNotification } from '../../notification';
import { filterOperators } from '@survv/commons/core/models/Query';

export class TagGroupsListPM extends BaseListingPM {
  constructor({
    tagGroupsRepo,
    query,
    vendorType,
    notificationService,
    children = {},
  }) {
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
      notificationService,
    });
    this._tagGroupsRepo = tagGroupsRepo;
    this.list = { totalItemsCount: 0, items: [] };
    this.children = children;
    this._notificationService = notificationService;
    this.linkedTags = [];
    this._states = {
      list: {
        tagGroupFormPM: undefined,
      },
      creation: {
        tagGroupFormPM: children.tagGroupCreationPM,
      },
      update: {
        tagGroupFormPM: children.tagGroupUpdatePM,
      },
    };
    this._enableTagSelection = false;
    this._enableLinkedTags = false;
    this._state = this._states.list;
  }

  async openLinkedTags(tagGroup) {
    this._enableLinkedTags = true;
    return this._hydrateLinkedTags(tagGroup);
  }

  closeLinkedTags() {
    this._enableLinkedTags = false;
  }

  openTagGroupCreation() {
    this._state = this._states.creation;
    this.tagGroupFormPM.reset();
  }

  openTagGroupUpdate(tagGroup) {
    this._state = this._states.update;
    this.tagGroupFormPM.reset(tagGroup.id);
  }

  openTagSelections() {
    this._enableTagSelection = true;
  }

  closeTagGroupForm() {
    this._state = this._states.list;
  }

  closeTagSelection() {
    this._enableTagSelection = false;
  }

  async onTagGroupFormSubmit() {
    await this.refresh();
    this.closeTagGroupForm();
  }

  get shouldOpenTagGroupForm() {
    return (
      [this._states.creation, this._states.update].includes(this._state) &&
      !this._enableTagSelection
    );
  }

  get tagGroupFormPM() {
    return this._state.tagGroupFormPM;
  }

  get shouldOpenTagSelection() {
    return this._enableTagSelection;
  }

  get shouldOpenLinkedTags() {
    return this._enableLinkedTags;
  }

  async _hydrate() {
    try {
      await this._hydrateTagGroupsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateTagGroupsList() {
    this.list = await this._tagGroupsRepo.listTagGroups(this._backendQuery);
  }

  async _hydrateLinkedTags(tagGroup) {
    return this._longProcess(async () => {
      try {
        this.linkedTags = [];
        const tagGroupDetails = await this._tagGroupsRepo.fetchTagGroup(
          tagGroup.id
        );
        const groupedTags = {};
        tagGroupDetails.tags.forEach((tag) => {
          if (!groupedTags[tag.type.toString()]) {
            groupedTags[tag.type.toString()] = [tag];
          } else {
            groupedTags[tag.type.toString()].push(tag);
          }
        });
        this.linkedTags = Object.entries(groupedTags).map(
          ([groupName, tags]) => {
            return {
              name: groupName,
              items: tags.map((tag) => {
                return {
                  id: tag.id,
                  label: tag.name,
                  icon: tag.icon,
                  value: tag,
                };
              }),
            };
          }
        );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async refresh() {
    try {
      await this._hydrateTagGroupsList();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }
}
