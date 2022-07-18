import { BasePM } from '@survv/commons/core/base/BasePM';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class AppManagementPM extends BasePM {
  constructor({
    homepageSectionsRepo,
    vendorType,
    notificationService,
    children = {},
  }) {
    super();
    this._notificationService = notificationService;
    this._vendorType = vendorType;
    this._homepageSectionsRepo = homepageSectionsRepo;
    this.appHomepage = {};
    this._notificationService = notificationService;
    this._sortedSections = [];
    this._states = {
      list: {
        sectionFormPM: undefined,
      },
      creation: {
        sectionFormPM: children.sectionCreationPM,
      },
    };
    this._state = this._states.list;
  }

  async onChangeVendorType(vendorType) {
    this._vendorType = vendorType;
    return this._refresh();
  }

  get shouldOpenSectionForm() {
    return [this._states.creation].includes(this._state);
  }

  get sectionFormPM() {
    return this._state.sectionFormPM;
  }

  openSectionCreation() {
    this._state = this._states.creation;
    this.sectionFormPM.reset(this._vendorType);
  }

  async onSectionFormSubmit() {
    await this._refresh();
    this.closeSectionForm();
  }

  closeSectionForm() {
    this._state = this._states.list;
  }

  get vendorType() {
    return this._vendorType;
  }

  async _hydrate() {
    try {
      this.appHomepage = await this._homepageSectionsRepo.listHomepageSections({
        vendorType: this._vendorType,
      });
      this._sortedSections = [...this.appHomepage.sections];
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  get disableSaveLayoutChanges() {
    return !this._isSectionsOrderChanged;
  }

  onSectionsOrderChanged(sortedSections) {
    this._sortedSections = sortedSections;
  }

  async saveLayoutChanges() {
    try {
      if (!this._isSectionsOrderChanged) {
        return false;
      }

      await this._homepageSectionsRepo.arrangeSections(
        this._vendorType,
        this._sortedSections
      );
      return true;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  get _isSectionsOrderChanged() {
    return !this.appHomepage.sections.every(
      (section, index) => section.id === this._sortedSections[index].id
    );
  }

  async _refresh() {
    await this._hydrate();
  }

  async removeSection(section) {
    try {
      await this._homepageSectionsRepo.removeHomepageSection(section);
      this._notificationService.notify(successfulOperation());
      await this._refresh();
      return true;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }
}
